/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthUser } from '../models/AuthUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Return the authenticated Clerk user identity
     * Returns the Clerk user identity extracted from the validated JWT. No application data is returned — this endpoint solely proves that the auth pipeline (Clerk JWT → server middleware → response) works end-to-end.
     * Use cases: 1. Phase 0 exit criterion: `curl -H "Authorization: Bearer {token}" .../api/v1/me` returns 200. 2. Frontend bootstrap: call on app load to confirm token is valid before making domain API calls. 3. Token refresh detection: a 401 here signals the client to refresh via Clerk and retry.
     * Phase 1 will add club membership and role claims to this response once the Club/ClubMembership data model is in place.
     *
     * @returns any Token is valid; returns Clerk user identity.
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<{
        data: AuthUser;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/me',
            errors: {
                401: `Missing or invalid Bearer token.`,
                500: `Unexpected server error.`,
            },
        });
    }
}
