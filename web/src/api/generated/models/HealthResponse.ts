/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthResponse = {
    /**
     * `ok` — all subsystems healthy. `degraded` — one or more subsystems unhealthy (DB or Redis unreachable) but server is still serving traffic.
     *
     */
    status: HealthResponse.status;
    /**
     * Server time at response generation (ISO 8601).
     */
    timestamp: string;
    /**
     * Server build version (from package.json or GIT_SHA env).
     */
    version?: string;
    /**
     * Per-subsystem health. Omitted if all healthy and status is ok.
     */
    subsystems?: {
        db?: HealthResponse.db;
        redis?: HealthResponse.redis;
    };
};
export namespace HealthResponse {
    /**
     * `ok` — all subsystems healthy. `degraded` — one or more subsystems unhealthy (DB or Redis unreachable) but server is still serving traffic.
     *
     */
    export enum status {
        OK = 'ok',
        DEGRADED = 'degraded',
    }
    export enum db {
        OK = 'ok',
        ERROR = 'error',
    }
    export enum redis {
        OK = 'ok',
        ERROR = 'error',
    }
}

