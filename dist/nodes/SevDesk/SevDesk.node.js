"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevDesk = void 0;
const descriptions_1 = require("./descriptions");
class SevDesk {
    constructor() {
        this.description = {
            displayName: 'sevDesk',
            name: 'sevDesk',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the sevDesk API',
            icon: 'file:sevDesk.svg',
            defaults: {
                name: 'sevDesk',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'sevDeskApi',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: 'https://my.sevdesk.de/api/{{$credentials.apiVersion}}/',
                url: '',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    default: 'contact',
                    options: [
                        {
                            name: 'AccountingContact',
                            value: 'accountingContact',
                        },
                        {
                            name: 'Basic',
                            value: 'basics',
                        },
                        {
                            name: 'Category',
                            value: 'category',
                        },
                        {
                            name: 'CheckAccount',
                            value: 'checkAccount',
                        },
                        {
                            name: 'CheckAccountTransaction',
                            value: 'checkAccountTransaction',
                        },
                        {
                            name: 'CommunicationWay',
                            value: 'communicationWay',
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Contact Address',
                            value: 'contactAddress',
                        },
                        {
                            name: 'Contact Custom Field',
                            value: 'contactCustomField',
                        },
                        {
                            name: 'Contact Custom Field Setting',
                            value: 'contactCustomFieldSetting',
                        },
                        {
                            name: 'Contact Field',
                            value: 'contactField',
                        },
                        {
                            name: 'Country',
                            value: 'country',
                        },
                        {
                            name: 'Credit Note',
                            value: 'creditNote',
                        },
                        {
                            name: 'Credit Note Po',
                            value: 'creditNotePos',
                        },
                        {
                            name: 'Export',
                            value: 'export',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Layout',
                            value: 'layout',
                        },
                        {
                            name: 'Order',
                            value: 'order',
                        },
                        {
                            name: 'Order Position',
                            value: 'orderPos',
                        },
                        {
                            name: 'OrderPo',
                            value: 'orderPo',
                        },
                        {
                            name: 'Part',
                            value: 'part',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                        {
                            name: 'Tag Relation',
                            value: 'tagRelation',
                        },
                        {
                            name: 'Unit',
                            value: 'unit',
                        },
                        {
                            name: 'Voucher',
                            value: 'voucher',
                        },
                        {
                            name: 'VoucherPo',
                            value: 'voucherPo',
                        },
                    ],
                },
                ...descriptions_1.contactOperations,
                ...descriptions_1.contactFields,
                ...descriptions_1.contactAddressOperations,
                ...descriptions_1.contactAddressFields,
                ...descriptions_1.contactCustomFieldOperations,
                ...descriptions_1.contactCustomFieldFields,
                ...descriptions_1.contactCustomFieldSettingOperations,
                ...descriptions_1.contactCustomFieldSettingFields,
                ...descriptions_1.contactFieldOperations,
                ...descriptions_1.contactFieldFields,
                ...descriptions_1.countryOperations,
                ...descriptions_1.countryFields,
                ...descriptions_1.categoryOperations,
                ...descriptions_1.categoryFields,
                ...descriptions_1.communicationWayOperations,
                ...descriptions_1.communicationWayFields,
                ...descriptions_1.accountingContactOperations,
                ...descriptions_1.accountingContactFields,
                ...descriptions_1.unityOperations,
                ...descriptions_1.unityFields,
                ...descriptions_1.orderOperations,
                ...descriptions_1.orderFields,
                ...descriptions_1.orderPosOperations,
                ...descriptions_1.orderPosFields,
                ...descriptions_1.orderPoOperations,
                ...descriptions_1.partOperations,
                ...descriptions_1.partFields,
                ...descriptions_1.checkAccountOperations,
                ...descriptions_1.checkAccountFields,
                ...descriptions_1.checkAccountTransactionOperations,
                ...descriptions_1.checkAccountTransactionFields,
                ...descriptions_1.creditNoteOperations,
                ...descriptions_1.creditNoteFields,
                ...descriptions_1.creditNotePosOperations,
                ...descriptions_1.creditNotePosFields,
                ...descriptions_1.exportOperations,
                ...descriptions_1.exportFields,
                ...descriptions_1.tagOperations,
                ...descriptions_1.tagFields,
                ...descriptions_1.tagRelationOperations,
                ...descriptions_1.tagRelationFields,
                ...descriptions_1.invoiceOperations,
                ...descriptions_1.invoiceFields,
                ...descriptions_1.layoutOperations,
                ...descriptions_1.layoutFields,
                ...descriptions_1.reportOperations,
                ...descriptions_1.reportFields,
                ...descriptions_1.voucherOperations,
                ...descriptions_1.voucherFields,
                ...descriptions_1.voucherPoOperations,
                ...descriptions_1.voucherPoFields,
                ...descriptions_1.voucherPosOperations,
                ...descriptions_1.voucherPosFields,
                ...descriptions_1.basicsOperations,
                ...descriptions_1.basicsFields,
            ],
        };
    }
}
exports.SevDesk = SevDesk;
//# sourceMappingURL=SevDesk.node.js.map