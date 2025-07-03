/**
 * Resource dependency resolver for complex SevDesk operations
 * Manages dependencies between resources and ensures proper execution order
 */

import { IDataObject } from "n8n-workflow";

/**
 * Interface for resource dependency definition
 */
export interface IResourceDependency {
	resource: string;
	operation: string;
	dependsOn: Array<{
		resource: string;
		operation: string;
		field?: string; // Field that contains the dependency reference
		required: boolean;
	}>;
	provides?: Array<{
		field: string; // Field that this operation provides for other operations
		type: 'id' | 'reference' | 'data';
	}>;
}

/**
 * Interface for dependency resolution result
 */
export interface IDependencyResolutionResult {
	executionOrder: Array<{
		resource: string;
		operation: string;
		index: number;
		dependencies: string[];
	}>;
	dependencyMap: Map<string, string[]>;
	isValid: boolean;
	errors: string[];
}

/**
 * Interface for operation context
 */
export interface IOperationContext {
	resource: string;
	operation: string;
	data: IDataObject;
	index: number;
	id?: string;
	dependencies?: string[];
	provides?: IDataObject;
}

/**
 * Resource dependency resolver class
 * Handles complex dependency resolution for SevDesk operations
 */
export class ResourceDependencyResolver {
	private static dependencies: Map<string, IResourceDependency> = new Map();
	private static initialized = false;

	/**
	 * Initialize the dependency resolver with predefined dependencies
	 */
	public static initialize(): void {
		if (this.initialized) return;

		// Define common SevDesk resource dependencies
		this.registerDependencies();
		this.initialized = true;
	}

	/**
	 * Register predefined dependencies for SevDesk resources
	 */
	private static registerDependencies(): void {
		// Invoice dependencies
		this.registerDependency({
			resource: 'invoice',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'contact',
					required: true
				}
			],
			provides: [
				{
					field: 'id',
					type: 'id'
				}
			]
		});

		// Order dependencies
		this.registerDependency({
			resource: 'order',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'contact',
					required: true
				}
			],
			provides: [
				{
					field: 'id',
					type: 'id'
				}
			]
		});

		// Voucher dependencies
		this.registerDependency({
			resource: 'voucher',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'supplier',
					required: false
				}
			],
			provides: [
				{
					field: 'id',
					type: 'id'
				}
			]
		});

		// Credit Note dependencies
		this.registerDependency({
			resource: 'creditNote',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'contact',
					required: true
				},
				{
					resource: 'invoice',
					operation: 'create',
					field: 'invoice',
					required: false
				}
			],
			provides: [
				{
					field: 'id',
					type: 'id'
				}
			]
		});

		// Contact Address dependencies
		this.registerDependency({
			resource: 'contactAddress',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'contact',
					required: true
				}
			]
		});

		// Communication Way dependencies
		this.registerDependency({
			resource: 'communicationWay',
			operation: 'create',
			dependsOn: [
				{
					resource: 'contact',
					operation: 'create',
					field: 'contact',
					required: true
				}
			]
		});
	}

	/**
	 * Register a new dependency
	 */
	public static registerDependency(dependency: IResourceDependency): void {
		const key = `${dependency.resource}:${dependency.operation}`;
		this.dependencies.set(key, dependency);
	}

	/**
	 * Get dependency for a specific resource and operation
	 */
	public static getDependency(resource: string, operation: string): IResourceDependency | null {
		const key = `${resource}:${operation}`;
		return this.dependencies.get(key) || null;
	}

	/**
	 * Resolve dependencies for a list of operations
	 */
	public static resolveDependencies(operations: IOperationContext[]): IDependencyResolutionResult {
		this.initialize();

		const result: IDependencyResolutionResult = {
			executionOrder: [],
			dependencyMap: new Map(),
			isValid: true,
			errors: []
		};

		// Build dependency graph
		const dependencyGraph = this.buildDependencyGraph(operations);

		// Check for circular dependencies
		const circularDeps = this.detectCircularDependencies(dependencyGraph);
		if (circularDeps.length > 0) {
			result.isValid = false;
			result.errors.push(`Circular dependencies detected: ${circularDeps.join(', ')}`);
			return result;
		}

		// Perform topological sort to determine execution order
		const sortedOperations = this.topologicalSort(operations, dependencyGraph);

		if (sortedOperations.length !== operations.length) {
			result.isValid = false;
			result.errors.push('Unable to resolve all dependencies');
			return result;
		}

		// Build execution order
		result.executionOrder = sortedOperations.map((op, index) => ({
			resource: op.resource,
			operation: op.operation,
			index: op.index,
			dependencies: dependencyGraph.get(`${op.resource}:${op.operation}:${op.index}`) || []
		}));

		result.dependencyMap = dependencyGraph;

		return result;
	}

	/**
	 * Build dependency graph from operations
	 */
	private static buildDependencyGraph(operations: IOperationContext[]): Map<string, string[]> {
		const graph = new Map<string, string[]>();

		operations.forEach((operation, index) => {
			const opKey = `${operation.resource}:${operation.operation}:${index}`;
			const dependencies: string[] = [];

			const dependency = this.getDependency(operation.resource, operation.operation);
			if (dependency) {
				dependency.dependsOn.forEach(dep => {
					// Find operations that satisfy this dependency
					const satisfyingOps = operations.filter((op, opIndex) =>
						op.resource === dep.resource &&
						op.operation === dep.operation &&
						opIndex !== index
					);

					satisfyingOps.forEach(satisfyingOp => {
						const depKey = `${satisfyingOp.resource}:${satisfyingOp.operation}:${satisfyingOp.index}`;
						dependencies.push(depKey);
					});

					// Check if required dependency is missing
					if (dep.required && satisfyingOps.length === 0) {
						// Look for existing resources that might satisfy the dependency
						const existingResource = this.findExistingResource(operation, dep);
						if (!existingResource) {
							dependencies.push(`MISSING:${dep.resource}:${dep.operation}`);
						}
					}
				});
			}

			graph.set(opKey, dependencies);
		});

		return graph;
	}

	/**
	 * Find existing resource that might satisfy a dependency
	 */
	private static findExistingResource(operation: IOperationContext, dependency: any): boolean {
		// Check if the operation data already contains a reference to the required resource
		if (dependency.field && operation.data[dependency.field]) {
			// If the field contains an ID or reference, the dependency might already be satisfied
			return true;
		}
		return false;
	}

	/**
	 * Detect circular dependencies in the graph
	 */
	private static detectCircularDependencies(graph: Map<string, string[]>): string[] {
		const visited = new Set<string>();
		const recursionStack = new Set<string>();
		const circularDeps: string[] = [];

		const dfs = (node: string): boolean => {
			if (recursionStack.has(node)) {
				circularDeps.push(node);
				return true;
			}

			if (visited.has(node)) {
				return false;
			}

			visited.add(node);
			recursionStack.add(node);

			const dependencies = graph.get(node) || [];
			for (const dep of dependencies) {
				if (!dep.startsWith('MISSING:') && dfs(dep)) {
					return true;
				}
			}

			recursionStack.delete(node);
			return false;
		};

		for (const node of graph.keys()) {
			if (!visited.has(node)) {
				dfs(node);
			}
		}

		return circularDeps;
	}

	/**
	 * Perform topological sort to determine execution order
	 */
	private static topologicalSort(operations: IOperationContext[], graph: Map<string, string[]>): IOperationContext[] {
		const inDegree = new Map<string, number>();
		const result: IOperationContext[] = [];
		const queue: string[] = [];

		// Initialize in-degree count
		operations.forEach((op, index) => {
			const key = `${op.resource}:${op.operation}:${index}`;
			inDegree.set(key, 0);
		});

		// Calculate in-degrees
		graph.forEach((dependencies, node) => {
			dependencies.forEach(dep => {
				if (!dep.startsWith('MISSING:')) {
					inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
				}
			});
		});

		// Find nodes with no incoming edges
		inDegree.forEach((degree, node) => {
			if (degree === 0) {
				queue.push(node);
			}
		});

		// Process queue
		while (queue.length > 0) {
			const current = queue.shift()!;
			const [resource, operation, indexStr] = current.split(':');
			const index = parseInt(indexStr);

			const currentOp = operations.find((op, i) =>
				op.resource === resource &&
				op.operation === operation &&
				i === index
			);

			if (currentOp) {
				result.push(currentOp);
			}

			// Reduce in-degree for dependent nodes
			const dependencies = graph.get(current) || [];
			dependencies.forEach(dep => {
				if (!dep.startsWith('MISSING:')) {
					const newDegree = (inDegree.get(dep) || 0) - 1;
					inDegree.set(dep, newDegree);

					if (newDegree === 0) {
						queue.push(dep);
					}
				}
			});
		}

		return result;
	}

	/**
	 * Validate that all required dependencies are satisfied
	 */
	public static validateDependencies(operations: IOperationContext[]): { isValid: boolean; errors: string[] } {
		this.initialize();

		const errors: string[] = [];

		operations.forEach((operation, index) => {
			const dependency = this.getDependency(operation.resource, operation.operation);
			if (dependency) {
				dependency.dependsOn.forEach(dep => {
					if (dep.required) {
						// Check if dependency is satisfied by another operation or existing data
						const isSatisfied = operations.some((op, opIndex) =>
							op.resource === dep.resource &&
							op.operation === dep.operation &&
							opIndex !== index
						) || this.findExistingResource(operation, dep);

						if (!isSatisfied) {
							errors.push(`Operation ${operation.resource}:${operation.operation} requires ${dep.resource}:${dep.operation} but it's not provided`);
						}
					}
				});
			}
		});

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	/**
	 * Get all registered dependencies
	 */
	public static getAllDependencies(): Map<string, IResourceDependency> {
		this.initialize();
		return new Map(this.dependencies);
	}

	/**
	 * Clear all dependencies (useful for testing)
	 */
	public static clearDependencies(): void {
		this.dependencies.clear();
		this.initialized = false;
	}
}
