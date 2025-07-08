/**
 * Batch operations handler for SevDesk resources
 * Enables processing multiple operations in a single request for improved efficiency
 */

import {
	IExecuteFunctions,
	IDataObject,
} from "n8n-workflow";
import { BaseResourceHandler } from "../base/BaseResourceHandler";
import {
	ResourceDependencyResolver,
	IOperationContext,
	IDependencyResolutionResult
} from "../dependencies/ResourceDependencyResolver";

/**
 * Interface for a single batch operation
 */
export interface IBatchOperation {
	resource: string;
	operation: string;
	data?: IDataObject;
	id?: string;
	parameters?: IDataObject;
}

/**
 * Interface for batch operation request
 */
export interface IBatchRequest {
	operations: IBatchOperation[];
	options?: {
		continueOnError?: boolean;
		maxConcurrency?: number;
		timeout?: number;
	};
}

/**
 * Interface for batch operation result
 */
export interface IBatchResult {
	success: boolean;
	results: Array<{
		operation: IBatchOperation;
		success: boolean;
		data?: any;
		error?: string;
	}>;
	summary: {
		total: number;
		successful: number;
		failed: number;
		executionTime: number;
	};
}

/**
 * Batch operation handler class
 * Processes multiple operations efficiently with proper error handling
 */
export class BatchOperationHandler {
	private executeFunctions: IExecuteFunctions;
	private resourceHandlers: Map<string, BaseResourceHandler> = new Map();

	constructor(executeFunctions: IExecuteFunctions) {
		this.executeFunctions = executeFunctions;
	}

	/**
	 * Register a resource handler for batch operations
	 */
	public registerResourceHandler(resource: string, handler: BaseResourceHandler): void {
		this.resourceHandlers.set(resource, handler);
	}

	/**
	 * Execute batch operations
	 */
	public async executeBatch(batchRequest: IBatchRequest): Promise<IBatchResult> {
		const startTime = Date.now();
		const results: IBatchResult['results'] = [];
		const options = {
			continueOnError: true,
			maxConcurrency: 5,
			timeout: 30000,
			...batchRequest.options
		};

		// Validate batch request
		this.validateBatchRequest(batchRequest);

		// Convert batch operations to operation contexts for dependency resolution
		const operationContexts: IOperationContext[] = batchRequest.operations.map((operation, index) => ({
			resource: operation.resource,
			operation: operation.operation,
			data: operation.data || {},
			index,
			id: operation.id,
			dependencies: operation.parameters?.dependencies as string[] || undefined
		}));

		// Resolve dependencies and determine execution order
		const dependencyResult: IDependencyResolutionResult = ResourceDependencyResolver.resolveDependencies(operationContexts);

		if (!dependencyResult.isValid) {
			throw new Error(`Dependency resolution failed: ${dependencyResult.errors.join(', ')}`);
		}

		// Execute operations in dependency-resolved order
		const executionResults = new Map<number, any>();

		// Process operations respecting dependencies
		for (const orderedOp of dependencyResult.executionOrder) {
			try {
				// Get the original operation from the batch request
				const originalOperation = batchRequest.operations[orderedOp.index];

				// Check if dependencies are satisfied
				const dependenciesSatisfied = this.checkDependenciesSatisfied(orderedOp, executionResults);
				if (!dependenciesSatisfied && !options.continueOnError) {
					throw new Error(`Dependencies not satisfied for ${orderedOp.resource}:${orderedOp.operation}`);
				}

				// Execute the operation
				const result = await this.executeOperation(originalOperation, orderedOp.index);

				// Store result for dependency resolution
				executionResults.set(orderedOp.index, result);

				results.push({
					operation: originalOperation,
					success: true,
					data: result
				});

			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				const originalOperation = batchRequest.operations[orderedOp.index];

				results.push({
					operation: originalOperation,
					success: false,
					error: errorMessage
				});

				if (!options.continueOnError) {
					throw error;
				}
			}
		}

		const endTime = Date.now();
		const successful = results.filter(r => r.success).length;
		const failed = results.filter(r => !r.success).length;

		return {
			success: failed === 0,
			results,
			summary: {
				total: results.length,
				successful,
				failed,
				executionTime: endTime - startTime
			}
		};
	}


	/**
	 * Execute a single operation within the batch
	 */
	private async executeOperation(operation: IBatchOperation, itemIndex: number): Promise<any> {
		const handler = this.resourceHandlers.get(operation.resource);

		if (!handler) {
			throw new Error(`No handler registered for resource: ${operation.resource}`);
		}

		// Set up mock parameters for the operation
		this.setupMockParameters(operation, itemIndex);

		// Execute the operation using the resource handler
		const result = await handler.execute(operation.operation, itemIndex);

		return result?.json || result;
	}

	/**
	 * Set up mock parameters for batch operation execution
	 */
	private setupMockParameters(operation: IBatchOperation, itemIndex: number): void {
		// This is a simplified approach - in a real implementation,
		// you might need to modify the executeFunctions to support batch parameters
		const originalGetNodeParameter = this.executeFunctions.getNodeParameter;

		this.executeFunctions.getNodeParameter = (parameterName: string, index: number, defaultValue?: any) => {
			// Handle operation-specific parameters
			if (operation.parameters && operation.parameters[parameterName] !== undefined) {
				return operation.parameters[parameterName];
			}

			// Handle common parameters
			switch (parameterName) {
				case 'additionalFields':
					return operation.data || defaultValue || {};
				case `${operation.resource.toLowerCase()}Id`:
					return operation.id || defaultValue;
				default:
					return originalGetNodeParameter.call(this.executeFunctions, parameterName, index, defaultValue);
			}
		};
	}

	/**
	 * Check if dependencies are satisfied for an operation
	 */
	private checkDependenciesSatisfied(
		operation: { resource: string; operation: string; index: number; dependencies: string[] },
		executionResults: Map<number, any>
	): boolean {
		// If no dependencies, operation can be executed
		if (!operation.dependencies || operation.dependencies.length === 0) {
			return true;
		}

		// Check if all dependencies have been executed successfully
		return operation.dependencies.every(dep => {
			// Parse dependency string (format: "resource:operation:index")
			const [, , depIndexStr] = dep.split(':');
			const depIndex = parseInt(depIndexStr);

			// Check if the dependency operation has been executed and has results
			return executionResults.has(depIndex) && executionResults.get(depIndex) !== null;
		});
	}

	/**
	 * Validate batch request structure
	 */
	private validateBatchRequest(batchRequest: IBatchRequest): void {
		if (!batchRequest.operations || !Array.isArray(batchRequest.operations)) {
			throw new Error('Batch request must contain an array of operations');
		}

		if (batchRequest.operations.length === 0) {
			throw new Error('Batch request must contain at least one operation');
		}

		if (batchRequest.operations.length > 100) {
			throw new Error('Batch request cannot contain more than 100 operations');
		}

		// Validate each operation
		batchRequest.operations.forEach((operation, index) => {
			if (!operation.resource || !operation.operation) {
				throw new Error(`Operation at index ${index} must have resource and operation properties`);
			}

			if (!this.resourceHandlers.has(operation.resource)) {
				throw new Error(`No handler registered for resource: ${operation.resource} at index ${index}`);
			}
		});
	}

	/**
	 * Create a batch operation from individual parameters
	 */
	public static createBatchOperation(
		resource: string,
		operation: string,
		data?: IDataObject,
		id?: string,
		parameters?: IDataObject
	): IBatchOperation {
		return {
			resource,
			operation,
			data,
			id,
			parameters
		};
	}

	/**
	 * Create a batch request with default options
	 */
	public static createBatchRequest(
		operations: IBatchOperation[],
		options?: IBatchRequest['options']
	): IBatchRequest {
		return {
			operations,
			options: {
				continueOnError: true,
				maxConcurrency: 5,
				timeout: 30000,
				...options
			}
		};
	}
}

/**
 * Utility functions for batch operations
 */
export class BatchOperationUtils {
	/**
	 * Group operations by resource type for optimized processing
	 */
	public static groupOperationsByResource(operations: IBatchOperation[]): Map<string, IBatchOperation[]> {
		const grouped = new Map<string, IBatchOperation[]>();

		operations.forEach(operation => {
			const existing = grouped.get(operation.resource) || [];
			existing.push(operation);
			grouped.set(operation.resource, existing);
		});

		return grouped;
	}

	/**
	 * Split large batch into smaller chunks
	 */
	public static chunkOperations(operations: IBatchOperation[], chunkSize: number = 50): IBatchOperation[][] {
		const chunks: IBatchOperation[][] = [];

		for (let i = 0; i < operations.length; i += chunkSize) {
			chunks.push(operations.slice(i, i + chunkSize));
		}

		return chunks;
	}

	/**
	 * Validate operation compatibility for batching
	 */
	public static validateOperationCompatibility(operations: IBatchOperation[]): boolean {
		// Check if operations can be safely batched together
		// For example, ensure no conflicting operations on the same resource
		const resourceOperations = new Map<string, Set<string>>();

		operations.forEach(operation => {
			const key = `${operation.resource}:${operation.id || 'new'}`;
			const ops = resourceOperations.get(key) || new Set();
			ops.add(operation.operation);
			resourceOperations.set(key, ops);
		});

		// Check for conflicting operations (e.g., create and delete on same resource)
		for (const [, ops] of resourceOperations) {
			if (ops.has('create') && ops.has('delete')) {
				return false;
			}
			if (ops.has('update') && ops.has('delete')) {
				return false;
			}
		}

		return true;
	}
}
