"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevDeskApi = void 0;
class SevDeskApi {
    constructor() {
        this.name = 'sevDeskApi';
        this.displayName = 'sevDesk API';
        this.documentationUrl = 'https://api.sevdesk.de/#section/Authentication-and-Authorization';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Your SevDesk API key. You can find it in your SevDesk account settings.',
            },
            {
                displayName: 'API Version',
                name: 'apiVersion',
                type: 'options',
                options: [
                    {
                        name: 'v1 (Legacy)',
                        value: 'v1',
                    },
                    {
                        name: 'v2 (Recommended)',
                        value: 'v2',
                    },
                ],
                default: 'v2',
                description: 'The API version to use. v2 is recommended for new implementations.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://my.sevdesk.de/api/{{$credentials.apiVersion}}/Contact',
                method: 'GET',
                qs: {
                    limit: 1,
                },
            },
        };
    }
}
exports.SevDeskApi = SevDeskApi;
//# sourceMappingURL=SevDeskApi.credentials.js.map