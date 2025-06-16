"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryFields = exports.countryOperations = void 0;
exports.countryOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: 'getMany',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['country'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Gets many countries',
                description: 'Gets many countries',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/StaticCountry',
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
exports.countryFields = [];
//# sourceMappingURL=CountryDescription.js.map