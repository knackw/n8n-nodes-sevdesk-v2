"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFields = exports.categoryOperations = void 0;
exports.categoryOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: 'getMany',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['category'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many categories',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Category',
                        qs: {
                            objectType: '={{$parameter.filters.objectType}}',
                        },
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'objects',
                                },
                            },
                        ],
                    },
                },
            },
        ],
    },
];
exports.categoryFields = [
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['category'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Object Type',
                name: 'objectType',
                description: 'The type of object to filter by',
                type: 'options',
                default: 'contactAddress',
                options: [
                    {
                        name: 'Contact Address',
                        value: 'contactAddress',
                    },
                    {
                        name: 'Part',
                        value: 'Part',
                    },
                ],
            },
        ],
    },
];
//# sourceMappingURL=CategoryDescription.js.map