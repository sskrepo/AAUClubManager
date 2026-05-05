/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Pagination metadata returned alongside list responses.
 */
export type PaginationMeta = {
    /**
     * Total number of items matching the query (across all pages). May be omitted for expensive counts — check `hasMore` instead.
     *
     */
    total: number;
    /**
     * Number of items in this page.
     */
    pageSize: number;
    /**
     * Whether a next page exists.
     */
    hasMore: boolean;
    /**
     * Opaque cursor to pass as `?cursor=` to fetch the next page. Absent when `hasMore` is false.
     *
     */
    nextCursor?: string;
};

