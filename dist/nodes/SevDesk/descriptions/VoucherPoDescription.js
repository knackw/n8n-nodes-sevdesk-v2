"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherPoFields = exports.voucherPoOperations = void 0;
exports.voucherPoOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['voucherPo'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                description: 'Get many voucher positions',
                action: 'Get many voucher positions',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/VoucherPos',
                        qs: {
                            'voucher[id]': '={{$parameter.filters.voucherId}}',
                            'voucher[objectName]': 'Voucher',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
        ],
        default: 'getMany',
    },
];
exports.voucherPoFields = [
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['voucherPo'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Voucher ID',
                name: 'voucherId',
                type: 'string',
                default: '',
                description: 'The ID of the voucher to get positions for',
            },
        ],
    },
];
//# sourceMappingURL=VoucherPoDescription.js.map