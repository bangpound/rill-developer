/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * rill/runtime/v1/schema.proto
 * OpenAPI spec version: version not set
 */
import { createQuery, createMutation } from "@tanstack/svelte-query";
import type {
  CreateQueryOptions,
  CreateMutationOptions,
  QueryFunction,
  MutationFunction,
  CreateQueryResult,
  QueryKey,
} from "@tanstack/svelte-query";
import type {
  V1ListConnectorsResponse,
  RpcStatus,
  V1DeleteFileAndReconcileResponse,
  V1DeleteFileAndReconcileRequest,
  V1ListExamplesResponse,
  V1ListInstancesResponse,
  RuntimeServiceListInstancesParams,
  V1CreateInstanceResponse,
  V1CreateInstanceRequest,
  V1GetInstanceResponse,
  V1DeleteInstanceResponse,
  RuntimeServiceDeleteInstanceBody,
  V1EditInstanceResponse,
  RuntimeServiceEditInstanceBody,
  V1ListCatalogEntriesResponse,
  RuntimeServiceListCatalogEntriesParams,
  V1GetCatalogEntryResponse,
  V1TriggerRefreshResponse,
  V1ListFilesResponse,
  RuntimeServiceListFilesParams,
  V1GetFileResponse,
  V1DeleteFileResponse,
  V1PutFileResponse,
  RuntimeServicePutFileBody,
  V1RenameFileResponse,
  RuntimeServiceRenameFileBody,
  V1UnpackEmptyResponse,
  RuntimeServiceUnpackEmptyBody,
  V1UnpackExampleResponse,
  RuntimeServiceUnpackExampleBody,
  V1ReconcileResponse,
  RuntimeServiceReconcileBody,
  V1TriggerSyncResponse,
  V1PingResponse,
  V1PutFileAndReconcileResponse,
  V1PutFileAndReconcileRequest,
  V1RefreshAndReconcileResponse,
  V1RefreshAndReconcileRequest,
  V1RenameFileAndReconcileResponse,
  V1RenameFileAndReconcileRequest,
} from "../index.schemas";
import { httpClient } from "../../http-client";

/**
 * @summary ListConnectors returns a description of all the connectors implemented in the runtime,
including their schema and validation rules
 */
export const runtimeServiceListConnectors = (signal?: AbortSignal) => {
  return httpClient<V1ListConnectorsResponse>({
    url: `/v1/connectors/meta`,
    method: "get",
    signal,
  });
};

export const getRuntimeServiceListConnectorsQueryKey = () =>
  [`/v1/connectors/meta`] as const;

export type RuntimeServiceListConnectorsQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceListConnectors>>
>;
export type RuntimeServiceListConnectorsQueryError = RpcStatus;

export const createRuntimeServiceListConnectors = <
  TData = Awaited<ReturnType<typeof runtimeServiceListConnectors>>,
  TError = RpcStatus
>(options?: {
  query?: CreateQueryOptions<
    Awaited<ReturnType<typeof runtimeServiceListConnectors>>,
    TError,
    TData
  >;
}): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getRuntimeServiceListConnectorsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceListConnectors>>
  > = ({ signal }) => runtimeServiceListConnectors(signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceListConnectors>>,
    TError,
    TData
  >({ queryKey, queryFn, ...queryOptions }) as CreateQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary DeleteFileAndReconcile combines RenameFile and Reconcile in a single endpoint to reduce latency.
 */
export const runtimeServiceDeleteFileAndReconcile = (
  v1DeleteFileAndReconcileRequest: V1DeleteFileAndReconcileRequest
) => {
  return httpClient<V1DeleteFileAndReconcileResponse>({
    url: `/v1/delete-and-reconcile`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: v1DeleteFileAndReconcileRequest,
  });
};

export type RuntimeServiceDeleteFileAndReconcileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceDeleteFileAndReconcile>>
>;
export type RuntimeServiceDeleteFileAndReconcileMutationBody =
  V1DeleteFileAndReconcileRequest;
export type RuntimeServiceDeleteFileAndReconcileMutationError = RpcStatus;

export const createRuntimeServiceDeleteFileAndReconcile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceDeleteFileAndReconcile>>,
    TError,
    { data: V1DeleteFileAndReconcileRequest },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceDeleteFileAndReconcile>>,
    { data: V1DeleteFileAndReconcileRequest }
  > = (props) => {
    const { data } = props ?? {};

    return runtimeServiceDeleteFileAndReconcile(data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceDeleteFileAndReconcile>>,
    TError,
    { data: V1DeleteFileAndReconcileRequest },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary ListExamples lists all the examples embedded into binary
 */
export const runtimeServiceListExamples = (signal?: AbortSignal) => {
  return httpClient<V1ListExamplesResponse>({
    url: `/v1/examples`,
    method: "get",
    signal,
  });
};

export const getRuntimeServiceListExamplesQueryKey = () =>
  [`/v1/examples`] as const;

export type RuntimeServiceListExamplesQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceListExamples>>
>;
export type RuntimeServiceListExamplesQueryError = RpcStatus;

export const createRuntimeServiceListExamples = <
  TData = Awaited<ReturnType<typeof runtimeServiceListExamples>>,
  TError = RpcStatus
>(options?: {
  query?: CreateQueryOptions<
    Awaited<ReturnType<typeof runtimeServiceListExamples>>,
    TError,
    TData
  >;
}): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getRuntimeServiceListExamplesQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceListExamples>>
  > = ({ signal }) => runtimeServiceListExamples(signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceListExamples>>,
    TError,
    TData
  >({ queryKey, queryFn, ...queryOptions }) as CreateQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary ListInstances lists all the instances currently managed by the runtime
 */
export const runtimeServiceListInstances = (
  params?: RuntimeServiceListInstancesParams,
  signal?: AbortSignal
) => {
  return httpClient<V1ListInstancesResponse>({
    url: `/v1/instances`,
    method: "get",
    params,
    signal,
  });
};

export const getRuntimeServiceListInstancesQueryKey = (
  params?: RuntimeServiceListInstancesParams
) => [`/v1/instances`, ...(params ? [params] : [])] as const;

export type RuntimeServiceListInstancesQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceListInstances>>
>;
export type RuntimeServiceListInstancesQueryError = RpcStatus;

export const createRuntimeServiceListInstances = <
  TData = Awaited<ReturnType<typeof runtimeServiceListInstances>>,
  TError = RpcStatus
>(
  params?: RuntimeServiceListInstancesParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceListInstances>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getRuntimeServiceListInstancesQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceListInstances>>
  > = ({ signal }) => runtimeServiceListInstances(params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceListInstances>>,
    TError,
    TData
  >({ queryKey, queryFn, ...queryOptions }) as CreateQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary CreateInstance creates a new instance
 */
export const runtimeServiceCreateInstance = (
  v1CreateInstanceRequest: V1CreateInstanceRequest
) => {
  return httpClient<V1CreateInstanceResponse>({
    url: `/v1/instances`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: v1CreateInstanceRequest,
  });
};

export type RuntimeServiceCreateInstanceMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceCreateInstance>>
>;
export type RuntimeServiceCreateInstanceMutationBody = V1CreateInstanceRequest;
export type RuntimeServiceCreateInstanceMutationError = RpcStatus;

export const createRuntimeServiceCreateInstance = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceCreateInstance>>,
    TError,
    { data: V1CreateInstanceRequest },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceCreateInstance>>,
    { data: V1CreateInstanceRequest }
  > = (props) => {
    const { data } = props ?? {};

    return runtimeServiceCreateInstance(data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceCreateInstance>>,
    TError,
    { data: V1CreateInstanceRequest },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary GetInstance returns information about a specific instance
 */
export const runtimeServiceGetInstance = (
  instanceId: string,
  signal?: AbortSignal
) => {
  return httpClient<V1GetInstanceResponse>({
    url: `/v1/instances/${instanceId}`,
    method: "get",
    signal,
  });
};

export const getRuntimeServiceGetInstanceQueryKey = (instanceId: string) =>
  [`/v1/instances/${instanceId}`] as const;

export type RuntimeServiceGetInstanceQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceGetInstance>>
>;
export type RuntimeServiceGetInstanceQueryError = RpcStatus;

export const createRuntimeServiceGetInstance = <
  TData = Awaited<ReturnType<typeof runtimeServiceGetInstance>>,
  TError = RpcStatus
>(
  instanceId: string,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceGetInstance>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getRuntimeServiceGetInstanceQueryKey(instanceId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceGetInstance>>
  > = ({ signal }) => runtimeServiceGetInstance(instanceId, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceGetInstance>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!instanceId,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary DeleteInstance deletes an instance
 */
export const runtimeServiceDeleteInstance = (
  instanceId: string,
  runtimeServiceDeleteInstanceBody: RuntimeServiceDeleteInstanceBody
) => {
  return httpClient<V1DeleteInstanceResponse>({
    url: `/v1/instances/${instanceId}`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceDeleteInstanceBody,
  });
};

export type RuntimeServiceDeleteInstanceMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceDeleteInstance>>
>;
export type RuntimeServiceDeleteInstanceMutationBody =
  RuntimeServiceDeleteInstanceBody;
export type RuntimeServiceDeleteInstanceMutationError = RpcStatus;

export const createRuntimeServiceDeleteInstance = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceDeleteInstance>>,
    TError,
    { instanceId: string; data: RuntimeServiceDeleteInstanceBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceDeleteInstance>>,
    { instanceId: string; data: RuntimeServiceDeleteInstanceBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceDeleteInstance(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceDeleteInstance>>,
    TError,
    { instanceId: string; data: RuntimeServiceDeleteInstanceBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary EditInstance edits an existing instance
 */
export const runtimeServiceEditInstance = (
  instanceId: string,
  runtimeServiceEditInstanceBody: RuntimeServiceEditInstanceBody
) => {
  return httpClient<V1EditInstanceResponse>({
    url: `/v1/instances/${instanceId}`,
    method: "put",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceEditInstanceBody,
  });
};

export type RuntimeServiceEditInstanceMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceEditInstance>>
>;
export type RuntimeServiceEditInstanceMutationBody =
  RuntimeServiceEditInstanceBody;
export type RuntimeServiceEditInstanceMutationError = RpcStatus;

export const createRuntimeServiceEditInstance = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceEditInstance>>,
    TError,
    { instanceId: string; data: RuntimeServiceEditInstanceBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceEditInstance>>,
    { instanceId: string; data: RuntimeServiceEditInstanceBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceEditInstance(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceEditInstance>>,
    TError,
    { instanceId: string; data: RuntimeServiceEditInstanceBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary ListCatalogEntries lists all the entries registered in an instance's catalog (like tables, sources or metrics views)
 */
export const runtimeServiceListCatalogEntries = (
  instanceId: string,
  params?: RuntimeServiceListCatalogEntriesParams,
  signal?: AbortSignal
) => {
  return httpClient<V1ListCatalogEntriesResponse>({
    url: `/v1/instances/${instanceId}/catalog`,
    method: "get",
    params,
    signal,
  });
};

export const getRuntimeServiceListCatalogEntriesQueryKey = (
  instanceId: string,
  params?: RuntimeServiceListCatalogEntriesParams
) =>
  [`/v1/instances/${instanceId}/catalog`, ...(params ? [params] : [])] as const;

export type RuntimeServiceListCatalogEntriesQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceListCatalogEntries>>
>;
export type RuntimeServiceListCatalogEntriesQueryError = RpcStatus;

export const createRuntimeServiceListCatalogEntries = <
  TData = Awaited<ReturnType<typeof runtimeServiceListCatalogEntries>>,
  TError = RpcStatus
>(
  instanceId: string,
  params?: RuntimeServiceListCatalogEntriesParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceListCatalogEntries>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getRuntimeServiceListCatalogEntriesQueryKey(instanceId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceListCatalogEntries>>
  > = ({ signal }) =>
    runtimeServiceListCatalogEntries(instanceId, params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceListCatalogEntries>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!instanceId,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary GetCatalogEntry returns information about a specific entry in the catalog
 */
export const runtimeServiceGetCatalogEntry = (
  instanceId: string,
  name: string,
  signal?: AbortSignal
) => {
  return httpClient<V1GetCatalogEntryResponse>({
    url: `/v1/instances/${instanceId}/catalog/${name}`,
    method: "get",
    signal,
  });
};

export const getRuntimeServiceGetCatalogEntryQueryKey = (
  instanceId: string,
  name: string
) => [`/v1/instances/${instanceId}/catalog/${name}`] as const;

export type RuntimeServiceGetCatalogEntryQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceGetCatalogEntry>>
>;
export type RuntimeServiceGetCatalogEntryQueryError = RpcStatus;

export const createRuntimeServiceGetCatalogEntry = <
  TData = Awaited<ReturnType<typeof runtimeServiceGetCatalogEntry>>,
  TError = RpcStatus
>(
  instanceId: string,
  name: string,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceGetCatalogEntry>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getRuntimeServiceGetCatalogEntryQueryKey(instanceId, name);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceGetCatalogEntry>>
  > = ({ signal }) => runtimeServiceGetCatalogEntry(instanceId, name, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceGetCatalogEntry>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!(instanceId && name),
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary TriggerRefresh triggers a refresh of a refreshable catalog object.
It currently only supports sources (which will be re-ingested), but will also support materialized models in the future.
It does not respond until the refresh has completed (will move to async jobs when the task scheduler is in place).
 */
export const runtimeServiceTriggerRefresh = (
  instanceId: string,
  name: string
) => {
  return httpClient<V1TriggerRefreshResponse>({
    url: `/v1/instances/${instanceId}/catalog/${name}/refresh`,
    method: "post",
  });
};

export type RuntimeServiceTriggerRefreshMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceTriggerRefresh>>
>;

export type RuntimeServiceTriggerRefreshMutationError = RpcStatus;

export const createRuntimeServiceTriggerRefresh = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceTriggerRefresh>>,
    TError,
    { instanceId: string; name: string },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceTriggerRefresh>>,
    { instanceId: string; name: string }
  > = (props) => {
    const { instanceId, name } = props ?? {};

    return runtimeServiceTriggerRefresh(instanceId, name);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceTriggerRefresh>>,
    TError,
    { instanceId: string; name: string },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary ListFiles lists all the files matching a glob in a repo.
The files are sorted by their full path.
 */
export const runtimeServiceListFiles = (
  instanceId: string,
  params?: RuntimeServiceListFilesParams,
  signal?: AbortSignal
) => {
  return httpClient<V1ListFilesResponse>({
    url: `/v1/instances/${instanceId}/files`,
    method: "get",
    params,
    signal,
  });
};

export const getRuntimeServiceListFilesQueryKey = (
  instanceId: string,
  params?: RuntimeServiceListFilesParams
) =>
  [`/v1/instances/${instanceId}/files`, ...(params ? [params] : [])] as const;

export type RuntimeServiceListFilesQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceListFiles>>
>;
export type RuntimeServiceListFilesQueryError = RpcStatus;

export const createRuntimeServiceListFiles = <
  TData = Awaited<ReturnType<typeof runtimeServiceListFiles>>,
  TError = RpcStatus
>(
  instanceId: string,
  params?: RuntimeServiceListFilesParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceListFiles>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getRuntimeServiceListFilesQueryKey(instanceId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceListFiles>>
  > = ({ signal }) => runtimeServiceListFiles(instanceId, params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceListFiles>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!instanceId,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary GetFile returns the contents of a specific file in a repo.
 */
export const runtimeServiceGetFile = (
  instanceId: string,
  path: string,
  signal?: AbortSignal
) => {
  return httpClient<V1GetFileResponse>({
    url: `/v1/instances/${instanceId}/files/-/${path}`,
    method: "get",
    signal,
  });
};

export const getRuntimeServiceGetFileQueryKey = (
  instanceId: string,
  path: string
) => [`/v1/instances/${instanceId}/files/-/${path}`] as const;

export type RuntimeServiceGetFileQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceGetFile>>
>;
export type RuntimeServiceGetFileQueryError = RpcStatus;

export const createRuntimeServiceGetFile = <
  TData = Awaited<ReturnType<typeof runtimeServiceGetFile>>,
  TError = RpcStatus
>(
  instanceId: string,
  path: string,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof runtimeServiceGetFile>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getRuntimeServiceGetFileQueryKey(instanceId, path);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServiceGetFile>>
  > = ({ signal }) => runtimeServiceGetFile(instanceId, path, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServiceGetFile>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!(instanceId && path),
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary DeleteFile deletes a file from a repo
 */
export const runtimeServiceDeleteFile = (instanceId: string, path: string) => {
  return httpClient<V1DeleteFileResponse>({
    url: `/v1/instances/${instanceId}/files/-/${path}`,
    method: "delete",
  });
};

export type RuntimeServiceDeleteFileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceDeleteFile>>
>;

export type RuntimeServiceDeleteFileMutationError = RpcStatus;

export const createRuntimeServiceDeleteFile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceDeleteFile>>,
    TError,
    { instanceId: string; path: string },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceDeleteFile>>,
    { instanceId: string; path: string }
  > = (props) => {
    const { instanceId, path } = props ?? {};

    return runtimeServiceDeleteFile(instanceId, path);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceDeleteFile>>,
    TError,
    { instanceId: string; path: string },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary PutFile creates or updates a file in a repo
 */
export const runtimeServicePutFile = (
  instanceId: string,
  path: string,
  runtimeServicePutFileBody: RuntimeServicePutFileBody
) => {
  return httpClient<V1PutFileResponse>({
    url: `/v1/instances/${instanceId}/files/-/${path}`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServicePutFileBody,
  });
};

export type RuntimeServicePutFileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServicePutFile>>
>;
export type RuntimeServicePutFileMutationBody = RuntimeServicePutFileBody;
export type RuntimeServicePutFileMutationError = RpcStatus;

export const createRuntimeServicePutFile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServicePutFile>>,
    TError,
    { instanceId: string; path: string; data: RuntimeServicePutFileBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServicePutFile>>,
    { instanceId: string; path: string; data: RuntimeServicePutFileBody }
  > = (props) => {
    const { instanceId, path, data } = props ?? {};

    return runtimeServicePutFile(instanceId, path, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServicePutFile>>,
    TError,
    { instanceId: string; path: string; data: RuntimeServicePutFileBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary RenameFile renames a file in a repo
 */
export const runtimeServiceRenameFile = (
  instanceId: string,
  runtimeServiceRenameFileBody: RuntimeServiceRenameFileBody
) => {
  return httpClient<V1RenameFileResponse>({
    url: `/v1/instances/${instanceId}/files/rename`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceRenameFileBody,
  });
};

export type RuntimeServiceRenameFileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceRenameFile>>
>;
export type RuntimeServiceRenameFileMutationBody = RuntimeServiceRenameFileBody;
export type RuntimeServiceRenameFileMutationError = RpcStatus;

export const createRuntimeServiceRenameFile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceRenameFile>>,
    TError,
    { instanceId: string; data: RuntimeServiceRenameFileBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceRenameFile>>,
    { instanceId: string; data: RuntimeServiceRenameFileBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceRenameFile(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceRenameFile>>,
    TError,
    { instanceId: string; data: RuntimeServiceRenameFileBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary UnpackEmpty unpacks an empty project
 */
export const runtimeServiceUnpackEmpty = (
  instanceId: string,
  runtimeServiceUnpackEmptyBody: RuntimeServiceUnpackEmptyBody
) => {
  return httpClient<V1UnpackEmptyResponse>({
    url: `/v1/instances/${instanceId}/files/unpack-empty`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceUnpackEmptyBody,
  });
};

export type RuntimeServiceUnpackEmptyMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceUnpackEmpty>>
>;
export type RuntimeServiceUnpackEmptyMutationBody =
  RuntimeServiceUnpackEmptyBody;
export type RuntimeServiceUnpackEmptyMutationError = RpcStatus;

export const createRuntimeServiceUnpackEmpty = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceUnpackEmpty>>,
    TError,
    { instanceId: string; data: RuntimeServiceUnpackEmptyBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceUnpackEmpty>>,
    { instanceId: string; data: RuntimeServiceUnpackEmptyBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceUnpackEmpty(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceUnpackEmpty>>,
    TError,
    { instanceId: string; data: RuntimeServiceUnpackEmptyBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary UnpackExample unpacks an example project
 */
export const runtimeServiceUnpackExample = (
  instanceId: string,
  runtimeServiceUnpackExampleBody: RuntimeServiceUnpackExampleBody
) => {
  return httpClient<V1UnpackExampleResponse>({
    url: `/v1/instances/${instanceId}/files/unpack-example`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceUnpackExampleBody,
  });
};

export type RuntimeServiceUnpackExampleMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceUnpackExample>>
>;
export type RuntimeServiceUnpackExampleMutationBody =
  RuntimeServiceUnpackExampleBody;
export type RuntimeServiceUnpackExampleMutationError = RpcStatus;

export const createRuntimeServiceUnpackExample = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceUnpackExample>>,
    TError,
    { instanceId: string; data: RuntimeServiceUnpackExampleBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceUnpackExample>>,
    { instanceId: string; data: RuntimeServiceUnpackExampleBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceUnpackExample(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceUnpackExample>>,
    TError,
    { instanceId: string; data: RuntimeServiceUnpackExampleBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary Reconcile applies a full set of artifacts from a repo to the catalog and infra.
It attempts to infer a minimal number of migrations to apply to reconcile the current state with
the desired state expressed in the artifacts. Any existing objects not described in the submitted
artifacts will be deleted.
 */
export const runtimeServiceReconcile = (
  instanceId: string,
  runtimeServiceReconcileBody: RuntimeServiceReconcileBody
) => {
  return httpClient<V1ReconcileResponse>({
    url: `/v1/instances/${instanceId}/reconcile`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: runtimeServiceReconcileBody,
  });
};

export type RuntimeServiceReconcileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceReconcile>>
>;
export type RuntimeServiceReconcileMutationBody = RuntimeServiceReconcileBody;
export type RuntimeServiceReconcileMutationError = RpcStatus;

export const createRuntimeServiceReconcile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceReconcile>>,
    TError,
    { instanceId: string; data: RuntimeServiceReconcileBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceReconcile>>,
    { instanceId: string; data: RuntimeServiceReconcileBody }
  > = (props) => {
    const { instanceId, data } = props ?? {};

    return runtimeServiceReconcile(instanceId, data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceReconcile>>,
    TError,
    { instanceId: string; data: RuntimeServiceReconcileBody },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary TriggerSync syncronizes the instance's catalog with the underlying OLAP's information schema.
If the instance has exposed=true, tables found in the information schema will be added to the catalog.
 */
export const runtimeServiceTriggerSync = (instanceId: string) => {
  return httpClient<V1TriggerSyncResponse>({
    url: `/v1/instances/${instanceId}/sync`,
    method: "post",
  });
};

export type RuntimeServiceTriggerSyncMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceTriggerSync>>
>;

export type RuntimeServiceTriggerSyncMutationError = RpcStatus;

export const createRuntimeServiceTriggerSync = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceTriggerSync>>,
    TError,
    { instanceId: string },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceTriggerSync>>,
    { instanceId: string }
  > = (props) => {
    const { instanceId } = props ?? {};

    return runtimeServiceTriggerSync(instanceId);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceTriggerSync>>,
    TError,
    { instanceId: string },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary Ping returns information about the runtime
 */
export const runtimeServicePing = (signal?: AbortSignal) => {
  return httpClient<V1PingResponse>({ url: `/v1/ping`, method: "get", signal });
};

export const getRuntimeServicePingQueryKey = () => [`/v1/ping`] as const;

export type RuntimeServicePingQueryResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServicePing>>
>;
export type RuntimeServicePingQueryError = RpcStatus;

export const createRuntimeServicePing = <
  TData = Awaited<ReturnType<typeof runtimeServicePing>>,
  TError = RpcStatus
>(options?: {
  query?: CreateQueryOptions<
    Awaited<ReturnType<typeof runtimeServicePing>>,
    TError,
    TData
  >;
}): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getRuntimeServicePingQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof runtimeServicePing>>
  > = ({ signal }) => runtimeServicePing(signal);

  const query = createQuery<
    Awaited<ReturnType<typeof runtimeServicePing>>,
    TError,
    TData
  >({ queryKey, queryFn, ...queryOptions }) as CreateQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary PutFileAndReconcile combines PutFile and Reconcile in a single endpoint to reduce latency.
It is equivalent to calling the two RPCs sequentially.
 */
export const runtimeServicePutFileAndReconcile = (
  v1PutFileAndReconcileRequest: V1PutFileAndReconcileRequest
) => {
  return httpClient<V1PutFileAndReconcileResponse>({
    url: `/v1/put-and-reconcile`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: v1PutFileAndReconcileRequest,
  });
};

export type RuntimeServicePutFileAndReconcileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServicePutFileAndReconcile>>
>;
export type RuntimeServicePutFileAndReconcileMutationBody =
  V1PutFileAndReconcileRequest;
export type RuntimeServicePutFileAndReconcileMutationError = RpcStatus;

export const createRuntimeServicePutFileAndReconcile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServicePutFileAndReconcile>>,
    TError,
    { data: V1PutFileAndReconcileRequest },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServicePutFileAndReconcile>>,
    { data: V1PutFileAndReconcileRequest }
  > = (props) => {
    const { data } = props ?? {};

    return runtimeServicePutFileAndReconcile(data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServicePutFileAndReconcile>>,
    TError,
    { data: V1PutFileAndReconcileRequest },
    TContext
  >(mutationFn, mutationOptions);
};
export const runtimeServiceRefreshAndReconcile = (
  v1RefreshAndReconcileRequest: V1RefreshAndReconcileRequest
) => {
  return httpClient<V1RefreshAndReconcileResponse>({
    url: `/v1/refresh-and-reconcile`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: v1RefreshAndReconcileRequest,
  });
};

export type RuntimeServiceRefreshAndReconcileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceRefreshAndReconcile>>
>;
export type RuntimeServiceRefreshAndReconcileMutationBody =
  V1RefreshAndReconcileRequest;
export type RuntimeServiceRefreshAndReconcileMutationError = RpcStatus;

export const createRuntimeServiceRefreshAndReconcile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceRefreshAndReconcile>>,
    TError,
    { data: V1RefreshAndReconcileRequest },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceRefreshAndReconcile>>,
    { data: V1RefreshAndReconcileRequest }
  > = (props) => {
    const { data } = props ?? {};

    return runtimeServiceRefreshAndReconcile(data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceRefreshAndReconcile>>,
    TError,
    { data: V1RefreshAndReconcileRequest },
    TContext
  >(mutationFn, mutationOptions);
};
/**
 * @summary RenameFileAndReconcile combines RenameFile and Reconcile in a single endpoint to reduce latency.
 */
export const runtimeServiceRenameFileAndReconcile = (
  v1RenameFileAndReconcileRequest: V1RenameFileAndReconcileRequest
) => {
  return httpClient<V1RenameFileAndReconcileResponse>({
    url: `/v1/rename-and-reconcile`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: v1RenameFileAndReconcileRequest,
  });
};

export type RuntimeServiceRenameFileAndReconcileMutationResult = NonNullable<
  Awaited<ReturnType<typeof runtimeServiceRenameFileAndReconcile>>
>;
export type RuntimeServiceRenameFileAndReconcileMutationBody =
  V1RenameFileAndReconcileRequest;
export type RuntimeServiceRenameFileAndReconcileMutationError = RpcStatus;

export const createRuntimeServiceRenameFileAndReconcile = <
  TError = RpcStatus,
  TContext = unknown
>(options?: {
  mutation?: CreateMutationOptions<
    Awaited<ReturnType<typeof runtimeServiceRenameFileAndReconcile>>,
    TError,
    { data: V1RenameFileAndReconcileRequest },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runtimeServiceRenameFileAndReconcile>>,
    { data: V1RenameFileAndReconcileRequest }
  > = (props) => {
    const { data } = props ?? {};

    return runtimeServiceRenameFileAndReconcile(data);
  };

  return createMutation<
    Awaited<ReturnType<typeof runtimeServiceRenameFileAndReconcile>>,
    TError,
    { data: V1RenameFileAndReconcileRequest },
    TContext
  >(mutationFn, mutationOptions);
};
