/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Error } from './Error';
export type ValidationError = (Error & {
    /**
     * Field-level validation failures.
     */
    errors: Array<{
        /**
         * JSON path to the invalid field (dot notation).
         */
        field: string;
        /**
         * Why this field is invalid.
         */
        message: string;
        /**
         * The value that was rejected (omit for sensitive fields).
         */
        value?: any;
    }>;
});

