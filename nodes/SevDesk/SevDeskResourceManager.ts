// @ts-nocheck - Methods are called dynamically via reflection
import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";

import {
	SevDeskContact,
	SevDeskInvoice,
	SevDeskVoucher,
	SevDeskOrder,
	SevDeskResponse,
} from "./types/SevDeskApiTypes";

import { ResourceRegistry } from "./ResourceRegistry";
import { ResourceHandlerFactory } from "./factories/ResourceHandlerFactory";
import {
	BatchOperationHandler,
	IBatchRequest,
	IBatchResult,
	IBatchOperation,
	BatchOperationUtils
} from "./batch/BatchOperationHandler";
import { ResourceDependencyResolver } from "./dependencies/ResourceDependencyResolver";

/**
 * Resource manager for SevDesk operations
 *
 * This class serves as the central coordinator for all SevDesk API operations,
 * providing a unified interface for resource management, batch operations,
 * and dependency resolution. It handles the execution of different resource
 * operations while maintaining proper error handling and logging.
 *
 * @example
 * ```typescript
 * const resourceManager = new SevDeskResourceManager(executeFunctions);
 * const result = await resourceManager.executeResourceOperation('contact', 'create', 0);
 * ```
 *
 * @since 1.0.0
 */
export class SevDeskResourceManager {
	private executeFunctions: IExecuteFunctions;
	private batchHandler: BatchOperationHandler;

	/**
	 * Creates a new instance of SevDeskResourceManager
	 *
	 * Initializes the resource manager with the provided n8n execution functions,
	 * sets up batch operation handlers, and initializes the dependency resolver
	 * for managing resource relationships.
	 *
	 * @param executeFunctions - The n8n execution functions interface providing access to node parameters, credentials, and helpers
	 *
	 * @example
	 * ```typescript
	 * const resourceManager = new SevDeskResourceManager(executeFunctions);
	 * ```
	 *
	 * @since 1.0.0
	 */
	constructor(executeFunctions: IExecuteFunctions) {
		this.executeFunctions = executeFunctions;
		this.batchHandler = new BatchOperationHandler(executeFunctions);
		this.initializeBatchHandlers();

		// Initialize dependency resolver
		ResourceDependencyResolver.initialize();
	}

	/**
	 * Initialize batch handlers for all supported resources
	 */
	private initializeBatchHandlers(): void {
		try {
			// Register handlers for resources that support factory pattern
			const supportedResources = ['contact', 'invoice', 'voucher', 'order'];

			supportedResources.forEach(resource => {
				if (ResourceHandlerFactory.isResourceSupported(resource)) {
					const handler = ResourceHandlerFactory.createHandler(resource, this.executeFunctions);
					this.batchHandler.registerResourceHandler(resource, handler);
				}
			});

			this.logApiInteraction('info', 'Batch handlers initialized successfully', {
				registeredResources: supportedResources.filter(r => ResourceHandlerFactory.isResourceSupported(r))
			});
		} catch (error) {
			this.logApiInteraction('error', 'Failed to initialize batch handlers', { error: error.message });
		}
	}

	/**
	 * Execute batch operations across multiple resources
	 *
	 * Processes a batch of operations across different SevDesk resources in an optimized manner.
	 * Validates operation compatibility, handles dependencies, and provides comprehensive
	 * error handling with detailed logging for debugging purposes.
	 *
	 * @param batchRequest - The batch request containing operations to execute and configuration options
	 * @param batchRequest.operations - Array of batch operations to execute
	 * @param batchRequest.options - Configuration options for batch execution (concurrency, error handling, etc.)
	 *
	 * @returns Promise resolving to batch execution results with success/failure details and summary
	 *
	 * @throws {Error} When batch contains conflicting operations or execution fails
	 *
	 * @example
	 * ```typescript
	 * const batchRequest = {
	 *   operations: [
	 *     { resource: 'contact', operation: 'create', data: { name: 'Company A' } },
	 *     { resource: 'invoice', operation: 'create', data: { contactId: '123' } }
	 *   ],
	 *   options: { continueOnError: true, maxConcurrency: 3 }
	 * };
	 * const result = await resourceManager.executeBatchOperations(batchRequest);
	 * ```
	 *
	 * @since 1.0.0
	 */
	public async executeBatchOperations(batchRequest: IBatchRequest): Promise<IBatchResult> {
		this.logApiInteraction('info', 'Starting batch operations', {
			operationCount: batchRequest.operations.length,
			options: batchRequest.options
		});

		try {
			// Validate operation compatibility
			if (!BatchOperationUtils.validateOperationCompatibility(batchRequest.operations)) {
				throw new Error('Batch contains conflicting operations that cannot be executed together');
			}

			// Execute the batch
			const result = await this.batchHandler.executeBatch(batchRequest);

			this.logApiInteraction('info', 'Batch operations completed', {
				summary: result.summary,
				success: result.success
			});

			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.logApiInteraction('error', `Batch operations failed: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Create batch operations from n8n input data
	 *
	 * Parses n8n node parameters to construct a batch request with multiple operations.
	 * This method extracts batch configuration from the node's input data and creates
	 * a structured batch request that can be executed by the batch operation handler.
	 *
	 * @param itemIndex - The index of the input item to process from n8n workflow data
	 *
	 * @returns A structured batch request object containing operations and execution options
	 *
	 * @throws {Error} When batch configuration is invalid or parsing fails
	 *
	 * @example
	 * ```typescript
	 * // Node parameter 'batchConfig' should contain:
	 * // {
	 * //   operations: [
	 * //     { resource: 'contact', operation: 'create', data: {...} },
	 * //     { resource: 'invoice', operation: 'update', id: '123', data: {...} }
	 * //   ],
	 * //   continueOnError: true,
	 * //   maxConcurrency: 5
	 * // }
	 * const batchRequest = resourceManager.createBatchFromInputData(0);
	 * ```
	 *
	 * @since 1.0.0
	 */
	public createBatchFromInputData(itemIndex: number): IBatchRequest {
		try {
			// Get batch configuration from node parameters
			const batchConfig = this.executeFunctions.getNodeParameter('batchConfig', itemIndex, {}) as any;
			const operations: IBatchOperation[] = [];

			// Parse operations from input data
			if (batchConfig.operations && Array.isArray(batchConfig.operations)) {
				batchConfig.operations.forEach((op: any) => {
					operations.push(BatchOperationHandler.createBatchOperation(
						op.resource,
						op.operation,
						op.data,
						op.id,
						op.parameters
					));
				});
			}

			// Create batch request with options
			const options = {
				continueOnError: batchConfig.continueOnError !== false,
				maxConcurrency: batchConfig.maxConcurrency || 5,
				timeout: batchConfig.timeout || 30000
			};

			return BatchOperationHandler.createBatchRequest(operations, options);
		} catch (error) {
			this.logApiInteraction('error', 'Failed to create batch from input data', { error: error.message });
			throw new Error(`Failed to create batch operations: ${error.message}`);
		}
	}

	/**
	 * Log API interactions for debugging purposes
	 */
	private logApiInteraction(
		level: 'info' | 'warn' | 'error',
		message: string,
		data?: any
	): void {
		const logData = {
			timestamp: new Date().toISOString(),
			resource: this.executeFunctions.getNodeParameter('resource', 0, ''),
			operation: this.executeFunctions.getNodeParameter('operation', 0, ''),
			message,
			...(data && { data })
		};

		// Use console for logging since n8n logger is not available in this context
		console[level](`[SevDesk API] ${JSON.stringify(logData)}`);
	}


	/**
	 * Execute operation for a specific resource using factory pattern
	 *
	 * This is the main entry point for executing individual resource operations.
	 * It uses the factory pattern to create appropriate handlers for supported resources
	 * and falls back to legacy handlers for resources not yet migrated. Provides
	 * comprehensive error handling and logging for debugging purposes.
	 *
	 * @param resource - The SevDesk resource type to operate on (e.g., 'contact', 'invoice', 'voucher', 'order')
	 * @param operation - The operation to perform (e.g., 'create', 'update', 'delete', 'get', 'getAll')
	 * @param itemIndex - The index of the input item to process from n8n workflow data
	 *
	 * @returns Promise resolving to n8n execution data containing the operation result, or null if no data
	 *
	 * @throws {NodeApiError} When the operation fails due to invalid parameters, API errors, or unsupported resources
	 *
	 * @example
	 * ```typescript
	 * // Create a new contact
	 * const result = await resourceManager.executeResourceOperation('contact', 'create', 0);
	 *
	 * // Get all invoices
	 * const invoices = await resourceManager.executeResourceOperation('invoice', 'getAll', 0);
	 *
	 * // Update a specific voucher
	 * const updated = await resourceManager.executeResourceOperation('voucher', 'update', 0);
	 * ```
	 *
	 * @since 1.0.0
	 */
	async executeResourceOperation(
		resource: string,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		this.logApiInteraction('info', `Starting operation`, { resource, operation, itemIndex });

		try {
			// Check if resource is supported by the factory
			if (!ResourceHandlerFactory.isResourceSupported(resource)) {
				// Fall back to legacy handler methods for unsupported resources
				return await this.executeLegacyOperation(resource, operation, itemIndex);
			}

			// Create handler using factory pattern
			const handler = ResourceHandlerFactory.createHandler(resource, this.executeFunctions);
			this.logApiInteraction('info', `Created handler for resource: ${resource}`);

			// Execute the operation using the handler
			const result = await handler.execute(operation, itemIndex);

			this.logApiInteraction('info', `Operation completed successfully`, {
				resource,
				operation,
				hasResult: !!result
			});

			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			this.logApiInteraction('error', `Operation failed: ${errorMessage}`, {
				resource,
				operation,
				error: errorMessage
			});

			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Failed to execute ${resource} ${operation}: ${errorMessage}`,
				description: "Please check your parameters and try again.",
			});
		}
	}

	/**
	 * Execute operation using legacy handler methods for resources not yet migrated to factory pattern
	 */
	private async executeLegacyOperation(
		resource: string,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		this.logApiInteraction('info', `Using legacy handler for resource: ${resource}`);

		// Validate resource is supported by legacy registry
		if (!ResourceRegistry.isResourceSupported(resource)) {
			const error = `Unsupported resource: ${resource}`;
			this.logApiInteraction('error', error);
			throw new Error(error);
		}

		// Get the handler method name from the registry
		const handlerMethodName = ResourceRegistry.getResourceHandler(resource);
		this.logApiInteraction('info', `Using legacy handler method: ${handlerMethodName}`);

		// Dynamically call the appropriate handler method
		const handlerMethod = (this as any)[handlerMethodName];
		if (typeof handlerMethod !== 'function') {
			const error = `Handler method ${handlerMethodName} not found for resource ${resource}`;
			this.logApiInteraction('error', error);
			throw new Error(error);
		}

		// Call the handler method with appropriate parameters
		if (handlerMethodName === 'handleGenericOperation') {
			return await handlerMethod.call(this, resource, operation, itemIndex);
		} else {
			return await handlerMethod.call(this, operation, itemIndex);
		}
	}

	/**
	 * Handle contact operations
	 */
	private async handleContactOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		const credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		const baseURL = `https://my.sevdesk.de/api/${credentials.apiVersion}`;

		let requestOptions: IHttpRequestOptions = {
			headers: {
				'Authorization': credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			url: '',
			method: 'GET',
		};

		switch (operation) {
			case 'create':
				const createData = this.executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as object;
				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Contact`,
					body: createData,
				};
				break;

			case 'get':
				const contactId = this.executeFunctions.getNodeParameter('contactId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Contact/${contactId}`,
				};
				break;

			case 'getMany':
				const queryParams = this.executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Contact`,
					qs: queryParams,
				};
				break;

			case 'delete':
				const deleteContactId = this.executeFunctions.getNodeParameter('contactId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'DELETE',
					url: `${baseURL}/Contact/${deleteContactId}`,
				};
				break;

			case 'checkCustomerNumberAvailability':
				const customerNumber = this.executeFunctions.getNodeParameter('customerNumber', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Contact/Mapper/checkCustomerNumberAvailability`,
					qs: { customerNumber },
				};
				break;

			case 'findByCustomFieldValue':
				const customFieldSetting = this.executeFunctions.getNodeParameter('customFieldSetting', itemIndex) as any;
				const value = this.executeFunctions.getNodeParameter('value', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Contact/Factory/findContactByCustomFieldValue`,
					qs: {
						'customFieldSetting[id]': customFieldSetting.id,
						'customFieldSetting[objectName]': customFieldSetting.objectName,
						value,
					},
				};
				break;

			default:
				throw new NodeApiError(this.executeFunctions.getNode(), {
					message: `Unknown contact operation: ${operation}`,
					description: 'Please check the operation parameter.',
				});
		}

		try {
			const response = await this.executeFunctions.helpers.httpRequest(requestOptions) as SevDeskResponse<SevDeskContact>;

			// Extract objects from response if available, otherwise return full response
			const responseData = response.objects || response;

			return {
				json: responseData as IDataObject,
				pairedItem: {
					item: itemIndex,
				},
			};
		} catch (error) {
			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Contact operation failed: ${error.message}`,
				description: `Failed to execute ${operation} operation on contact resource.`,
			});
		}
	}

	/**
	 * Handle invoice operations
	 */
	private async handleInvoiceOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		const credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		const baseURL = `https://my.sevdesk.de/api/${credentials.apiVersion}`;

		let requestOptions: IHttpRequestOptions = {
			headers: {
				'Authorization': credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			url: '',
			method: 'GET',
		};

		switch (operation) {
			case 'get':
				const invoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Invoice/${invoiceId}`,
				};
				break;

			case 'getMany':
				const filters = this.executeFunctions.getNodeParameter('filters', itemIndex, {}) as any;
				const queryParams: IDataObject = {};
				if (filters.status) queryParams.status = filters.status;
				if (filters.invoiceNumber) queryParams.invoiceNumber = filters.invoiceNumber;
				if (filters.startDate) queryParams.startDate = filters.startDate;
				if (filters.endDate) queryParams.endDate = filters.endDate;
				if (filters.contactId) {
					queryParams['contact[id]'] = filters.contactId;
					queryParams['contact[objectName]'] = 'Contact';
				}

				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Invoice`,
					qs: queryParams,
				};
				break;

			case 'createOrUpdate':
				const invoiceData = this.executeFunctions.getNodeParameter('invoice', itemIndex) as any;
				const invoicePosSave = this.executeFunctions.getNodeParameter('invoicePosSave', itemIndex, {}) as any;

				// Transform contact references
				if (invoiceData.contactId) {
					invoiceData.contact = { id: invoiceData.contactId, objectName: 'Contact' };
					delete invoiceData.contactId;
				}
				if (invoiceData.contactPersonId) {
					invoiceData.contactPerson = { id: invoiceData.contactPersonId, objectName: 'SevUser' };
					delete invoiceData.contactPersonId;
				}

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Invoice/Factory/saveInvoice`,
					body: {
						invoice: invoiceData,
						invoicePosSave: invoicePosSave.values || [],
					},
				};
				break;

			case 'bookAmount':
				const bookInvoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				const amount = this.executeFunctions.getNodeParameter('amount', itemIndex) as number;
				const date = this.executeFunctions.getNodeParameter('date', itemIndex) as string;
				const paymentType = this.executeFunctions.getNodeParameter('paymentType', itemIndex) as string;
				const checkAccountId = this.executeFunctions.getNodeParameter('checkAccountId', itemIndex) as string;
				const createFeed = this.executeFunctions.getNodeParameter('createFeed', itemIndex, false) as boolean;

				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${bookInvoiceId}/bookAmount`,
					body: {
						amount,
						date,
						type: paymentType,
						checkAccount: { id: checkAccountId, objectName: 'CheckAccount' },
						createFeed,
					},
				};
				break;

			case 'cancel':
				const cancelInvoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				const cancellationText = this.executeFunctions.getNodeParameter('cancellationText', itemIndex, '') as string;

				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${cancelInvoiceId}/cancelInvoice`,
					qs: { cancellationText },
				};
				break;

			case 'downloadPdf':
				const pdfInvoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				const download = this.executeFunctions.getNodeParameter('download', itemIndex, true) as boolean;
				const preventive = this.executeFunctions.getNodeParameter('preventive', itemIndex, false) as boolean;

				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Invoice/${pdfInvoiceId}/getPdf`,
					qs: { download, preventive },
				};
				break;

			case 'enshrine':
				const enshrineInvoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${enshrineInvoiceId}/enshrine`,
				};
				break;

			case 'createFromOrder':
				const orderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const creationType = this.executeFunctions.getNodeParameter('creationType', itemIndex) as string;
				const orderAmount = this.executeFunctions.getNodeParameter('orderAmount', itemIndex) as number;
				const partialType = this.executeFunctions.getNodeParameter('partialType', itemIndex, '') as string;

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Invoice/Factory/createInvoiceFromOrder`,
					body: {
						order: { id: orderId, objectName: 'Order' },
						type: creationType,
						amount: orderAmount,
						partialType,
					},
				};
				break;

			default:
				throw new NodeApiError(this.executeFunctions.getNode(), {
					message: `Unknown invoice operation: ${operation}`,
					description: 'Please check the operation parameter.',
				});
		}

		try {
			const response = await this.executeFunctions.helpers.httpRequest(requestOptions) as SevDeskResponse<SevDeskInvoice>;

			// Extract appropriate data from response based on operation
			let responseData: any = response;
			if (response.objects) {
				responseData = response.objects;
			}

			return {
				json: responseData as IDataObject,
				pairedItem: {
					item: itemIndex,
				},
			};
		} catch (error) {
			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Invoice operation failed: ${error.message}`,
				description: `Failed to execute ${operation} operation on invoice resource.`,
			});
		}
	}

	/**
	 * Handle voucher operations
	 */
	private async handleVoucherOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		const credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		const baseURL = `https://my.sevdesk.de/api/${credentials.apiVersion}`;

		let requestOptions: IHttpRequestOptions = {
			headers: {
				'Authorization': credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			url: '',
			method: 'GET',
		};

		switch (operation) {
			case 'get':
				const voucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Voucher/${voucherId}`,
				};
				break;

			case 'getMany':
				const filters = this.executeFunctions.getNodeParameter('filters', itemIndex, {}) as any;
				const queryParams: IDataObject = {};
				if (filters.status) queryParams.status = filters.status;
				if (filters.creditDebit) queryParams.creditDebit = filters.creditDebit;
				if (filters.description) queryParams.description = filters.description;
				if (filters.startDate) queryParams.startDate = filters.startDate;
				if (filters.endDate) queryParams.endDate = filters.endDate;
				if (filters.contactId) {
					queryParams['contact[id]'] = filters.contactId;
					queryParams['contact[objectName]'] = 'Contact';
				}

				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Voucher`,
					qs: queryParams,
				};
				break;

			case 'create':
				const voucherData = this.executeFunctions.getNodeParameter('voucher', itemIndex) as any;
				const voucherPosSave = this.executeFunctions.getNodeParameter('voucherPosSave', itemIndex, []) as any;
				const fileName = this.executeFunctions.getNodeParameter('fileName', itemIndex, '') as string;

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Voucher/Factory/saveVoucher`,
					body: {
						voucher: voucherData,
						voucherPosSave,
						voucherPosDelete: null,
						filename: fileName,
					},
				};
				break;

			case 'update':
				const updateVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				const updateData = this.executeFunctions.getNodeParameter('updateFields', itemIndex, {}) as any;

				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${updateVoucherId}`,
					body: updateData,
				};
				break;

			case 'delete':
				const deleteVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'DELETE',
					url: `${baseURL}/Voucher/${deleteVoucherId}`,
				};
				break;

			case 'book':
				const bookVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				const amount = this.executeFunctions.getNodeParameter('amount', itemIndex) as number;
				const date = this.executeFunctions.getNodeParameter('date', itemIndex) as string;
				const paymentType = this.executeFunctions.getNodeParameter('paymentType', itemIndex) as string;
				const checkAccountId = this.executeFunctions.getNodeParameter('checkAccountId', itemIndex) as string;

				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${bookVoucherId}/bookAmount`,
					body: {
						amount,
						date,
						type: paymentType,
						checkAccount: { id: checkAccountId, objectName: 'CheckAccount' },
					},
				};
				break;

			case 'enshrine':
				const enshrineVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${enshrineVoucherId}/enshrine`,
				};
				break;

			case 'resetToDraft':
				const draftVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${draftVoucherId}/resetToDraft`,
				};
				break;

			case 'resetToOpen':
				const openVoucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${openVoucherId}/resetToOpen`,
				};
				break;

			case 'uploadFile':
				const inputData = this.executeFunctions.getInputData();
				const fileData = inputData[itemIndex]?.binary?.data;
				if (!fileData) {
					throw new NodeApiError(this.executeFunctions.getNode(), {
						message: 'No binary data found for file upload',
						description: 'Please provide binary data for the file upload operation.',
					});
				}

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Voucher/Factory/uploadTempFile`,
					body: {
						data: fileData,
					},
				};
				break;

			default:
				throw new NodeApiError(this.executeFunctions.getNode(), {
					message: `Unknown voucher operation: ${operation}`,
					description: 'Please check the operation parameter.',
				});
		}

		try {
			const response = await this.executeFunctions.helpers.httpRequest(requestOptions) as SevDeskResponse<SevDeskVoucher>;

			// Extract appropriate data from response
			let responseData: any = response;
			if (response.objects) {
				responseData = response.objects;
			}

			return {
				json: responseData as IDataObject,
				pairedItem: {
					item: itemIndex,
				},
			};
		} catch (error) {
			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Voucher operation failed: ${error.message}`,
				description: `Failed to execute ${operation} operation on voucher resource.`,
			});
		}
	}

	/**
	 * Handle order operations
	 */
	private async handleOrderOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		const credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		const baseURL = `https://my.sevdesk.de/api/${credentials.apiVersion}`;

		let requestOptions: IHttpRequestOptions = {
			headers: {
				'Authorization': credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			url: '',
			method: 'GET',
		};

		switch (operation) {
			case 'get':
				const orderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Order/${orderId}`,
				};
				break;

			case 'getMany':
				const filters = this.executeFunctions.getNodeParameter('filters', itemIndex, {}) as any;
				const queryParams: IDataObject = {};
				if (filters.status) queryParams.status = filters.status;
				if (filters.orderNumber) queryParams.orderNumber = filters.orderNumber;
				if (filters.startDate) queryParams.startDate = filters.startDate;
				if (filters.endDate) queryParams.endDate = filters.endDate;
				if (filters.contactId) {
					queryParams['contact[id]'] = filters.contactId;
					queryParams['contact[objectName]'] = 'Contact';
				}

				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Order`,
					qs: queryParams,
				};
				break;

			case 'create':
				const orderData = this.executeFunctions.getNodeParameter('order', itemIndex) as any;
				const orderPosSave = this.executeFunctions.getNodeParameter('orderPosSave', itemIndex, []) as any;

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Order/Factory/saveOrder`,
					body: {
						order: orderData,
						orderPosSave,
					},
				};
				break;

			case 'update':
				const updateOrderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const contactId = this.executeFunctions.getNodeParameter('contactId', itemIndex, '') as string;
				const contactPersonId = this.executeFunctions.getNodeParameter('contactPersonId', itemIndex, '') as string;

				const updateBody: any = {};
				if (contactId) updateBody.contact = contactId;
				if (contactPersonId) updateBody.contactPerson = contactPersonId;

				requestOptions = {
					...requestOptions,
					method: 'PUT',
					url: `${baseURL}/Order/${updateOrderId}`,
					body: updateBody,
				};
				break;

			case 'delete':
				const deleteOrderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'DELETE',
					url: `${baseURL}/Order/${deleteOrderId}`,
				};
				break;

			case 'createInvoice':
				const invoiceOrderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const partSum = this.executeFunctions.getNodeParameter('partSum', itemIndex, false) as boolean;

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Order/Factory/createInvoice`,
					body: {
						order: { id: invoiceOrderId, objectName: 'Order' },
						'part-sum': partSum,
					},
				};
				break;

			case 'downloadPdf':
				const pdfOrderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				requestOptions = {
					...requestOptions,
					method: 'GET',
					url: `${baseURL}/Order/${pdfOrderId}/getPdf`,
				};
				break;

			case 'sendViaEmail':
				const emailOrderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const email = this.executeFunctions.getNodeParameter('email', itemIndex) as string;
				const subject = this.executeFunctions.getNodeParameter('subject', itemIndex, '') as string;
				const text = this.executeFunctions.getNodeParameter('text', itemIndex, '') as string;

				requestOptions = {
					...requestOptions,
					method: 'POST',
					url: `${baseURL}/Order/${emailOrderId}/sendViaEmail`,
					body: {
						to: email,
						subject,
						text,
					},
				};
				break;

			default:
				throw new NodeApiError(this.executeFunctions.getNode(), {
					message: `Unknown order operation: ${operation}`,
					description: 'Please check the operation parameter.',
				});
		}

		try {
			const response = await this.executeFunctions.helpers.httpRequest(requestOptions) as SevDeskResponse<SevDeskOrder>;

			// Extract appropriate data from response
			let responseData: any = response;
			if (response.objects) {
				responseData = response.objects;
			}

			return {
				json: responseData as IDataObject,
				pairedItem: {
					item: itemIndex,
				},
			};
		} catch (error) {
			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Order operation failed: ${error.message}`,
				description: `Failed to execute ${operation} operation on order resource.`,
			});
		}
	}

	/**
	 * Handle credit note operations
	 */
	private async handleCreditNoteOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "creditNote",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle category operations
	 */
	private async handleCategoryOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "category",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle check account operations
	 */
	private async handleCheckAccountOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "checkAccount",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle part operations
	 */
	private async handlePartOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "part",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle tag operations
	 */
	private async handleTagOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "tag",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle report operations
	 */
	private async handleReportOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "report",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle export operations
	 */
	private async handleExportOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "export",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle basics operations
	 */
	private async handleBasicsOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation
		const result = {
			resource: "basics",
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			// Add actual operation results here
		};

		return { json: result };
	}

	/**
	 * Handle batch operations
	 */
	private async handleBatchOperation(
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		this.logApiInteraction('info', `Starting batch operation: ${operation}`, { itemIndex });

		try {
			switch (operation) {
				case 'executeBatch':
					// Check if JSON batch config is provided
					const jsonBatchConfig = this.executeFunctions.getNodeParameter('jsonBatchConfig', itemIndex, null) as string | null;

					let batchRequest: IBatchRequest;

					if (jsonBatchConfig && jsonBatchConfig.trim() !== '') {
						// Parse JSON configuration
						try {
							const parsedConfig = JSON.parse(jsonBatchConfig);
							batchRequest = BatchOperationHandler.createBatchRequest(
								parsedConfig.operations || [],
								parsedConfig.options || {}
							);
						} catch (parseError) {
							throw new Error(`Invalid JSON batch configuration: ${parseError.message}`);
						}
					} else {
						// Use form-based configuration
						batchRequest = this.createBatchFromInputData(itemIndex);
					}

					// Execute the batch operations
					const batchResult = await this.executeBatchOperations(batchRequest);

					// Process the results based on user preferences
					const processingOptions = this.executeFunctions.getNodeParameter('processingOptions', itemIndex, {}) as any;
					const returnDetailedResults = processingOptions.returnDetailedResults !== false;

					if (returnDetailedResults) {
						// Return detailed results
						return {
							json: {
								success: batchResult.success,
								summary: batchResult.summary,
								results: batchResult.results
							} as IDataObject,
							pairedItem: {
								item: itemIndex,
							},
						};
					} else {
						// Return only successful results data
						const successfulData = batchResult.results
							.filter(result => result.success)
							.map(result => result.data)
							.filter(data => data !== null && data !== undefined);

						return {
							json: {
								success: batchResult.success,
								summary: batchResult.summary,
								data: successfulData
							} as IDataObject,
							pairedItem: {
								item: itemIndex,
							},
						};
					}

				default:
					throw new Error(`Unknown batch operation: ${operation}`);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.logApiInteraction('error', `Batch operation failed: ${errorMessage}`, { operation, itemIndex });

			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Batch operation failed: ${errorMessage}`,
				description: 'Please check your batch configuration and try again.',
			});
		}
	}

	/**
	 * Handle generic operations for resources not specifically implemented
	 */
	private async handleGenericOperation(
		resource: string,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData | null> {
		// This is a placeholder implementation for resources that don't have specific handlers yet
		const result = {
			resource,
			operation,
			itemIndex,
			timestamp: new Date().toISOString(),
			note: "Generic operation handler - implement specific logic as needed",
			// Add actual operation results here
		};

		return { json: result };
	}
}
