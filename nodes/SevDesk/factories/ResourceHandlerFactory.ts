/**
 * Factory pattern implementation for creating resource handlers
 * This eliminates the need for switch-case logic in SevDeskResourceManager
 * Enhanced with plugin architecture for easy extensibility
 */

import { IExecuteFunctions } from "n8n-workflow";
import { BaseResourceHandler } from "../base/BaseResourceHandler";
import { ContactHandler } from "../handlers/ContactHandler";
import { InvoiceHandler } from "../handlers/InvoiceHandler";
import { VoucherHandler } from "../handlers/VoucherHandler";
import { OrderHandler } from "../handlers/OrderHandler";

/**
 * Interface for resource handler constructors
 */
export interface ResourceHandlerConstructor {
	new (executeFunctions: IExecuteFunctions): BaseResourceHandler;
}

/**
 * Plugin metadata interface
 */
export interface IPluginMetadata {
	name: string;
	version: string;
	description: string;
	author?: string;
	dependencies?: string[];
	apiVersion?: string;
	tags?: string[];
}

/**
 * Plugin lifecycle interface
 */
export interface IPluginLifecycle {
	initialize?(): Promise<void> | void;
	validate?(): Promise<boolean> | boolean;
	cleanup?(): Promise<void> | void;
}

/**
 * Complete plugin interface
 */
export interface IResourcePlugin extends IPluginLifecycle {
	metadata: IPluginMetadata;
	handlerClass: ResourceHandlerConstructor;
}

/**
 * Plugin registration result
 */
export interface IPluginRegistrationResult {
	success: boolean;
	message: string;
	plugin?: IResourcePlugin;
}

/**
 * Registry of resource handlers (legacy)
 */
const RESOURCE_HANDLERS: Record<string, ResourceHandlerConstructor> = {
	'contact': ContactHandler,
	'invoice': InvoiceHandler,
	'voucher': VoucherHandler,
	'order': OrderHandler,
	// Add more resource handlers here as they are implemented
	// 'creditNote': CreditNoteHandler,
	// 'category': CategoryHandler,
	// 'checkAccount': CheckAccountHandler,
	// etc.
};

/**
 * Plugin registry for enhanced plugin architecture
 */
const PLUGIN_REGISTRY: Map<string, IResourcePlugin> = new Map();

/**
 * Factory class for creating resource handlers with plugin architecture support
 */
export class ResourceHandlerFactory {
	/**
	 * Create a resource handler for the specified resource type
	 * Supports both legacy handlers and plugin-based handlers
	 */
	static createHandler(resource: string, executeFunctions: IExecuteFunctions): BaseResourceHandler {
		const resourceKey = resource.toLowerCase();

		// First check plugin registry
		const plugin = PLUGIN_REGISTRY.get(resourceKey);
		if (plugin) {
			return new plugin.handlerClass(executeFunctions);
		}

		// Fall back to legacy registry
		const HandlerClass = RESOURCE_HANDLERS[resourceKey];
		if (!HandlerClass) {
			throw new Error(`No handler found for resource: ${resource}`);
		}

		return new HandlerClass(executeFunctions);
	}

	/**
	 * Check if a resource handler is available (checks both registries)
	 */
	static isResourceSupported(resource: string): boolean {
		const resourceKey = resource.toLowerCase();
		return PLUGIN_REGISTRY.has(resourceKey) || resourceKey in RESOURCE_HANDLERS;
	}

	/**
	 * Get list of all supported resources (from both registries)
	 */
	static getSupportedResources(): string[] {
		const pluginResources = Array.from(PLUGIN_REGISTRY.keys());
		const legacyResources = Object.keys(RESOURCE_HANDLERS);
		return [...new Set([...pluginResources, ...legacyResources])];
	}

	/**
	 * Register a new resource handler (legacy method)
	 */
	static registerHandler(resource: string, handlerClass: ResourceHandlerConstructor): void {
		RESOURCE_HANDLERS[resource.toLowerCase()] = handlerClass;
	}

	/**
	 * Unregister a resource handler (legacy method)
	 */
	static unregisterHandler(resource: string): void {
		delete RESOURCE_HANDLERS[resource.toLowerCase()];
	}

	// === PLUGIN ARCHITECTURE METHODS ===

	/**
	 * Register a plugin with full metadata and lifecycle support
	 */
	static async registerPlugin(resource: string, plugin: IResourcePlugin): Promise<IPluginRegistrationResult> {
		const resourceKey = resource.toLowerCase();

		try {
			// Validate plugin metadata
			if (!plugin.metadata || !plugin.metadata.name || !plugin.metadata.version) {
				return {
					success: false,
					message: 'Plugin metadata is incomplete. Name and version are required.',
				};
			}

			// Check for conflicts
			if (PLUGIN_REGISTRY.has(resourceKey)) {
				return {
					success: false,
					message: `Plugin for resource '${resource}' is already registered.`,
				};
			}

			// Validate plugin if validation method exists
			if (plugin.validate) {
				const isValid = await plugin.validate();
				if (!isValid) {
					return {
						success: false,
						message: 'Plugin validation failed.',
					};
				}
			}

			// Initialize plugin if initialization method exists
			if (plugin.initialize) {
				await plugin.initialize();
			}

			// Register the plugin
			PLUGIN_REGISTRY.set(resourceKey, plugin);

			return {
				success: true,
				message: `Plugin '${plugin.metadata.name}' registered successfully for resource '${resource}'.`,
				plugin,
			};
		} catch (error) {
			return {
				success: false,
				message: `Failed to register plugin: ${error instanceof Error ? error.message : String(error)}`,
			};
		}
	}

	/**
	 * Unregister a plugin
	 */
	static async unregisterPlugin(resource: string): Promise<IPluginRegistrationResult> {
		const resourceKey = resource.toLowerCase();
		const plugin = PLUGIN_REGISTRY.get(resourceKey);

		if (!plugin) {
			return {
				success: false,
				message: `No plugin found for resource '${resource}'.`,
			};
		}

		try {
			// Cleanup plugin if cleanup method exists
			if (plugin.cleanup) {
				await plugin.cleanup();
			}

			// Remove from registry
			PLUGIN_REGISTRY.delete(resourceKey);

			return {
				success: true,
				message: `Plugin '${plugin.metadata.name}' unregistered successfully.`,
				plugin,
			};
		} catch (error) {
			return {
				success: false,
				message: `Failed to unregister plugin: ${error instanceof Error ? error.message : String(error)}`,
			};
		}
	}

	/**
	 * Get plugin metadata for a resource
	 */
	static getPluginMetadata(resource: string): IPluginMetadata | null {
		const plugin = PLUGIN_REGISTRY.get(resource.toLowerCase());
		return plugin ? plugin.metadata : null;
	}

	/**
	 * Get all registered plugins
	 */
	static getAllPlugins(): Map<string, IResourcePlugin> {
		return new Map(PLUGIN_REGISTRY);
	}

	/**
	 * Check if a resource is handled by a plugin (vs legacy handler)
	 */
	static isPluginResource(resource: string): boolean {
		return PLUGIN_REGISTRY.has(resource.toLowerCase());
	}

	/**
	 * Get plugin statistics
	 */
	static getPluginStats(): {
		totalPlugins: number;
		totalLegacyHandlers: number;
		totalResources: number;
		pluginResources: string[];
		legacyResources: string[];
	} {
		const pluginResources = Array.from(PLUGIN_REGISTRY.keys());
		const legacyResources = Object.keys(RESOURCE_HANDLERS);

		return {
			totalPlugins: PLUGIN_REGISTRY.size,
			totalLegacyHandlers: legacyResources.length,
			totalResources: this.getSupportedResources().length,
			pluginResources,
			legacyResources,
		};
	}
}
