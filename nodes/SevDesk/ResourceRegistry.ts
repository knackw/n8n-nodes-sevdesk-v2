import {
	StrictResourceConfig,
	SevDeskResourceType,
	ResourceHandlerMethod
} from './types/InternalTypes';

// Legacy interfaces for backward compatibility
export interface ResourceConfig {
	name: string;
	value: string;
	handler: string;
}

export interface ResourceHandler {
	execute(operation: string, itemIndex: number): Promise<any>;
}

/**
 * Registry for SevDesk resources
 * Provides dynamic resource discovery and handler mapping
 */
export class ResourceRegistry {
	private static readonly strictResources: readonly StrictResourceConfig[] = [
		{ name: "AccountingContact", value: "accountingContact", handler: "handleGenericOperation" },
		{ name: "Basic", value: "basics", handler: "handleBasicsOperation" },
		{ name: "Batch Operations", value: "batch", handler: "handleBatchOperation" },
		{ name: "Category", value: "category", handler: "handleCategoryOperation" },
		{ name: "CheckAccount", value: "checkAccount", handler: "handleCheckAccountOperation" },
		{ name: "CheckAccountTransaction", value: "checkAccountTransaction", handler: "handleGenericOperation" },
		{ name: "CommunicationWay", value: "communicationWay", handler: "handleGenericOperation" },
		{ name: "Contact", value: "contact", handler: "handleContactOperation" },
		{ name: "Contact Address", value: "contactAddress", handler: "handleGenericOperation" },
		{ name: "Contact Custom Field", value: "contactCustomField", handler: "handleGenericOperation" },
		{ name: "Contact Custom Field Setting", value: "contactCustomFieldSetting", handler: "handleGenericOperation" },
		{ name: "Contact Field", value: "contactField", handler: "handleGenericOperation" },
		{ name: "Country", value: "country", handler: "handleGenericOperation" },
		{ name: "Credit Note", value: "creditNote", handler: "handleCreditNoteOperation" },
		{ name: "Credit Note Po", value: "creditNotePos", handler: "handleGenericOperation" },
		{ name: "Export", value: "export", handler: "handleExportOperation" },
		{ name: "Invoice", value: "invoice", handler: "handleInvoiceOperation" },
		{ name: "Invoice Position", value: "invoicePos", handler: "handleGenericOperation" },
		{ name: "Layout", value: "layout", handler: "handleGenericOperation" },
		{ name: "Order", value: "order", handler: "handleOrderOperation" },
		{ name: "Order Position", value: "orderPos", handler: "handleGenericOperation" },
		{ name: "OrderPo", value: "orderPo", handler: "handleGenericOperation" },
		{ name: "Part", value: "part", handler: "handlePartOperation" },
		{ name: "Report", value: "report", handler: "handleReportOperation" },
		{ name: "Tag", value: "tag", handler: "handleTagOperation" },
		{ name: "Tag Relation", value: "tagRelation", handler: "handleGenericOperation" },
		{ name: "Unity", value: "unity", handler: "handleGenericOperation" },
		{ name: "Voucher", value: "voucher", handler: "handleVoucherOperation" },
		{ name: "VoucherPo", value: "voucherPo", handler: "handleGenericOperation" },
	] as const;

	// Legacy resources array for backward compatibility
	private static resources: ResourceConfig[] = [
		{ name: "AccountingContact", value: "accountingContact", handler: "handleGenericOperation" },
		{ name: "Basic", value: "basics", handler: "handleBasicsOperation" },
		{ name: "Batch Operations", value: "batch", handler: "handleBatchOperation" },
		{ name: "Category", value: "category", handler: "handleCategoryOperation" },
		{ name: "CheckAccount", value: "checkAccount", handler: "handleCheckAccountOperation" },
		{ name: "CheckAccountTransaction", value: "checkAccountTransaction", handler: "handleGenericOperation" },
		{ name: "CommunicationWay", value: "communicationWay", handler: "handleGenericOperation" },
		{ name: "Contact", value: "contact", handler: "handleContactOperation" },
		{ name: "Contact Address", value: "contactAddress", handler: "handleGenericOperation" },
		{ name: "Contact Custom Field", value: "contactCustomField", handler: "handleGenericOperation" },
		{ name: "Contact Custom Field Setting", value: "contactCustomFieldSetting", handler: "handleGenericOperation" },
		{ name: "Contact Field", value: "contactField", handler: "handleGenericOperation" },
		{ name: "Country", value: "country", handler: "handleGenericOperation" },
		{ name: "Credit Note", value: "creditNote", handler: "handleCreditNoteOperation" },
		{ name: "Credit Note Po", value: "creditNotePos", handler: "handleGenericOperation" },
		{ name: "Export", value: "export", handler: "handleExportOperation" },
		{ name: "Invoice", value: "invoice", handler: "handleInvoiceOperation" },
		{ name: "Invoice Position", value: "invoicePos", handler: "handleGenericOperation" },
		{ name: "Layout", value: "layout", handler: "handleGenericOperation" },
		{ name: "Order", value: "order", handler: "handleOrderOperation" },
		{ name: "Order Position", value: "orderPos", handler: "handleGenericOperation" },
		{ name: "OrderPo", value: "orderPo", handler: "handleGenericOperation" },
		{ name: "Part", value: "part", handler: "handlePartOperation" },
		{ name: "Report", value: "report", handler: "handleReportOperation" },
		{ name: "Tag", value: "tag", handler: "handleTagOperation" },
		{ name: "Tag Relation", value: "tagRelation", handler: "handleGenericOperation" },
		{ name: "Unity", value: "unity", handler: "handleGenericOperation" },
		{ name: "Voucher", value: "voucher", handler: "handleVoucherOperation" },
		{ name: "VoucherPo", value: "voucherPo", handler: "handleGenericOperation" },
	];

	/**
	 * Get all available resources for the node options
	 */
	static getResourceOptions(): Array<{ name: string; value: string }> {
		return this.resources.map(resource => ({
			name: resource.name,
			value: resource.value
		}));
	}

	/**
	 * Get handler method name for a specific resource
	 */
	static getResourceHandler(resourceValue: string): string {
		const resource = this.resources.find(r => r.value === resourceValue);
		return resource?.handler || 'handleGenericOperation';
	}

	/**
	 * Check if a resource is supported
	 */
	static isResourceSupported(resourceValue: string): boolean {
		return this.resources.some(r => r.value === resourceValue);
	}

	/**
	 * Get all resource values
	 */
	static getResourceValues(): string[] {
		return this.resources.map(r => r.value);
	}

	// ===== NEW STRICT TYPING METHODS =====

	/**
	 * Get all available resources with strict typing
	 */
	static getStrictResourceOptions(): Array<{ name: string; value: SevDeskResourceType }> {
		return this.strictResources.map(resource => ({
			name: resource.name,
			value: resource.value
		}));
	}

	/**
	 * Get handler method name for a specific resource with strict typing
	 */
	static getStrictResourceHandler(resourceValue: SevDeskResourceType): ResourceHandlerMethod {
		const resource = this.strictResources.find(r => r.value === resourceValue);
		return resource?.handler || 'handleGenericOperation';
	}

	/**
	 * Check if a resource is supported with strict typing
	 */
	static isStrictResourceSupported(resourceValue: string): resourceValue is SevDeskResourceType {
		return this.strictResources.some(r => r.value === resourceValue);
	}

	/**
	 * Get all resource values with strict typing
	 */
	static getStrictResourceValues(): readonly SevDeskResourceType[] {
		return this.strictResources.map(r => r.value);
	}

	/**
	 * Get resource configuration with strict typing
	 */
	static getStrictResourceConfig(resourceValue: SevDeskResourceType): StrictResourceConfig | undefined {
		return this.strictResources.find(r => r.value === resourceValue);
	}

	/**
	 * Validate resource and handler combination
	 */
	static validateResourceHandler(resourceValue: SevDeskResourceType, handler: ResourceHandlerMethod): boolean {
		const resource = this.strictResources.find(r => r.value === resourceValue);
		return resource?.handler === handler;
	}

	/**
	 * Get all resources by category (if categories are added in the future)
	 */
	static getResourcesByCategory(category: string): readonly StrictResourceConfig[] {
		return this.strictResources.filter(r => r.category === category);
	}

	/**
	 * Get all non-deprecated resources
	 */
	static getActiveResources(): readonly StrictResourceConfig[] {
		return this.strictResources.filter(r => !r.deprecated);
	}
}
