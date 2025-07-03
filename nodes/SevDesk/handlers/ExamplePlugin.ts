/**
 * Example plugin demonstrating the plugin architecture
 * This shows how to create a new resource handler using the plugin system
 */

import { IExecuteFunctions, IHttpRequestOptions, IDataObject } from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { IResourcePlugin, IPluginMetadata } from "../factories/ResourceHandlerFactory";

/**
 * Example resource type (this would normally be defined in types/SevDeskApiTypes.ts)
 */
interface ExampleResource {
	id?: string;
	name: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Example resource handler that extends the CRUD base class
 */
class ExampleResourceHandler extends CrudResourceHandler<ExampleResource> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, 'Example', 'Example');

		// Override the ID parameter name if needed
		this.config.idParameterName = 'exampleId';
	}

	/**
	 * Override to handle custom example operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		switch (operation) {
			case 'search':
				const searchTerm = this.executeFunctions.getNodeParameter('searchTerm', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/Example/search`,
					qs: { q: searchTerm },
				};

			case 'activate':
				const exampleId = this.executeFunctions.getNodeParameter('exampleId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Example/${exampleId}/activate`,
				};

			default:
				return super.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Override to transform example-specific create data
	 */
	protected transformCreateData(data: any): object {
		// Add any example-specific transformations here
		if (data.name) {
			data.name = data.name.trim();
		}
		return data;
	}

	/**
	 * Override to transform example-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform example-specific query parameters
		return params;
	}
}

/**
 * Plugin metadata
 */
const metadata: IPluginMetadata = {
	name: 'Example Resource Plugin',
	version: '1.0.0',
	description: 'Example plugin demonstrating the plugin architecture for SevDesk resources',
	author: 'SevDesk Plugin Team',
	dependencies: [],
	apiVersion: 'v1',
	tags: ['example', 'demo', 'plugin-architecture'],
};

/**
 * Example plugin implementation
 */
export const ExamplePlugin: IResourcePlugin = {
	metadata,
	handlerClass: ExampleResourceHandler,

	/**
	 * Initialize the plugin
	 */
	async initialize(): Promise<void> {
		console.log(`Initializing ${metadata.name} v${metadata.version}`);
		// Perform any initialization logic here
		// e.g., validate configuration, setup connections, etc.
	},

	/**
	 * Validate the plugin
	 */
	async validate(): Promise<boolean> {
		console.log(`Validating ${metadata.name}`);
		// Perform validation logic here
		// e.g., check API connectivity, validate configuration, etc.
		return true;
	},

	/**
	 * Cleanup the plugin
	 */
	async cleanup(): Promise<void> {
		console.log(`Cleaning up ${metadata.name}`);
		// Perform cleanup logic here
		// e.g., close connections, clear caches, etc.
	},
};

/**
 * Example usage:
 *
 * import { ResourceHandlerFactory } from './factories/ResourceHandlerFactory';
 * import { ExamplePlugin } from './handlers/ExamplePlugin';
 *
 * // Register the plugin
 * const result = await ResourceHandlerFactory.registerPlugin('example', ExamplePlugin);
 * if (result.success) {
 *   console.log('Plugin registered successfully');
 * } else {
 *   console.error('Plugin registration failed:', result.message);
 * }
 *
 * // Use the plugin
 * const handler = ResourceHandlerFactory.createHandler('example', executeFunctions);
 * const result = await handler.execute('create', 0);
 */
