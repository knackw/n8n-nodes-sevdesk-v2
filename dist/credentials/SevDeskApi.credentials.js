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
                baseURL: 'https://my.sevdesk.de/api/v1/Contact',
                method: 'GET',
            },
        };
    }
}
exports.SevDeskApi = SevDeskApi;
//# sourceMappingURL=SevDeskApi.credentials.js.map