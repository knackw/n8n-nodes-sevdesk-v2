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
