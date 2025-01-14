/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * rill/runtime/v1/schema.proto
 * OpenAPI spec version: version not set
 */
import { createQuery } from "@tanstack/svelte-query";
import type {
  CreateQueryOptions,
  QueryFunction,
  CreateQueryResult,
  QueryKey,
} from "@tanstack/svelte-query";
import type {
  V1GCSListObjectsResponse,
  RpcStatus,
  ConnectorServiceGCSListObjectsParams,
  V1GCSListBucketsResponse,
  ConnectorServiceGCSListBucketsParams,
  V1GCSGetCredentialsInfoResponse,
  V1S3GetBucketMetadataResponse,
  V1S3ListObjectsResponse,
  ConnectorServiceS3ListObjectsParams,
  V1S3ListBucketsResponse,
  ConnectorServiceS3ListBucketsParams,
  V1S3GetCredentialsInfoResponse,
} from "../index.schemas";
import { httpClient } from "../../http-client";

/**
 * @summary GCSListObjects lists objects for the given bucket.
 */
export const connectorServiceGCSListObjects = (
  bucket: string,
  params?: ConnectorServiceGCSListObjectsParams,
  signal?: AbortSignal
) => {
  return httpClient<V1GCSListObjectsResponse>({
    url: `/v1/gcs/bucket/${bucket}/objects`,
    method: "get",
    params,
    signal,
  });
};

export const getConnectorServiceGCSListObjectsQueryKey = (
  bucket: string,
  params?: ConnectorServiceGCSListObjectsParams
) => [`/v1/gcs/bucket/${bucket}/objects`, ...(params ? [params] : [])] as const;

export type ConnectorServiceGCSListObjectsQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceGCSListObjects>>
>;
export type ConnectorServiceGCSListObjectsQueryError = RpcStatus;

export const createConnectorServiceGCSListObjects = <
  TData = Awaited<ReturnType<typeof connectorServiceGCSListObjects>>,
  TError = RpcStatus
>(
  bucket: string,
  params?: ConnectorServiceGCSListObjectsParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof connectorServiceGCSListObjects>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getConnectorServiceGCSListObjectsQueryKey(bucket, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceGCSListObjects>>
  > = ({ signal }) => connectorServiceGCSListObjects(bucket, params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceGCSListObjects>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!bucket,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary GCSListBuckets lists buckets accessible with the configured credentials.
 */
export const connectorServiceGCSListBuckets = (
  params?: ConnectorServiceGCSListBucketsParams,
  signal?: AbortSignal
) => {
  return httpClient<V1GCSListBucketsResponse>({
    url: `/v1/gcs/buckets`,
    method: "get",
    params,
    signal,
  });
};

export const getConnectorServiceGCSListBucketsQueryKey = (
  params?: ConnectorServiceGCSListBucketsParams
) => [`/v1/gcs/buckets`, ...(params ? [params] : [])] as const;

export type ConnectorServiceGCSListBucketsQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceGCSListBuckets>>
>;
export type ConnectorServiceGCSListBucketsQueryError = RpcStatus;

export const createConnectorServiceGCSListBuckets = <
  TData = Awaited<ReturnType<typeof connectorServiceGCSListBuckets>>,
  TError = RpcStatus
>(
  params?: ConnectorServiceGCSListBucketsParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof connectorServiceGCSListBuckets>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getConnectorServiceGCSListBucketsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceGCSListBuckets>>
  > = ({ signal }) => connectorServiceGCSListBuckets(params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceGCSListBuckets>>,
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
 * @summary GCSGetCredentialsInfo returns metadata for the given bucket.
 */
export const connectorServiceGCSGetCredentialsInfo = (signal?: AbortSignal) => {
  return httpClient<V1GCSGetCredentialsInfoResponse>({
    url: `/v1/gcs/credentials_info`,
    method: "get",
    signal,
  });
};

export const getConnectorServiceGCSGetCredentialsInfoQueryKey = () =>
  [`/v1/gcs/credentials_info`] as const;

export type ConnectorServiceGCSGetCredentialsInfoQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceGCSGetCredentialsInfo>>
>;
export type ConnectorServiceGCSGetCredentialsInfoQueryError = RpcStatus;

export const createConnectorServiceGCSGetCredentialsInfo = <
  TData = Awaited<ReturnType<typeof connectorServiceGCSGetCredentialsInfo>>,
  TError = RpcStatus
>(options?: {
  query?: CreateQueryOptions<
    Awaited<ReturnType<typeof connectorServiceGCSGetCredentialsInfo>>,
    TError,
    TData
  >;
}): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getConnectorServiceGCSGetCredentialsInfoQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceGCSGetCredentialsInfo>>
  > = ({ signal }) => connectorServiceGCSGetCredentialsInfo(signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceGCSGetCredentialsInfo>>,
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
 * @summary S3GetBucketMetadata returns metadata for the given bucket.
 */
export const connectorServiceS3GetBucketMetadata = (
  bucket: string,
  signal?: AbortSignal
) => {
  return httpClient<V1S3GetBucketMetadataResponse>({
    url: `/v1/s3/bucket/${bucket}/metadata`,
    method: "get",
    signal,
  });
};

export const getConnectorServiceS3GetBucketMetadataQueryKey = (
  bucket: string
) => [`/v1/s3/bucket/${bucket}/metadata`] as const;

export type ConnectorServiceS3GetBucketMetadataQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceS3GetBucketMetadata>>
>;
export type ConnectorServiceS3GetBucketMetadataQueryError = RpcStatus;

export const createConnectorServiceS3GetBucketMetadata = <
  TData = Awaited<ReturnType<typeof connectorServiceS3GetBucketMetadata>>,
  TError = RpcStatus
>(
  bucket: string,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof connectorServiceS3GetBucketMetadata>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getConnectorServiceS3GetBucketMetadataQueryKey(bucket);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceS3GetBucketMetadata>>
  > = ({ signal }) => connectorServiceS3GetBucketMetadata(bucket, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceS3GetBucketMetadata>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!bucket,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary S3ListBuckets lists objects for the given bucket.
 */
export const connectorServiceS3ListObjects = (
  bucket: string,
  params?: ConnectorServiceS3ListObjectsParams,
  signal?: AbortSignal
) => {
  return httpClient<V1S3ListObjectsResponse>({
    url: `/v1/s3/bucket/${bucket}/objects`,
    method: "get",
    params,
    signal,
  });
};

export const getConnectorServiceS3ListObjectsQueryKey = (
  bucket: string,
  params?: ConnectorServiceS3ListObjectsParams
) => [`/v1/s3/bucket/${bucket}/objects`, ...(params ? [params] : [])] as const;

export type ConnectorServiceS3ListObjectsQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceS3ListObjects>>
>;
export type ConnectorServiceS3ListObjectsQueryError = RpcStatus;

export const createConnectorServiceS3ListObjects = <
  TData = Awaited<ReturnType<typeof connectorServiceS3ListObjects>>,
  TError = RpcStatus
>(
  bucket: string,
  params?: ConnectorServiceS3ListObjectsParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof connectorServiceS3ListObjects>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getConnectorServiceS3ListObjectsQueryKey(bucket, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceS3ListObjects>>
  > = ({ signal }) => connectorServiceS3ListObjects(bucket, params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceS3ListObjects>>,
    TError,
    TData
  >({
    queryKey,
    queryFn,
    enabled: !!bucket,
    ...queryOptions,
  }) as CreateQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary S3ListBuckets lists buckets accessible with the configured credentials.
 */
export const connectorServiceS3ListBuckets = (
  params?: ConnectorServiceS3ListBucketsParams,
  signal?: AbortSignal
) => {
  return httpClient<V1S3ListBucketsResponse>({
    url: `/v1/s3/buckets`,
    method: "get",
    params,
    signal,
  });
};

export const getConnectorServiceS3ListBucketsQueryKey = (
  params?: ConnectorServiceS3ListBucketsParams
) => [`/v1/s3/buckets`, ...(params ? [params] : [])] as const;

export type ConnectorServiceS3ListBucketsQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceS3ListBuckets>>
>;
export type ConnectorServiceS3ListBucketsQueryError = RpcStatus;

export const createConnectorServiceS3ListBuckets = <
  TData = Awaited<ReturnType<typeof connectorServiceS3ListBuckets>>,
  TError = RpcStatus
>(
  params?: ConnectorServiceS3ListBucketsParams,
  options?: {
    query?: CreateQueryOptions<
      Awaited<ReturnType<typeof connectorServiceS3ListBuckets>>,
      TError,
      TData
    >;
  }
): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getConnectorServiceS3ListBucketsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceS3ListBuckets>>
  > = ({ signal }) => connectorServiceS3ListBuckets(params, signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceS3ListBuckets>>,
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
 * @summary S3GetCredentialsInfo returns metadata for the given bucket.
 */
export const connectorServiceS3GetCredentialsInfo = (signal?: AbortSignal) => {
  return httpClient<V1S3GetCredentialsInfoResponse>({
    url: `/v1/s3/credentials_info`,
    method: "get",
    signal,
  });
};

export const getConnectorServiceS3GetCredentialsInfoQueryKey = () =>
  [`/v1/s3/credentials_info`] as const;

export type ConnectorServiceS3GetCredentialsInfoQueryResult = NonNullable<
  Awaited<ReturnType<typeof connectorServiceS3GetCredentialsInfo>>
>;
export type ConnectorServiceS3GetCredentialsInfoQueryError = RpcStatus;

export const createConnectorServiceS3GetCredentialsInfo = <
  TData = Awaited<ReturnType<typeof connectorServiceS3GetCredentialsInfo>>,
  TError = RpcStatus
>(options?: {
  query?: CreateQueryOptions<
    Awaited<ReturnType<typeof connectorServiceS3GetCredentialsInfo>>,
    TError,
    TData
  >;
}): CreateQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getConnectorServiceS3GetCredentialsInfoQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof connectorServiceS3GetCredentialsInfo>>
  > = ({ signal }) => connectorServiceS3GetCredentialsInfo(signal);

  const query = createQuery<
    Awaited<ReturnType<typeof connectorServiceS3GetCredentialsInfo>>,
    TError,
    TData
  >({ queryKey, queryFn, ...queryOptions }) as CreateQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};
