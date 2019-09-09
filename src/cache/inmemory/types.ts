import { DocumentNode } from 'graphql';

import { Transaction } from '../core';
import { StoreValue } from '../../utilities';

export interface IdGetterObj extends Object {
  __typename?: string;
  id?: string;
}
export declare type IdGetter = (
  value: IdGetterObj,
) => string | null | undefined;

/**
 * This is an interface used to access, set and remove
 * StoreObjects from the cache
 */
export interface NormalizedCache {
  get(dataId: string): StoreObject;
  set(dataId: string, value: StoreObject): void;
  delete(dataId: string): void;
  clear(): void;

  // non-Map elements:
  /**
   * returns an Object with key-value pairs matching the contents of the store
   */
  toObject(): NormalizedCacheObject;
  /**
   * replace the state of the store
   */
  replace(newData: NormalizedCacheObject): void;

  /**
   * Retain or release a given root ID on behalf of a specific "owner" object.
   * During garbage collection, retained root IDs with one or more owners are
   * considered immediately reachable. A single owner object counts only once.
   */
  retain(rootId: string, owner: object): void;
  release(rootId: string, owner: object): void;
}

/**
 * This is a normalized representation of the Apollo query result cache. It consists of
 * a flattened representation of query result trees.
 */
export interface NormalizedCacheObject {
  [dataId: string]: StoreObject | undefined;
}

export interface StoreObject {
  __typename?: string;
  [storeFieldKey: string]: StoreValue;
}

export type OptimisticStoreItem = {
  id: string;
  data: NormalizedCacheObject;
  transaction: Transaction<NormalizedCacheObject>;
};

export type ReadQueryOptions = {
  store: NormalizedCache;
  query: DocumentNode;
  variables?: Object;
  previousResult?: any;
  rootId?: string;
  config?: ApolloReducerConfig;
};

export type DiffQueryAgainstStoreOptions = ReadQueryOptions & {
  returnPartialData?: boolean;
};

export type ApolloReducerConfig = {
  dataIdFromObject?: IdGetter;
  addTypename?: boolean;
  cacheRedirects?: CacheResolverMap;
  possibleTypes?: PossibleTypesMap;
};

export type ReadStoreContext = {
  readonly store: NormalizedCache;
  readonly cacheRedirects: CacheResolverMap;
  readonly dataIdFromObject?: IdGetter;
};

export type PossibleTypesMap = { [key: string]: string[] };

export type CacheResolver = (
  rootValue: any,
  args: { [argName: string]: any },
  context: any,
) => any;

export type CacheResolverMap = {
  [typeName: string]: {
    [fieldName: string]: CacheResolver;
  };
};

// backwards compat
export type CustomResolver = CacheResolver;
export type CustomResolverMap = CacheResolverMap;