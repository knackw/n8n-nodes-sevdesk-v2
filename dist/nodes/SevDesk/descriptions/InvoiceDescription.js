"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceFields = exports.invoiceOperations = void 0;
exports.invoiceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['invoice'],
            },
        },
        options: [
            {
                name: 'Create or Update',
                value: 'createOrUpdate',
                description: 'Create or update an invoice',
                action: 'Create or update an invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/Invoice/Factory/saveInvoice',
                        body: {
                            invoice: '=S{\n const invoiceData = { ...$parameter.invoice };\n if (invoiceData.contactId) { invoiceData.contact = { id: invoiceData.contactId, objectName: \"Contact\" }; delete invoiceData.contactId; }\n if (invoiceData.contactPersonId) { invoiceData.contactPerson = { id: invoiceData.contactPersonId, objectName: \"SevUser\" }; delete invoiceData.contactPersonId; }\n return invoiceData;\n}',
                            invoicePosSave: '={{$parameter.invoicePosSave.values}}',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'invoice' } }],
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Returns a single invoice',
                action: 'Get an invoice',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/Invoice/{{$parameter.invoiceId}}',
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
            {
                name: 'Get Many',
                value: 'getMany',
                description: 'Get many invoices',
                action: 'Get many invoices',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/Invoice',
                        qs: {
                            status: '={{$parameter.filters.status}}',
                            invoiceNumber: '={{$parameter.filters.invoiceNumber}}',
                            startDate: '={{$parameter.filters.startDate}}',
                            endDate: '={{$parameter.filters.endDate}}',
                            'contact[id]': '={{$parameter.filters.contactId}}',
                            'contact[objectName]': '={{$parameter.filters.contactId ? "Contact" : undefined}}',
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
            {
                name: 'Get Positions',
                value: 'getPositions',
                description: 'Returns all positions of an invoice',
                action: 'Get invoice positions',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/Invoice/{{$parameter.invoiceId}}/getPositions',
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Book Amount',
                value: 'bookAmount',
                description: 'Books a payment amount to an invoice',
                action: 'Book an amount to an invoice',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/bookAmount',
                        body: {
                            amount: '={{$parameter.amount}}',
                            date: '={{$parameter.date}}',
                            type: '={{$parameter.paymentType}}',
                            checkAccount: '=S{ return { id: $parameter.checkAccountId, objectName: \"CheckAccount\" }; }',
                            createFeed: '={{$parameter.createFeed}}',
                        },
                    },
                },
            },
            {
                name: 'Cancel',
                value: 'cancel',
                description: 'Cancels an invoice',
                action: 'Cancel an invoice',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/cancelInvoice',
                        qs: {
                            cancellationText: '={{$parameter.cancellationText}}',
                        },
                    },
                },
            },
            {
                name: 'Create From Order',
                value: 'createFromOrder',
                description: 'Creates an invoice from an order',
                action: 'Create an invoice from an order',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/Invoice/Factory/createInvoiceFromOrder',
                        body: {
                            order: '={{ { id: $parameter.orderId, objectName: \"Order\" } }}',
                            type: '={{$parameter.creationType}}',
                            amount: '={{$parameter.orderAmount}}',
                            partialType: '={{$parameter.partialType}}',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'invoice' } }],
                    },
                },
            },
            {
                name: 'Create Reminder',
                value: 'createReminder',
                description: 'Creates a reminder for an invoice',
                action: 'Create a reminder for an invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/Invoice/Factory/createReminder',
                        body: {
                            invoice: '={{ { id: $parameter.invoiceId, objectName: \"Invoice\" } }}',
                        },
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'invoice' } }],
                    },
                },
            },
            {
                name: 'Is Partially Paid',
                value: 'isPartiallyPaid',
                description: 'Checks if an invoice is partially paid',
                action: 'Check if an invoice is partially paid',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/Invoice/{{$parameter.invoiceId}}/isPartiallyPaid',
                    },
                    output: {
                        postReceive: [{ type: 'rootProperty', properties: { property: 'objects' } }],
                    },
                },
            },
            {
                name: 'Mark as Sent',
                value: 'markAsSent',
                description: 'Marks an invoice as sent',
                action: 'Mark an invoice as sent',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/sendBy',
                        body: {
                            sendType: '={{$parameter.sendType}}',
                            sendDate: '={{$parameter.sendDate}}',
                        },
                    },
                },
            },
            {
                name: 'Render PDF',
                value: 'renderPdf',
                description: 'Renders the PDF document of an invoice',
                action: 'Render an invoice PDF',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/Invoice/{{$parameter.invoiceId}}/render',
                        body: {
                            forceReload: '={{$parameter.forceReload}}',
                        },
                    },
                },
            },
            {
                name: 'Download PDF',
                value: 'downloadPdf',
                description: 'Retrieves the PDF document of an invoice',
                action: 'Download an invoice PDF',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/Invoice/{{$parameter.invoiceId}}/getPdf',
                        qs: {
                            download: '={{$parameter.download}}',
                            preventive: '={{$parameter.preventive}}',
                        },
                    },
                },
            },
            {
                name: 'Download XML',
                value: 'downloadXml',
                description: 'Retrieves the XML of an e-invoice',
                action: 'Download an invoice XML',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/Invoice/{{$parameter.invoiceId}}/getXml',
                    },
                },
            },
            {
                name: 'Enshrine',
                value: 'enshrine',
                description: 'Sets the current date and time as a value for the property enshrined',
                action: 'Enshrine an invoice',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/enshrine',
                    },
                },
            },
            {
                name: 'Reset to Draft',
                value: 'resetToDraft',
                description: 'Resets the status to \"Draft\" if it has the status \"Open\"',
                action: 'Reset an invoice to draft',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/resetToDraft',
                    },
                },
            },
            {
                name: 'Reset to Open',
                value: 'resetToOpen',
                description: 'Resets the status to \"Open\" if it has the status \"Paid\"',
                action: 'Reset an invoice to open',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/Invoice/{{$parameter.invoiceId}}/resetToOpen',
                    },
                },
            },
            {
                name: 'Send by Email',
                value: 'sendByEmail',
                description: 'Sends an invoice by email',
                action: 'Send an invoice by email',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/Invoice/{{$parameter.invoiceId}}/sendViaEmail',
                        body: {
                            to: '={{$parameter.email}}',
                            subject: '={{$parameter.subject}}',
                            text: '={{$parameter.text}}',
                            copy: '={{$parameter.copy}}',
                            additionalAttachments: '={{$parameter.additionalAttachments}}',
                            bccEmail: '={{$parameter.bccEmail}}',
                            sendXml: '={{$parameter.sendXml}}',
                        },
                    },
                },
            },
        ],
        default: 'getMany',
    },
];
exports.invoiceFields = [
    {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['invoice'],
                operation: [
                    'get',
                    'getPositions',
                    'bookAmount',
                    'cancel',
                    'createReminder',
                    'isPartiallyPaid',
                    'sendByEmail',
                    'markAsSent',
                    'renderPdf',
                    'downloadPdf',
                    'downloadXml',
                    'enshrine',
                    'resetToDraft',
                    'resetToOpen',
                ],
            },
        },
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: ['invoice'],
                operation: ['getMany'],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                resource: ['invoice'],
                operation: ['getMany'],
                returnAll: [false],
            },
        },
        routing: {
            send: {
                type: 'query',
                property: 'limit',
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
                resource: ['invoice'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                default: 100,
                options: [
                    { name: 'Draft', value: 100 },
                    { name: 'Open / Due', value: 200 },
                    { name: 'Paid', value: 1000 },
                ],
            },
            {
                displayName: 'Invoice Number',
                name: 'invoiceNumber',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Start Date',
                name: 'startDate',
                type: 'dateTime',
                default: '',
                description: 'Retrieve all invoices with a date equal or higher',
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'dateTime',
                default: '',
                description: 'Retrieve all invoices with a date equal or lower',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                default: '',
                description: 'ID of the contact to retrieve invoices for',
            },
        ],
    },
    {
        displayName: 'Invoice',
        name: 'invoice',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['invoice'],
                operation: ['createOrUpdate'],
            },
        },
        options: [
            { displayName: 'ID', name: 'id', type: 'string', default: '', description: 'Invoice ID, leave empty to create a new one' },
            { displayName: 'Contact ID', name: 'contactId', type: 'string', required: true, default: '', description: 'ID of the contact' },
            { displayName: 'Contact Person ID', name: 'contactPersonId', type: 'string', default: '', description: 'ID of the contact person (sevUser)' },
            { displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '' },
            { displayName: 'Invoice Date', name: 'invoiceDate', type: 'dateTime', default: '' },
            { displayName: 'Delivery Date', name: 'deliveryDate', type: 'dateTime', default: '' },
            { displayName: 'Status', name: 'status', type: 'options', default: 100, options: [{ name: 'Draft', value: 100 }, { name: 'Open', value: 200 }, { name: 'Paid', value: 1000 }] },
            { displayName: 'Header Text', name: 'header', type: 'string', default: '', typeOptions: { multiline: true } },
            { displayName: 'Footer Text', name: 'footText', type: 'string', default: '', typeOptions: { multiline: true } },
            { displayName: 'Tax Type', name: 'taxType', type: 'options', default: 'default', options: [{ name: 'Default', value: 'default' }, { name: 'EU', value: 'eu' }, { name: 'Non-EU', value: 'noteu' }, { name: 'Custom', value: 'custom' }, { name: 'SS', value: 'ss' }] },
            { displayName: 'Show Net', name: 'showNet', type: 'boolean', default: false },
            { displayName: 'Small Settlement', name: 'smallSettlement', type: 'boolean', default: false },
            { displayName: 'Currency', name: 'currency', type: 'string', default: 'EUR' },
            { displayName: 'Discount', name: 'discount', type: 'number', default: 0 },
            { displayName: 'Discount Time', name: 'discountTime', type: 'number', default: 0 },
            { displayName: 'Address', name: 'address', type: 'string', default: '' },
            { displayName: 'Invoice Type', name: 'invoiceType', type: 'options', default: 'RE', options: [{ name: 'Regular Invoice', value: 'RE' }, { name: 'Recurring Invoice', value: 'WKR' }, { name: 'Cancellation Invoice', value: 'SR' }, { name: 'Partial Invoice', value: 'TR' }, { name: 'Advance Invoice', value: 'AR' }, { name: 'Final Invoice', value: 'ER' }] },
        ],
    },
    {
        displayName: 'Invoice Positions',
        name: 'invoicePosSave',
        type: 'fixedCollection',
        placeholder: 'Add Position',
        default: {},
        displayOptions: { show: { resource: ['invoice'], operation: ['createOrUpdate'] } },
        typeOptions: { multipleValues: true },
        options: [
            { name: 'values', displayName: 'Position', type: 'collection', default: {}, options: [
                    { displayName: 'Part ID', name: 'partId', type: 'string', default: '' },
                    { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    { displayName: 'Text', name: 'text', type: 'string', default: '', typeOptions: { multiline: true } },
                    { displayName: 'Quantity', name: 'quantity', type: 'number', default: 1 },
                    { displayName: 'Price', name: 'price', type: 'number', default: 0 },
                    { displayName: 'Discount', name: 'discount', type: 'number', default: 0 },
                    { displayName: 'Tax Rate', name: 'taxRate', type: 'number', default: 19 },
                ] },
        ],
    },
    {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['invoice'], operation: ['bookAmount'] } },
    },
    {
        displayName: 'Date',
        name: 'date',
        type: 'dateTime',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['bookAmount'] } },
    },
    {
        displayName: 'Payment Type',
        name: 'paymentType',
        type: 'options',
        required: true,
        default: 'N',
        options: [
            { name: 'Normal', value: 'N' },
            { name: 'Credit', value: 'C' },
        ],
        displayOptions: { show: { resource: ['invoice'], operation: ['bookAmount'] } },
    },
    {
        displayName: 'Create Feed',
        name: 'createFeed',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['bookAmount'] } },
    },
    {
        displayName: 'Check Account ID',
        name: 'checkAccountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['bookAmount'] } },
    },
    {
        displayName: 'Cancellation Text',
        name: 'cancellationText',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['cancel'] } },
    },
    {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['createFromOrder'] } },
    },
    {
        displayName: 'Creation Type',
        name: 'creationType',
        type: 'options',
        default: 'percentage',
        options: [
            { name: 'Percentage', value: 'percentage' },
            { name: 'Amount', value: 'amount' },
        ],
        displayOptions: { show: { resource: ['invoice'], operation: ['createFromOrder'] } },
    },
    {
        displayName: 'Order Amount',
        name: 'orderAmount',
        type: 'number',
        default: null,
        displayOptions: { show: { resource: ['invoice'], operation: ['createFromOrder'] } },
    },
    {
        displayName: 'Partial Type',
        name: 'partialType',
        type: 'options',
        default: 'RE',
        options: [
            { name: 'Teilrechnung (TR)', value: 'TR' },
            { name: 'Abschlagsrechnung (AR)', value: 'AR' },
            { name: 'Schlussrechnung (ER)', value: 'ER' },
        ],
        displayOptions: { show: { resource: ['invoice'], operation: ['createFromOrder'] } },
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        typeOptions: { multiline: true },
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Copy',
        name: 'copy',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Additional Attachments',
        name: 'additionalAttachments',
        type: 'string',
        default: '',
        description: 'String of IDs of existing documents in your sevdesk account separated by comma',
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'BCC Email',
        name: 'bccEmail',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Send XML',
        name: 'sendXml',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['sendByEmail'] } },
    },
    {
        displayName: 'Force Reload',
        name: 'forceReload',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['renderPdf'] } },
    },
    {
        displayName: 'Download',
        name: 'download',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['downloadPdf'] } },
    },
    {
        displayName: 'Preventive',
        name: 'preventive',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['downloadPdf'] } },
    },
    {
        displayName: 'Send Type',
        name: 'sendType',
        type: 'options',
        required: true,
        default: 'VPR',
        options: [
            { name: 'VPR', value: 'VPR' },
            { name: 'Print', value: 'print' },
            { name: 'VP', value: 'VP' },
            { name: 'VMail', value: 'VMail' },
            { name: 'VMSC', value: 'VMSC' },
        ],
        displayOptions: { show: { resource: ['invoice'], operation: ['markAsSent'] } },
    },
    {
        displayName: 'Send Date',
        name: 'sendDate',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['invoice'], operation: ['markAsSent'] } },
    },
];
//# sourceMappingURL=InvoiceDescription.js.map