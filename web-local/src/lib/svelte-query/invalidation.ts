import {
  getRuntimeServiceGetCatalogEntryQueryKey,
  getRuntimeServiceGetFileQueryKey,
  getRuntimeServiceListCatalogEntriesQueryKey,
  getRuntimeServiceListFilesQueryKey,
} from "@rilldata/web-common/runtime-client";
import type { V1ReconcileResponse } from "@rilldata/web-common/runtime-client";
import { getNameFromFile } from "@rilldata/web-local/lib/util/entity-mappers";
import type { QueryClient } from "@sveltestack/svelte-query";

// invalidation helpers

export const invalidateAfterReconcile = async (
  queryClient: QueryClient,
  instanceId: string,
  reconcileResponse: V1ReconcileResponse
) => {
  await Promise.all([
    queryClient.refetchQueries(getRuntimeServiceListFilesQueryKey(instanceId)),
    queryClient.refetchQueries(
      getRuntimeServiceListCatalogEntriesQueryKey(instanceId)
    ),
  ]);
  await Promise.all(
    reconcileResponse.affectedPaths
      .map((affectedPath) => [
        queryClient.refetchQueries(
          getRuntimeServiceGetFileQueryKey(instanceId, affectedPath)
        ),
        queryClient.refetchQueries(
          getRuntimeServiceGetCatalogEntryQueryKey(
            instanceId,
            getNameFromFile(affectedPath)
          )
        ),
      ])
      .flat()
  );
};

export const invalidateMetricsViewData = (
  queryClient: QueryClient,
  instanceId: string,
  metricsViewName: string
) => {
  return queryClient.refetchQueries({
    predicate: (query) =>
      typeof query.queryKey[0] === "string" &&
      query.queryKey[0].startsWith(
        `/v1/instances/${instanceId}/metrics-views/${metricsViewName}/`
      ),
  });
};