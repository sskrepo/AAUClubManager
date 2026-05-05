/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from '../models/HealthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Liveness and readiness probe
     * Returns server liveness status. Does NOT require authentication. CI and load balancers call this endpoint. The response body includes subsystem health (DB, Redis) when status is degraded.
     * Note: this endpoint is intentionally unversioned (not under `/api/v1/`). It is infrastructure, not API surface, and must be stable regardless of API version changes.
     *
     * @returns HealthResponse Server is healthy (or degraded but serving).
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<HealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                500: `Unexpected server error.`,
            },
        });
    }
}
