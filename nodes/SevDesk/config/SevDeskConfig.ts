/**
 * Configuration manager for SevDesk API
 * Handles different API versions, endpoints, and configuration settings
 */
export interface SevDeskApiConfig {
	version: string;
	baseUrl: string;
	endpoints: Record<string, string>;
	rateLimits: {
		requestsPerSecond: number;
		requestsPerMinute: number;
		requestsPerHour: number;
	};
	timeouts: {
		request: number;
		connection: number;
	};
	retryConfig: {
		maxRetries: number;
		retryDelay: number;
		retryableStatusCodes: number[];
	};
}

/**
 * Default configuration for different SevDesk API versions
 */
export class SevDeskConfigManager {
	private static readonly API_CONFIGS: Record<string, SevDeskApiConfig> = {
		'v1': {
			version: 'v1',
			baseUrl: 'https://my.sevdesk.de/api/v1',
			endpoints: {
				// Contact endpoints
				contacts: '/Contact',
				contactById: '/Contact/{id}',
				contactAddresses: '/ContactAddress',
				contactCustomFields: '/ContactCustomField',
				contactCustomFieldSettings: '/ContactCustomFieldSetting',
				contactFields: '/ContactField',

				// Invoice endpoints
				invoices: '/Invoice',
				invoiceById: '/Invoice/{id}',
				invoicePositions: '/InvoicePos',

				// Voucher endpoints
				vouchers: '/Voucher',
				voucherById: '/Voucher/{id}',
				voucherPositions: '/VoucherPos',

				// Order endpoints
				orders: '/Order',
				orderById: '/Order/{id}',
				orderPositions: '/OrderPos',

				// Other endpoints
				categories: '/Category',
				checkAccounts: '/CheckAccount',
				checkAccountTransactions: '/CheckAccountTransaction',
				communicationWays: '/CommunicationWay',
				countries: '/StaticCountry',
				creditNotes: '/CreditNote',
				creditNotePositions: '/CreditNotePos',
				exports: '/Export',
				layouts: '/Layout',
				parts: '/Part',
				reports: '/Report',
				tags: '/Tag',
				tagRelations: '/TagRelation',
				units: '/Unity',
				basics: '/Basics',
			},
			rateLimits: {
				requestsPerSecond: 10,
				requestsPerMinute: 600,
				requestsPerHour: 36000,
			},
			timeouts: {
				request: 30000, // 30 seconds
				connection: 10000, // 10 seconds
			},
			retryConfig: {
				maxRetries: 3,
				retryDelay: 1000, // 1 second
				retryableStatusCodes: [429, 500, 502, 503, 504],
			},
		},
		'v2': {
			version: 'v2',
			baseUrl: 'https://my.sevdesk.de/api/v2',
			endpoints: {
				// Contact endpoints
				contacts: '/Contact',
				contactById: '/Contact/{id}',
				contactAddresses: '/ContactAddress',
				contactCustomFields: '/ContactCustomField',
				contactCustomFieldSettings: '/ContactCustomFieldSetting',
				contactFields: '/ContactField',

				// Invoice endpoints
				invoices: '/Invoice',
				invoiceById: '/Invoice/{id}',
				invoicePositions: '/InvoicePos',

				// Voucher endpoints
				vouchers: '/Voucher',
				voucherById: '/Voucher/{id}',
				voucherPositions: '/VoucherPos',

				// Order endpoints
				orders: '/Order',
				orderById: '/Order/{id}',
				orderPositions: '/OrderPos',

				// Other endpoints
				categories: '/Category',
				checkAccounts: '/CheckAccount',
				checkAccountTransactions: '/CheckAccountTransaction',
				communicationWays: '/CommunicationWay',
				countries: '/StaticCountry',
				creditNotes: '/CreditNote',
				creditNotePositions: '/CreditNotePos',
				exports: '/Export',
				layouts: '/Layout',
				parts: '/Part',
				reports: '/Report',
				tags: '/Tag',
				tagRelations: '/TagRelation',
				units: '/Unity',
				basics: '/Basics',
			},
			rateLimits: {
				requestsPerSecond: 15,
				requestsPerMinute: 900,
				requestsPerHour: 54000,
			},
			timeouts: {
				request: 30000, // 30 seconds
				connection: 10000, // 10 seconds
			},
			retryConfig: {
				maxRetries: 3,
				retryDelay: 1000, // 1 second
				retryableStatusCodes: [429, 500, 502, 503, 504],
			},
		},
	};

	/**
	 * Get configuration for a specific API version
	 */
	static getConfig(version: string): SevDeskApiConfig {
		const config = this.API_CONFIGS[version];
		if (!config) {
			throw new Error(`Unsupported SevDesk API version: ${version}. Supported versions: ${Object.keys(this.API_CONFIGS).join(', ')}`);
		}
		return { ...config }; // Return a copy to prevent mutations
	}

	/**
	 * Get all supported API versions
	 */
	static getSupportedVersions(): string[] {
		return Object.keys(this.API_CONFIGS);
	}

	/**
	 * Get the default API version
	 */
	static getDefaultVersion(): string {
		return 'v2'; // Default to the latest version
	}

	/**
	 * Check if an API version is supported
	 */
	static isVersionSupported(version: string): boolean {
		return version in this.API_CONFIGS;
	}

	/**
	 * Get endpoint URL for a specific resource and API version
	 */
	static getEndpoint(version: string, endpointKey: string, params?: Record<string, string>): string {
		const config = this.getConfig(version);
		let endpoint = config.endpoints[endpointKey];

		if (!endpoint) {
			throw new Error(`Endpoint '${endpointKey}' not found for API version ${version}`);
		}

		// Replace path parameters if provided
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				endpoint = endpoint.replace(`{${key}}`, value);
			}
		}

		return endpoint;
	}

	/**
	 * Get full URL for a specific endpoint
	 */
	static getFullUrl(version: string, endpointKey: string, params?: Record<string, string>): string {
		const config = this.getConfig(version);
		const endpoint = this.getEndpoint(version, endpointKey, params);
		return `${config.baseUrl}${endpoint}`;
	}

	/**
	 * Get rate limit configuration for a specific API version
	 */
	static getRateLimits(version: string): SevDeskApiConfig['rateLimits'] {
		const config = this.getConfig(version);
		return { ...config.rateLimits };
	}

	/**
	 * Get timeout configuration for a specific API version
	 */
	static getTimeouts(version: string): SevDeskApiConfig['timeouts'] {
		const config = this.getConfig(version);
		return { ...config.timeouts };
	}

	/**
	 * Get retry configuration for a specific API version
	 */
	static getRetryConfig(version: string): SevDeskApiConfig['retryConfig'] {
		const config = this.getConfig(version);
		return { ...config.retryConfig };
	}

	/**
	 * Validate API version from credentials
	 */
	static validateApiVersion(version: string): string {
		if (!version) {
			return this.getDefaultVersion();
		}

		if (!this.isVersionSupported(version)) {
			throw new Error(`Invalid API version: ${version}. Supported versions: ${this.getSupportedVersions().join(', ')}`);
		}

		return version;
	}

	/**
	 * Get resource endpoint mapping for dynamic resource discovery
	 */
	static getResourceEndpointMapping(version: string): Record<string, string> {
		const config = this.getConfig(version);
		return {
			contact: config.endpoints.contacts,
			contactAddress: config.endpoints.contactAddresses,
			contactCustomField: config.endpoints.contactCustomFields,
			contactCustomFieldSetting: config.endpoints.contactCustomFieldSettings,
			contactField: config.endpoints.contactFields,
			invoice: config.endpoints.invoices,
			voucher: config.endpoints.vouchers,
			order: config.endpoints.orders,
			category: config.endpoints.categories,
			checkAccount: config.endpoints.checkAccounts,
			checkAccountTransaction: config.endpoints.checkAccountTransactions,
			communicationWay: config.endpoints.communicationWays,
			country: config.endpoints.countries,
			creditNote: config.endpoints.creditNotes,
			creditNotePos: config.endpoints.creditNotePositions,
			export: config.endpoints.exports,
			layout: config.endpoints.layouts,
			part: config.endpoints.parts,
			report: config.endpoints.reports,
			tag: config.endpoints.tags,
			tagRelation: config.endpoints.tagRelations,
			unit: config.endpoints.units,
			basics: config.endpoints.basics,
		};
	}
}
