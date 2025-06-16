"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactFieldFields = exports.contactFieldOperations = void 0;
exports.contactFieldOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['contactField'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many contact fields',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/ContactField',
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
        default: 'getMany',
    },
];
exports.contactFieldFields = [];
//# sourceMappingURL=ContactFieldDescription.js.map