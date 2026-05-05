/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Standard error response. Follows RFC 7807 problem-details subset. All 4xx and 5xx responses use this shape.
 *
 */
export type Error = {
    /**
     * URI identifying the error type. Use `about:blank` for generic HTTP errors. Domain-specific errors use `https://aauclubmanager.app/errors/{code}`.
     *
     */
    type: string;
    /**
     * Short human-readable summary of the error type.
     */
    title: string;
    /**
     * HTTP status code.
     */
    status: number;
    /**
     * Human-readable explanation of this specific instance.
     */
    detail?: string;
    /**
     * URI identifying this specific occurrence. Typically the request path + a trace/request ID injected by the server.
     *
     */
    instance?: string;
};

