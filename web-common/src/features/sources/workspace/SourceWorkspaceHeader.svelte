<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    Button,
    IconButton,
    IconSpaceFixer,
  } from "@rilldata/web-common/components/button";
  import Add from "@rilldata/web-common/components/icons/Add.svelte";
  import Import from "@rilldata/web-common/components/icons/Import.svelte";
  import Model from "@rilldata/web-common/components/icons/Model.svelte";
  import RefreshIcon from "@rilldata/web-common/components/icons/RefreshIcon.svelte";
  import Source from "@rilldata/web-common/components/icons/Source.svelte";
  import { notifications } from "@rilldata/web-common/components/notifications";
  import PanelCTA from "@rilldata/web-common/components/panel/PanelCTA.svelte";
  import ResponsiveButtonText from "@rilldata/web-common/components/panel/ResponsiveButtonText.svelte";
  import Tooltip from "@rilldata/web-common/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-common/components/tooltip/TooltipContent.svelte";
  import { useDashboardNames } from "@rilldata/web-common/features/dashboards/selectors";
  import { fileArtifactsStore } from "@rilldata/web-common/features/entity-management/file-artifacts-store";
  import { EntityType } from "@rilldata/web-common/features/entity-management/types";
  import { overlay } from "@rilldata/web-common/layout/overlay-store";
  import { behaviourEvent } from "@rilldata/web-common/metrics/initMetrics";
  import { BehaviourEventMedium } from "@rilldata/web-common/metrics/service/BehaviourEventTypes";
  import {
    MetricsEventScreenName,
    MetricsEventSpace,
  } from "@rilldata/web-common/metrics/service/MetricsTypes";
  import {
    createRuntimeServiceGetCatalogEntry,
    createRuntimeServicePutFileAndReconcile,
    createRuntimeServiceRefreshAndReconcile,
    createRuntimeServiceRenameFileAndReconcile,
    getRuntimeServiceGetCatalogEntryQueryKey,
    V1CatalogEntry,
    V1ReconcileResponse,
    V1Source,
  } from "@rilldata/web-common/runtime-client";
  import { appQueryStatusStore } from "@rilldata/web-common/runtime-client/application-store";
  import { invalidateAfterReconcile } from "@rilldata/web-common/runtime-client/invalidation";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { fade } from "svelte/transition";
  import { WorkspaceHeader } from "../../../layout/workspace";
  import { runtime } from "../../../runtime-client/runtime-store";
  import { renameFileArtifact } from "../../entity-management/actions";
  import { getRouteFromName } from "../../entity-management/entity-mappers";
  import { getName, isDuplicateName } from "../../entity-management/name-utils";
  import { useAllNames } from "../../entity-management/selectors";
  import { useModelNames } from "../../models/selectors";
  import { useCreateDashboardFromSource } from "../createDashboard";
  import { createModelFromSource } from "../createModel";
  import { refreshAndReconcile, refreshSource } from "../refreshSource";

  export let sourceName: string;
  export let path: string;
  export let embedded = false;

  const queryClient = useQueryClient();

  const renameSource = createRuntimeServiceRenameFileAndReconcile();

  $: runtimeInstanceId = $runtime.instanceId;
  const refreshSourceMutation = createRuntimeServiceRefreshAndReconcile();
  const createSource = createRuntimeServicePutFileAndReconcile();

  $: getSource = createRuntimeServiceGetCatalogEntry(
    runtimeInstanceId,
    sourceName
  );

  let headerWidth;
  $: isHeaderWidthSmall = headerWidth < 800;

  let entry: V1CatalogEntry;
  let source: V1Source;
  $: entry = $getSource?.data?.entry;
  $: source = entry?.source;

  $: modelNames = useModelNames(runtimeInstanceId);
  $: dashboardNames = useDashboardNames(runtimeInstanceId);
  const createModelMutation = createRuntimeServicePutFileAndReconcile();
  const createDashboardFromSourceMutation = useCreateDashboardFromSource();

  let connector: string;
  $: connector = $getSource.data?.entry?.source.connector as string;

  $: allNamesQuery = useAllNames(runtimeInstanceId);

  const handleCreateModelFromSource = async () => {
    const modelName = await createModelFromSource(
      queryClient,
      runtimeInstanceId,
      $modelNames.data,
      sourceName,
      embedded ? `"${path}"` : sourceName,
      $createModelMutation
    );
    behaviourEvent.fireNavigationEvent(
      modelName,
      BehaviourEventMedium.Button,
      MetricsEventSpace.RightPanel,
      MetricsEventScreenName.Source,
      MetricsEventScreenName.Model
    );
  };

  const handleCreateDashboardFromSource = (sourceName: string) => {
    overlay.set({
      title: "Creating a dashboard for " + sourceName,
    });
    const newModelName = getName(`${sourceName}_model`, $modelNames.data);
    const newDashboardName = getName(
      `${sourceName}_dashboard`,
      $dashboardNames.data
    );
    $createDashboardFromSourceMutation.mutate(
      {
        data: {
          instanceId: $runtime.instanceId,
          sourceName,
          newModelName,
          newDashboardName,
        },
      },
      {
        onSuccess: async (resp: V1ReconcileResponse) => {
          fileArtifactsStore.setErrors(resp.affectedPaths, resp.errors);
          goto(`/dashboard/${newDashboardName}`);
          behaviourEvent.fireNavigationEvent(
            newDashboardName,
            BehaviourEventMedium.Button,
            MetricsEventSpace.RightPanel,
            MetricsEventScreenName.Source,
            MetricsEventScreenName.Dashboard
          );
          return invalidateAfterReconcile(queryClient, runtimeInstanceId, resp);
        },
        onSettled: () => {
          overlay.set(null);
        },
      }
    );
  };

  const onChangeCallback = async (e) => {
    if (!e.target.value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      notifications.send({
        message:
          "Source name must start with a letter or underscore and contain only letters, numbers, and underscores",
      });
      e.target.value = sourceName; // resets the input
      return;
    }
    if (isDuplicateName(e.target.value, sourceName, $allNamesQuery.data)) {
      notifications.send({
        message: `Name ${e.target.value} is already in use`,
      });
      e.target.value = sourceName; // resets the input
      return;
    }

    try {
      const toName = e.target.value;
      const entityType = EntityType.Table;
      await renameFileArtifact(
        queryClient,
        runtimeInstanceId,
        sourceName,
        toName,
        entityType,
        $renameSource
      );
      goto(getRouteFromName(toName, entityType), {
        replaceState: true,
      });
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const onRefreshClick = async (tableName: string) => {
    try {
      if (embedded) {
        await refreshAndReconcile(
          tableName,
          runtimeInstanceId,
          $refreshSourceMutation,
          queryClient,
          source.properties.path,
          path
        );
      } else {
        await refreshSource(
          connector,
          tableName,
          runtimeInstanceId,
          $refreshSourceMutation,
          $createSource,
          queryClient,
          source?.connector === "s3" ||
            source?.connector === "gcs" ||
            source?.connector === "https"
            ? source?.properties?.path
            : sourceName
        );
      }
      // invalidate the "refreshed_on" time
      const queryKey = getRuntimeServiceGetCatalogEntryQueryKey(
        runtimeInstanceId,
        tableName
      );
      await queryClient.refetchQueries(queryKey);
    } catch (err) {
      // no-op
    }
    overlay.set(null);
  };

  function formatRefreshedOn(refreshedOn: string) {
    const date = new Date(refreshedOn);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }
</script>

<div class="grid items-center" style:grid-template-columns="auto max-content">
  <WorkspaceHeader
    {...{ titleInput: embedded ? path : sourceName, onChangeCallback }}
    appRunning={$appQueryStatusStore}
    editable={!embedded}
    let:width
    width={headerWidth}
  >
    <svelte:fragment slot="icon">
      <Source />
    </svelte:fragment>
    <svelte:fragment slot="workspace-controls">
      {#if $refreshSourceMutation.isLoading}
        Refreshing...
      {:else}
        <div class="flex items-center pr-2 gap-x-2">
          {#if $getSource.isSuccess && $getSource.data?.entry?.refreshedOn}
            <div
              class="ui-copy-muted"
              style:font-size="11px"
              transition:fade|local={{ duration: 200 }}
            >
              Imported on {formatRefreshedOn(
                $getSource.data?.entry?.refreshedOn
              )}
            </div>
          {/if}
          {#if connector === "file"}
            <Tooltip location="bottom" distance={8}>
              <div style="transformY(-1px)">
                <IconButton on:click={() => onRefreshClick(sourceName)}>
                  <Import size="15px" />
                </IconButton>
              </div>
              <TooltipContent slot="tooltip-content">
                Import local file to refresh source
              </TooltipContent>
            </Tooltip>
          {:else}
            <Tooltip location="bottom" distance={8}>
              <IconButton on:click={() => onRefreshClick(sourceName)}>
                <RefreshIcon size="15px" />
              </IconButton>
              <TooltipContent slot="tooltip-content">
                Refresh the source data
              </TooltipContent>
            </Tooltip>
          {/if}
        </div>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="cta">
      <PanelCTA side="right">
        <Tooltip distance={16} location="left">
          <Button on:click={handleCreateModelFromSource} type="secondary">
            <IconSpaceFixer pullLeft pullRight={isHeaderWidthSmall}
              ><Model size="12px" /></IconSpaceFixer
            >
            <ResponsiveButtonText collapse={isHeaderWidthSmall}>
              Create Model
            </ResponsiveButtonText>
          </Button>
          <TooltipContent slot="tooltip-content">
            Model this source with SQL
          </TooltipContent>
        </Tooltip>
        {#if !embedded}
          <Tooltip alignment="right" distance={16} location="bottom">
            <Button
              on:click={() => handleCreateDashboardFromSource(sourceName)}
              type="primary"
            >
              <IconSpaceFixer pullLeft pullRight={isHeaderWidthSmall}
                ><Add /></IconSpaceFixer
              >

              <ResponsiveButtonText collapse={isHeaderWidthSmall}>
                Create Dashboard
              </ResponsiveButtonText>
            </Button>
            <TooltipContent slot="tooltip-content">
              Create a dashboard for this source
            </TooltipContent>
          </Tooltip>
        {/if}
      </PanelCTA>
    </svelte:fragment>
  </WorkspaceHeader>
</div>
