package github

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync/atomic"
	"time"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/eapache/go-resiliency/retrier"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/transport"
	"github.com/rilldata/rill/runtime/drivers"
	"go.uber.org/zap"
	"golang.org/x/sync/singleflight"
)

const (
	pullTimeout = 10 * time.Minute
	retryN      = 3
	retryWait   = 500 * time.Millisecond
)

type DSN struct {
	GithubURL      string `json:"github_url"`
	Subpath        string `json:"subpath"`
	Branch         string `json:"branch"`
	InstallationID int64  `json:"installation_id"`
}

func init() {
	drivers.Register("github", driver{})
}

type driver struct{}

func (d driver) Open(dsnStr string, logger *zap.Logger) (drivers.Connection, error) {
	var dsn DSN
	err := json.Unmarshal([]byte(dsnStr), &dsn)
	if err != nil {
		return nil, err
	}

	tempdir, err := os.MkdirTemp("", "github_repo_driver")
	if err != nil {
		return nil, err
	}

	tempdir, err = filepath.Abs(tempdir)
	if err != nil {
		return nil, err
	}

	projectDir := tempdir
	if dsn.Subpath != "" {
		projectDir = filepath.Join(tempdir, dsn.Subpath)
	}

	// NOTE :: project isn't cloned yet
	return &connection{
		dsnStr:       dsnStr,
		dsn:          dsn,
		tempdir:      tempdir,
		projectdir:   projectDir,
		singleflight: &singleflight.Group{},
	}, nil
}

func (d driver) Drop(dsn string, logger *zap.Logger) error {
	return drivers.ErrDropNotSupported
}

type connection struct {
	dsnStr              string
	dsn                 DSN
	tempdir             string // tempdir path should be absolute
	projectdir          string
	cloneURLWithToken   string
	cloneURLRefreshedOn time.Time
	singleflight        *singleflight.Group
	cloned              atomic.Bool
}

// Close implements drivers.Connection.
func (c *connection) Close() error {
	err := os.RemoveAll(c.tempdir)
	if err != nil {
		return err
	}

	return nil
}

// Registry implements drivers.Connection.
func (c *connection) RegistryStore() (drivers.RegistryStore, bool) {
	return nil, false
}

// Catalog implements drivers.Connection.
func (c *connection) CatalogStore() (drivers.CatalogStore, bool) {
	return nil, false
}

// Repo implements drivers.Connection.
func (c *connection) RepoStore() (drivers.RepoStore, bool) {
	return c, true
}

// OLAP implements drivers.Connection.
func (c *connection) OLAPStore() (drivers.OLAPStore, bool) {
	return nil, false
}

// Migrate implements drivers.Connection.
func (c *connection) Migrate(ctx context.Context) (err error) {
	return nil
}

// MigrationStatus implements drivers.Connection.
func (c *connection) MigrationStatus(ctx context.Context) (current, desired int, err error) {
	return 0, 0, nil
}

// cloneOrPull clones or pulls the repo with an exponential backoff retry on retryable errors.
// It's safe for concurrent calls, which are deduplicated.
func (c *connection) cloneOrPull(ctx context.Context, onlyClone bool) error {
	if onlyClone && c.cloned.Load() {
		return nil
	}

	ch := c.singleflight.DoChan("pullOrClone", func() (interface{}, error) {
		ctx, cancel := context.WithTimeout(context.Background(), pullTimeout)
		defer cancel()

		r := retrier.New(retrier.ExponentialBackoff(retryN, retryWait), retryErrClassifier{})
		err := r.Run(func() error { return c.cloneOrPullUnsafe(ctx) })
		if err != nil {
			return nil, err
		}
		return nil, nil
	})

	select {
	case <-ctx.Done():
		return ctx.Err()
	case res := <-ch:
		return res.Err
	}
}

// cloneOrPullUnsafe pulls changes from the repo. Also clones the repo if it hasn't been cloned already.
func (c *connection) cloneOrPullUnsafe(ctx context.Context) error {
	if !c.cloned.Load() {
		err := c.cloneUnsafe(ctx)
		c.cloned.Store(err == nil)
		return err
	}

	return c.pullUnsafe(ctx)
}

// pullUnsafe pulls changes from the repo. Requires repo to be cloned already.
// Unsafe for concurrent use.
func (c *connection) pullUnsafe(ctx context.Context) error {
	repo, err := git.PlainOpen(c.tempdir)
	if err != nil {
		return err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return err
	}

	cloneURL, err := c.cloneURL(ctx)
	if err != nil {
		return err
	}

	err = wt.Pull(&git.PullOptions{RemoteURL: cloneURL})
	if errors.Is(err, git.NoErrAlreadyUpToDate) {
		return nil
	} else if err != nil {
		return err
	}

	return nil
}

// cloneUnsafe runs the initial clone of the repo.
func (c *connection) cloneUnsafe(ctx context.Context) error {
	cloneURL, err := c.cloneURL(ctx)
	if err != nil {
		return err
	}

	_, err = git.PlainClone(c.tempdir, false, &git.CloneOptions{
		URL:           cloneURL,
		ReferenceName: plumbing.NewBranchReferenceName(c.dsn.Branch),
		SingleBranch:  true,
	})
	return err
}

const cloneURLTTL = 30 * time.Minute

// renewCloneURL retrieves a new clone URL containing an authentication token for the repo.
func (c *connection) cloneURL(ctx context.Context) (string, error) {
	// Return cached token if not expired
	if c.cloneURLWithToken != "" && time.Since(c.cloneURLRefreshedOn) < cloneURLTTL {
		return c.cloneURLWithToken, nil
	}

	// This driver expects Github App credentials to be available from the environment.
	// TODO: The parsing probably should not happen here.
	appID, _ := strconv.ParseInt(os.Getenv("RILL_RUNTIME_GITHUB_APP_ID"), 10, 64)
	if appID == 0 {
		return "", fmt.Errorf("invalid value provided for RILL_RUNTIME_GITHUB_APP_ID")
	}
	privateKey := os.Getenv("RILL_RUNTIME_GITHUB_APP_PRIVATE_KEY")
	if privateKey == "" {
		return "", fmt.Errorf("invalid value provided for RILL_RUNTIME_GITHUB_APP_PRIVATE_KEY")
	}

	// Get a Github token for this installation ID
	itr, err := ghinstallation.New(http.DefaultTransport, appID, c.dsn.InstallationID, []byte(privateKey))
	if err != nil {
		return "", fmt.Errorf("failed to create github installation transport: %w", err)
	}
	token, err := itr.Token(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to create token: %w", err)
	}

	// Create clone URL
	ep, err := transport.NewEndpoint(c.dsn.GithubURL + ".git") // TODO: Can the clone URL be different from the HTTP URL of a Github repo?
	if err != nil {
		return "", fmt.Errorf("failed to create endpoint from %q: %w", c.dsn.GithubURL, err)
	}
	ep.User = "x-access-token"
	ep.Password = token
	cloneURL := ep.String()

	// Cache it
	c.cloneURLWithToken = cloneURL
	c.cloneURLRefreshedOn = time.Now()

	// Done
	return cloneURL, nil
}

// retryErrClassifier classifies Github request errors as retryable or not.
type retryErrClassifier struct{}

func (retryErrClassifier) Classify(err error) retrier.Action {
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		return retrier.Fail
	}

	ghinstallationErr := &ghinstallation.HTTPError{}
	if errors.As(err, &ghinstallationErr) && ghinstallationErr.Response != nil {
		statusCode := ghinstallationErr.Response.StatusCode
		if statusCode/100 == 4 && statusCode != 429 {
			// Any 4xx error apart from 429 is non retryable
			return retrier.Fail
		}
	}

	return retrier.Retry
}
