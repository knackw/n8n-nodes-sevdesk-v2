"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicsFields = exports.basicsOperations = void 0;
exports.basicsOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['basics'],
            },
        },
        options: [
            {
                name: 'Get Bookkeeping System Version',
                value: 'getBookkeepingSystemVersion',
                action: 'Get the bookkeeping system version',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Tools/bookkeepingSystemVersion',
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
        default: 'getBookkeepingSystemVersion',
    },
];
exports.basicsFields = [];
//# sourceMappingURL=BasicsDescription.js.map