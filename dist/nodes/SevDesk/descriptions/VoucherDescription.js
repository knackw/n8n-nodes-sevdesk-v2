"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherFields = exports.voucherOperations = void 0;
exports.voucherOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['voucher'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a voucher',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/Voucher/Factory/saveVoucher',
                        body: {
                            voucher: '={{$parameter.voucher}}',
                            voucherPosSave: '={{$parameter.voucherPosSave}}',
                            voucherPosDelete: null,
                            filename: '={{$parameter.fileName}}',
                        },
                    },
                    output: {
                        postReceive: [
                            { type: 'rootProperty', properties: { property: 'objects' } },
                            { type: 'rootProperty', properties: { property: 'voucher' } },
                        ],
                    },
                },
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a voucher',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/Voucher/{{$parameter.voucherId}}',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a voucher',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '/Voucher/{{$parameter.voucherId}}',
                    },
                },
            },
            {
                name: 'Enshrine',
                value: 'enshrine',
                action: 'Enshrine a voucher',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/Voucher/{{$parameter.voucherId}}/enshrine',
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a voucher',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Voucher/{{$parameter.voucherId}}',
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many vouchers',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Voucher',
                        qs: {
                            status: '={{$parameter.filters.status}}',
                            creditDebit: '={{$parameter.filters.creditDebit}}',
                            description: '={{$parameter.filters.description}}',
                            startDate: '={{$parameter.filters.startDate}}',
                            endDate: '={{$parameter.filters.endDate}}',
                            'contact[id]': '={{$parameter.filters.contactId}}',
                            'contact[objectName]': 'Contact',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Upload File',
                value: 'uploadFile',
                action: 'Upload a file for a voucher',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/Voucher/Factory/uploadTempFile',
                        body: {
                            data: '={{$binary.data}}',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Book',
                value: 'book',
                action: 'Book a voucher',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/Voucher/{{$parameter.voucherId}}/bookAmount',
                        body: {
                            amount: '={{$parameter.amount}}',
                            date: '={{$parameter.date}}',
                            type: '={{$parameter.paymentType}}',
                            checkAccount: '={\"id\": \"{{$parameter.checkAccountId}}\", \"objectName\": \"CheckAccount\"}',
                        },
                    },
                },
            },
            {
                name: 'Reset to Open',
                value: 'resetToOpen',
                action: 'Reset a voucher to open',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/Voucher/{{$parameter.voucherId}}/resetToOpen',
                    },
                },
            },
            {
                name: 'Reset to Draft',
                value: 'resetToDraft',
                action: 'Reset a voucher to draft',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/Voucher/{{$parameter.voucherId}}/resetToDraft',
                    },
                },
            },
        ],
        default: 'getMany',
    },
];
exports.voucherFields = [
    {
        displayName: 'Voucher ID',
        name: 'voucherId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['get', 'enshrine', 'delete', 'update', 'book', 'resetToOpen', 'resetToDraft'],
            },
        },
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Draft', value: 50 },
                    { name: 'Open', value: 100 },
                    { name: 'Paid', value: 1000 },
                ],
                default: 50,
            },
            {
                displayName: 'Credit/Debit',
                name: 'creditDebit',
                type: 'options',
                options: [
                    { name: 'Credit', value: 'C' },
                    { name: 'Debit', value: 'D' },
                ],
                default: 'C',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Start Date',
                name: 'startDate',
                type: 'number',
                default: 0,
                description: 'Timestamp',
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'number',
                default: 0,
                description: 'Timestamp',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        displayName: 'Voucher',
        name: 'voucher',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['create', 'update'],
            },
        },
        options: [
            {
                displayName: 'Voucher ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'The voucher ID. Leave empty to create a new one.',
            },
            {
                displayName: 'Voucher Date',
                name: 'voucherDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Supplier ID',
                name: 'supplierId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Supplier Name',
                name: 'supplierName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Pay Date',
                name: 'payDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Draft', value: 50 },
                    { name: 'Open', value: 100 },
                ],
                default: 50,
            },
            {
                displayName: 'Credit/Debit',
                name: 'creditDebit',
                type: 'options',
                options: [
                    { name: 'Credit', value: 'C' },
                    { name: 'Debit', value: 'D' },
                ],
                default: 'C',
            },
            {
                displayName: 'Voucher Type',
                name: 'voucherType',
                type: 'options',
                options: [
                    { name: 'Voucher', value: 'VOU' },
                    { name: 'Credit', value: 'CRED' },
                ],
                default: 'VOU',
            },
            {
                displayName: 'Tax Type',
                name: 'taxType',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Currency',
                name: 'currency',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['create'],
            },
        },
        description: 'Filename of a previously uploaded file which should be attached.',
    },
    {
        displayName: 'Voucher Positions',
        name: 'voucherPosSave',
        type: 'fixedCollection',
        placeholder: 'Add Position',
        default: {},
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['create'],
            },
        },
        typeOptions: {
            multipleValues: true,
        },
        options: [
            {
                name: 'values',
                displayName: 'Position',
                type: 'collection',
                default: {},
                options: [
                    {
                        displayName: 'Accounting Type ID',
                        name: 'accountingTypeId',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Tax Rate',
                        name: 'taxRate',
                        type: 'number',
                        default: 0,
                    },
                    {
                        displayName: 'Sum',
                        name: 'sum',
                        type: 'number',
                        default: 0,
                    },
                    {
                        displayName: 'Comment',
                        name: 'comment',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['book'],
            },
        },
    },
    {
        displayName: 'Date',
        name: 'date',
        type: 'dateTime',
        default: '',
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['book'],
            },
        },
    },
    {
        displayName: 'Payment Type',
        name: 'paymentType',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['book'],
            },
        },
    },
    {
        displayName: 'Check Account ID',
        name: 'checkAccountId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['voucher'],
                operation: ['book'],
            },
        },
    },
];
//# sourceMappingURL=VoucherDescription.js.map