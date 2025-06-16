"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unityFields = exports.unityOperations = void 0;
exports.unityOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: 'getMany',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['unity'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many unities',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Unity',
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
exports.unityFields = [];
//# sourceMappingURL=UnityDescription.js.map