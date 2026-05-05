/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Clerk identity for the currently authenticated user. This is the server-side projection of the Clerk session token — not a stored application entity.
 *
 */
export type AuthUser = {
    /**
     * Clerk user ID (prefixed `user_`).
     */
    clerkUserId: string;
    /**
     * Primary email address from Clerk.
     */
    email: string;
    firstName?: string;
    lastName?: string;
    /**
     * Clerk-hosted avatar URL.
     */
    imageUrl?: string;
};

