/**
 * TypeScript interfaces for SevDesk API response types
 * These interfaces provide type safety for API responses
 */

// Base interfaces
export interface SevDeskBaseObject {
	id: string;
	objectName: string;
	create: string;
	update: string;
	sevClient?: {
		id: string;
		objectName: string;
	};
}

export interface SevDeskApiResponse<T = any> {
	objects: T[];
	total?: number;
}

// Contact interfaces
export interface SevDeskContact extends SevDeskBaseObject {
	name: string;
	name2?: string;
	familyname?: string;
	titel?: string;
	category: {
		id: string;
		objectName: string;
	};
	description?: string;
	academicTitle?: string;
	gender?: string;
	customerNumber?: string;
	parent?: {
		id: string;
		objectName: string;
	};
	surename?: string;
	familyname2?: string;
	taxNumber?: string;
	vatNumber?: string;
	bankAccount?: string;
	bankNumber?: string;
	defaultCashbackTime?: number;
	defaultCashbackPercent?: number;
	defaultTimeToPay?: number;
	taxRule?: {
		id: string;
		objectName: string;
	};
	taxSet?: {
		id: string;
		objectName: string;
	};
	exemptVat?: boolean;
	taxType?: string;
	taxTypeNew?: number;
	defaultDiscountAmount?: number;
	defaultDiscountPercentage?: number;
}

// Invoice interfaces
export interface SevDeskInvoice extends SevDeskBaseObject {
	invoiceNumber?: string;
	contact: {
		id: string;
		objectName: string;
	};
	contactPerson?: {
		id: string;
		objectName: string;
	};
	invoiceDate: string;
	header?: string;
	headText?: string;
	footText?: string;
	timeToPay?: number;
	discountTime?: number;
	discount?: number;
	addressName?: string;
	addressStreet?: string;
	addressZip?: string;
	addressCity?: string;
	addressCountry?: {
		id: string;
		objectName: string;
	};
	payDate?: string;
	createUser: {
		id: string;
		objectName: string;
	};
	deliveryDate?: string;
	status: number;
	smallSettlement?: boolean;
	contactPersonInternalNote?: string;
	showNet?: boolean;
	enshrined?: string;
	sendType?: string;
	invoiceType?: string;
	currency?: string;
	sumNet?: number;
	sumTax?: number;
	sumGross?: number;
	sumDiscounts?: number;
	sumNetForeignCurrency?: number;
	sumTaxForeignCurrency?: number;
	sumGrossForeignCurrency?: number;
	sumDiscountsForeignCurrency?: number;
	customerInternalNote?: string;
	origin?: {
		id: string;
		objectName: string;
	};
}

// Voucher interfaces
export interface SevDeskVoucher extends SevDeskBaseObject {
	voucherDate: string;
	supplier?: {
		id: string;
		objectName: string;
	};
	supplierName?: string;
	description?: string;
	payDate?: string;
	status: number;
	sumNet?: number;
	sumTax?: number;
	sumGross?: number;
	taxRule?: {
		id: string;
		objectName: string;
	};
	creditDebit?: string;
	voucherType?: string;
	currency?: string;
	propertyForeignCurrencyDeadline?: string;
	propertyExchangeRate?: number;
	recurring?: boolean;
	recurringStartDate?: string;
	recurringNextVoucher?: string;
	recurringLastVoucher?: string;
	recurringEndDate?: string;
	enshrined?: string;
	taxSet?: {
		id: string;
		objectName: string;
	};
	paymentDeadline?: string;
	deliveryDate?: string;
	deliveryDateUntil?: string;
}

// Order interfaces
export interface SevDeskOrder extends SevDeskBaseObject {
	orderNumber?: string;
	contact: {
		id: string;
		objectName: string;
	};
	contactPerson?: {
		id: string;
		objectName: string;
	};
	orderDate: string;
	status: number;
	header?: string;
	headText?: string;
	footText?: string;
	addressName?: string;
	addressStreet?: string;
	addressZip?: string;
	addressCity?: string;
	addressCountry?: {
		id: string;
		objectName: string;
	};
	createUser: {
		id: string;
		objectName: string;
	};
	orderType?: string;
	sendDate?: string;
	origin?: {
		id: string;
		objectName: string;
	};
	version?: number;
	smallSettlement?: boolean;
	contactPersonInternalNote?: string;
	showNet?: boolean;
	sendType?: string;
	currency?: string;
	sumNet?: number;
	sumTax?: number;
	sumGross?: number;
	sumDiscounts?: number;
	sumNetForeignCurrency?: number;
	sumTaxForeignCurrency?: number;
	sumGrossForeignCurrency?: number;
	sumDiscountsForeignCurrency?: number;
	customerInternalNote?: string;
}

// Credit Note interfaces
export interface SevDeskCreditNote extends SevDeskBaseObject {
	creditNoteNumber?: string;
	contact: {
		id: string;
		objectName: string;
	};
	contactPerson?: {
		id: string;
		objectName: string;
	};
	creditNoteDate: string;
	status: number;
	header?: string;
	headText?: string;
	footText?: string;
	addressName?: string;
	addressStreet?: string;
	addressZip?: string;
	addressCity?: string;
	addressCountry?: {
		id: string;
		objectName: string;
	};
	createUser: {
		id: string;
		objectName: string;
	};
	creditNoteType?: string;
	currency?: string;
	sumNet?: number;
	sumTax?: number;
	sumGross?: number;
	sumDiscounts?: number;
	sumNetForeignCurrency?: number;
	sumTaxForeignCurrency?: number;
	sumGrossForeignCurrency?: number;
	sumDiscountsForeignCurrency?: number;
	customerInternalNote?: string;
	smallSettlement?: boolean;
	showNet?: boolean;
	sendType?: string;
}

// Category interfaces
export interface SevDeskCategory extends SevDeskBaseObject {
	name: string;
	priority?: number;
	code?: string;
	color?: string;
	postingAccount?: string;
	translationCode?: string;
	hasCashDiscount?: boolean;
}

// CheckAccount interfaces
export interface SevDeskCheckAccount extends SevDeskBaseObject {
	name: string;
	type: string;
	importType?: string;
	currency: string;
	defaultAccount?: number;
	status: number;
	autoMapTransactions?: number;
	accountingSystemNumber?: string;
	clientNumber?: string;
	bankServer?: string;
	bankCode?: string;
	description?: string;
}

// Part interfaces
export interface SevDeskPart extends SevDeskBaseObject {
	name: string;
	partNumber: string;
	text?: string;
	category?: {
		id: string;
		objectName: string;
	};
	stock?: number;
	stockEnabled?: boolean;
	unity: {
		id: string;
		objectName: string;
	};
	price?: number;
	priceNet?: number;
	priceGross?: number;
	taxRate?: number;
	status?: number;
	internalComment?: string;
}

// Tag interfaces
export interface SevDeskTag extends SevDeskBaseObject {
	name: string;
	color?: string;
}

// Unity interfaces
export interface SevDeskUnity extends SevDeskBaseObject {
	name: string;
	description?: string;
}

// Country interfaces
export interface SevDeskCountry extends SevDeskBaseObject {
	name: string;
	code: string;
	nameEn?: string;
	priority?: number;
}

// Communication Way interfaces
export interface SevDeskCommunicationWay extends SevDeskBaseObject {
	contact: {
		id: string;
		objectName: string;
	};
	type: string;
	value: string;
	primary?: boolean;
	key: {
		id: string;
		objectName: string;
	};
}

// Error response interface
export interface SevDeskErrorResponse {
	error: {
		message: string;
		code?: number;
		details?: any;
	};
}

// Generic API response wrapper
export interface SevDeskResponse<T = any> {
	objects?: T[];
	total?: number;
	error?: SevDeskErrorResponse['error'];
}

// Request parameter interfaces
export interface SevDeskListParams {
	limit?: number;
	offset?: number;
	embed?: string[];
	countAll?: boolean;
}

export interface SevDeskContactListParams extends SevDeskListParams {
	depth?: number;
	customerNumber?: string;
}

export interface SevDeskInvoiceListParams extends SevDeskListParams {
	status?: number;
	invoiceNumber?: string;
	startDate?: string;
	endDate?: string;
	contactId?: string;
}

export interface SevDeskVoucherListParams extends SevDeskListParams {
	status?: number;
	creditDebit?: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	contactId?: string;
}

export interface SevDeskOrderListParams extends SevDeskListParams {
	status?: number;
	orderNumber?: string;
	startDate?: string;
	endDate?: string;
	contactId?: string;
}

// ===== GENERIC API PATTERN TYPES =====

// Generic pagination types
export interface PaginationParams {
	limit?: number;
	offset?: number;
	page?: number;
	pageSize?: number;
}

export interface CursorPaginationParams {
	cursor?: string;
	limit?: number;
	direction?: 'forward' | 'backward';
}

export interface PaginationMeta {
	total: number;
	limit: number;
	offset: number;
	page?: number;
	pageSize?: number;
	hasNext?: boolean;
	hasPrevious?: boolean;
	totalPages?: number;
}

export interface CursorPaginationMeta {
	hasNext: boolean;
	hasPrevious: boolean;
	nextCursor?: string;
	previousCursor?: string;
	total?: number;
}

// Generic filtering types
export type FilterOperator =
	| 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
	| 'in' | 'nin' | 'like' | 'ilike' | 'regex'
	| 'exists' | 'null' | 'between';

export interface FilterCondition<T = any> {
	field: string;
	operator: FilterOperator;
	value: T | T[];
}

export interface FilterGroup {
	operator: 'and' | 'or';
	conditions: (FilterCondition | FilterGroup)[];
}

export type FilterParams = FilterCondition | FilterGroup;

// Generic sorting types
export type SortDirection = 'asc' | 'desc';

export interface SortField {
	field: string;
	direction: SortDirection;
}

export type SortParams = SortField | SortField[] | string | string[];

// Generic search types
export interface SearchParams {
	query: string;
	fields?: string[];
	operator?: 'and' | 'or';
	fuzzy?: boolean;
	boost?: Record<string, number>;
}

// Generic API request types
export interface ApiRequestParams extends PaginationParams {
	filter?: FilterParams;
	sort?: SortParams;
	search?: SearchParams;
	embed?: string[];
	fields?: string[];
	include?: string[];
	exclude?: string[];
}

// Generic API response types
export interface ApiResponse<T = any> {
	data: T[];
	meta: PaginationMeta;
	links?: {
		first?: string;
		last?: string;
		prev?: string;
		next?: string;
		self?: string;
	};
}

export interface CursorApiResponse<T = any> {
	data: T[];
	meta: CursorPaginationMeta;
	links?: {
		prev?: string;
		next?: string;
		self?: string;
	};
}

export interface SingleApiResponse<T = any> {
	data: T;
	meta?: Record<string, any>;
}

// Utility types for API transformations
export type ApiRequestTransform<TInput, TOutput = TInput> = (input: TInput) => TOutput;
export type ApiResponseTransform<TInput, TOutput = TInput> = (response: TInput) => TOutput;

export interface ApiTransforms<TRequest = any, TResponse = any> {
	request?: ApiRequestTransform<TRequest>;
	response?: ApiResponseTransform<TResponse>;
}

// Generic resource operation types
export type ResourceOperation = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search';

export interface ResourceOperationConfig<T = any> {
	operation: ResourceOperation;
	endpoint: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	transforms?: ApiTransforms<T>;
	validation?: (data: T) => boolean | string;
}

// Generic batch operation types
export interface BatchRequest<T = any> {
	operations: Array<{
		operation: ResourceOperation;
		resource: string;
		data?: T;
		id?: string;
	}>;
	options?: {
		stopOnError?: boolean;
		parallel?: boolean;
		maxConcurrency?: number;
	};
}

export interface BatchResponse<T = any> {
	results: Array<{
		success: boolean;
		data?: T;
		error?: string;
		operation: ResourceOperation;
		resource: string;
	}>;
	summary: {
		total: number;
		successful: number;
		failed: number;
		duration: number;
	};
}

// Type helpers for strict typing
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PickByType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? K : never }[keyof T]>;
export type OmitByType<T, U> = Omit<T, { [K in keyof T]: T[K] extends U ? K : never }[keyof T]>;

// API error types
export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
	field?: string;
	statusCode?: number;
}

export interface ValidationError extends ApiError {
	field: string;
	value?: any;
	constraint?: string;
}

export type ApiErrorResponse = {
	errors: ApiError[];
	message: string;
	statusCode: number;
	timestamp: string;
};
