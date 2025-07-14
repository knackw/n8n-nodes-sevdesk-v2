/**
 * Strict TypeScript interfaces for internal data structures
 * These types provide enhanced type safety for internal components
 */

import { INodeExecutionData } from "n8n-workflow";
import { ResourceOperation, ApiRequestParams } from "./SevDeskApiTypes";

// ===== STRICT RESOURCE REGISTRY TYPES =====

/**
 * Supported SevDesk resource types with strict typing
 */
export type SevDeskResourceType =
	| "accountingContact"
	| "basics"
	| "batch"
	| "category"
	| "checkAccount"
	| "checkAccountTransaction"
	| "communicationWay"
	| "contact"
	| "contactAddress"
	| "contactCustomField"
	| "contactCustomFieldSetting"
	| "contactField"
	| "country"
	| "creditNote"
	| "creditNotePos"
	| "export"
	| "invoice"
	| "invoicePos"
	| "layout"
	| "order"
	| "orderPos"
	| "orderPo"
	| "part"
	| "report"
	| "tag"
	| "tagRelation"
	| "unity"
	| "voucher"
	| "voucherPo";

/**
 * Supported handler method names with strict typing
 */
export type ResourceHandlerMethod =
	| "handleContactOperation"
	| "handleInvoiceOperation"
	| "handleVoucherOperation"
	| "handleOrderOperation"
	| "handleCreditNoteOperation"
	| "handleCategoryOperation"
	| "handleCheckAccountOperation"
	| "handlePartOperation"
	| "handleTagOperation"
	| "handleReportOperation"
	| "handleExportOperation"
	| "handleBasicsOperation"
	| "handleBatchOperation"
	| "handleGenericOperation";

/**
 * Strict resource configuration interface
 */
export interface StrictResourceConfig {
	readonly name: string;
	readonly value: SevDeskResourceType;
	readonly handler: ResourceHandlerMethod;
	readonly description?: string;
	readonly category?: string;
	readonly deprecated?: boolean;
}

/**
 * Strict resource handler interface
 */
export interface StrictResourceHandler {
	execute(
		operation: ResourceOperation,
		itemIndex: number,
	): Promise<INodeExecutionData[]>;
	validateOperation(operation: ResourceOperation): boolean;
	getSupportedOperations(): ResourceOperation[];
}

// ===== STRICT API CLIENT TYPES =====

/**
 * HTTP methods supported by SevDesk API
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Strict API request configuration
 */
export interface StrictApiRequestConfig<TBody = unknown> {
	readonly method: HttpMethod;
	readonly endpoint: string;
	readonly body?: TBody;
	readonly queryParams?: Record<string, string | number | boolean | undefined>;
	readonly headers?: Record<string, string>;
	readonly timeout?: number;
	readonly retries?: number;
}

/**
 * Strict API response interface
 */
export interface StrictApiResponse<TData = unknown> {
	readonly data: TData;
	readonly statusCode: number;
	readonly headers: Record<string, string>;
	readonly requestId?: string;
	readonly timestamp: Date;
}

/**
 * SevDesk credentials interface with strict typing
 */
export interface SevDeskCredentials {
	readonly apiKey: string;
	readonly apiVersion: string;
	readonly baseUrl?: string;
	readonly timeout?: number;
}

// ===== STRICT OPERATION CONTEXT TYPES =====

/**
 * Execution context for resource operations
 */
export interface StrictExecutionContext {
	readonly resource: SevDeskResourceType;
	readonly operation: ResourceOperation;
	readonly itemIndex: number;
	readonly inputData: INodeExecutionData;
	readonly credentials: SevDeskCredentials;
	readonly requestParams: ApiRequestParams;
}

/**
 * Operation result with strict typing
 */
export interface StrictOperationResult<TData = unknown> {
	readonly success: boolean;
	readonly data?: TData;
	readonly error?: StrictOperationError;
	readonly metadata: {
		readonly duration: number;
		readonly requestId?: string;
		readonly timestamp: Date;
	};
}

/**
 * Strict operation error interface
 */
export interface StrictOperationError {
	readonly code: string;
	readonly message: string;
	readonly details?: Record<string, unknown>;
	readonly field?: string;
	readonly statusCode?: number;
	readonly retryable: boolean;
}

// ===== STRICT VALIDATION TYPES =====

/**
 * Field validation rule with strict typing
 */
export interface StrictValidationRule<TValue = unknown> {
	readonly field: string;
	readonly required: boolean;
	readonly type: "string" | "number" | "boolean" | "object" | "array" | "date";
	readonly validator?: (value: TValue) => boolean;
	readonly errorMessage?: string;
	readonly transform?: (value: unknown) => TValue;
}

/**
 * Validation schema for resources
 */
export interface StrictValidationSchema {
	readonly resource: SevDeskResourceType;
	readonly operation: ResourceOperation;
	readonly rules: StrictValidationRule[];
	readonly customValidators?: Array<(data: unknown) => StrictValidationResult>;
}

/**
 * Validation result with strict typing
 */
export interface StrictValidationResult {
	readonly valid: boolean;
	readonly errors: StrictValidationError[];
	readonly warnings?: StrictValidationWarning[];
}

/**
 * Validation error with strict typing
 */
export interface StrictValidationError {
	readonly field: string;
	readonly code: string;
	readonly message: string;
	readonly value?: unknown;
	readonly constraint?: string;
}

/**
 * Validation warning with strict typing
 */
export interface StrictValidationWarning {
	readonly field: string;
	readonly message: string;
	readonly suggestion?: string;
}

// ===== STRICT BATCH OPERATION TYPES =====

/**
 * Batch operation with strict typing
 */
export interface StrictBatchOperation<TData = unknown> {
	readonly id: string;
	readonly resource: SevDeskResourceType;
	readonly operation: ResourceOperation;
	readonly data?: TData;
	readonly priority?: number;
	readonly dependencies?: string[];
}

/**
 * Batch request with strict typing
 */
export interface StrictBatchRequest {
	readonly operations: StrictBatchOperation[];
	readonly options: {
		readonly stopOnError: boolean;
		readonly parallel: boolean;
		readonly maxConcurrency: number;
		readonly timeout: number;
	};
	readonly metadata?: Record<string, unknown>;
}

/**
 * Batch result with strict typing
 */
export interface StrictBatchResult<TData = unknown> {
	readonly id: string;
	readonly success: boolean;
	readonly data?: TData;
	readonly error?: StrictOperationError;
	readonly duration: number;
	readonly dependencies: string[];
}

/**
 * Batch response with strict typing
 */
export interface StrictBatchResponse {
	readonly results: StrictBatchResult[];
	readonly summary: {
		readonly total: number;
		readonly successful: number;
		readonly failed: number;
		readonly skipped: number;
		readonly duration: number;
	};
	readonly errors: StrictOperationError[];
}

// ===== STRICT CONFIGURATION TYPES =====

/**
 * API client configuration with strict typing
 */
export interface StrictApiClientConfig {
	readonly baseUrl: string;
	readonly apiVersion: string;
	readonly timeout: number;
	readonly retries: number;
	readonly retryDelay: number;
	readonly maxConcurrentRequests: number;
	readonly enableLogging: boolean;
	readonly logLevel: "debug" | "info" | "warn" | "error";
}

/**
 * Resource manager configuration with strict typing
 */
export interface StrictResourceManagerConfig {
	readonly enableBatchOperations: boolean;
	readonly enableDependencyResolution: boolean;
	readonly enableValidation: boolean;
	readonly enableCaching: boolean;
	readonly cacheTimeout: number;
	readonly maxBatchSize: number;
}

// ===== UTILITY TYPES FOR STRICT TYPING =====

/**
 * Make all properties in T strictly readonly and non-nullable
 */
export type DeepReadonly<T> = {
	readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make all properties in T required and non-nullable
 */
export type StrictRequired<T> = {
	[P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * Extract only string literal types from a union
 */
export type StringLiterals<T> = T extends string ? T : never;

/**
 * Create a type that ensures all keys of T are present
 */
export type ExhaustiveKeys<T, U extends keyof T = keyof T> = {
	[K in U]: T[K];
};

/**
 * Type guard for checking if a value is of a specific type
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Type for creating branded types for additional type safety
 */
export type Brand<T, B> = T & { readonly __brand: B };

// ===== BRANDED TYPES FOR ADDITIONAL SAFETY =====

export type ResourceId = Brand<string, "ResourceId">;
export type OperationId = Brand<string, "OperationId">;
export type RequestId = Brand<string, "RequestId">;
export type ApiKey = Brand<string, "ApiKey">;
export type Timestamp = Brand<number, "Timestamp">;
