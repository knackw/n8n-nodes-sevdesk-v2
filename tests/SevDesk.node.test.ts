import { SevDesk } from '../nodes/SevDesk/SevDesk.node';

describe('SevDesk Node', () => {
	const sevDeskNode = new SevDesk();

	describe('Node Definition', () => {
		it('should have correct node properties', () => {
			expect(sevDeskNode.description.displayName).toBe('sevDesk');
			expect(sevDeskNode.description.name).toBe('sevDesk');
			expect(sevDeskNode.description.group).toEqual(['output']);
			expect(sevDeskNode.description.version).toBe(1);
		});

		it('should have credentials requirement', () => {
			expect(sevDeskNode.description.credentials).toEqual([
				{
					name: 'sevDeskApi',
					required: true,
				},
			]);
		});

		it('should have proper request defaults', () => {
			expect(sevDeskNode.description.requestDefaults).toEqual({
				baseURL: 'https://my.sevdesk.de/api/{{$credentials.apiVersion}}/',
				url: '',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
		});

		it('should have resource property', () => {
			const resourceProperty = sevDeskNode.description.properties.find(prop => prop.name === 'resource');
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
			expect(resourceProperty?.default).toBe('contact');
		});

		it('should have all expected resources', () => {
			const resourceProperty = sevDeskNode.description.properties.find(prop => prop.name === 'resource');
			const expectedResources = [
				'accountingContact',
				'basics',
				'category',
				'checkAccount',
				'checkAccountTransaction',
				'communicationWay',
				'contact',
				'contactAddress',
				'contactCustomField',
				'contactCustomFieldSetting',
				'contactField',
				'country',
				'creditNote',
				'creditNotePos',
				'export',
				'invoice',
				'layout',
				'order',
				'orderPos',
				'orderPo',
				'part',
				'report',
				'tag',
				'tagRelation',
				'unit',
				'voucher',
				'voucherPo',
			];

			const actualResources = resourceProperty?.options?.map((option: any) => option.value);
			expect(actualResources).toEqual(expect.arrayContaining(expectedResources));
		});
	});

	describe('Properties Structure', () => {
		it('should have valid properties array', () => {
			expect(Array.isArray(sevDeskNode.description.properties)).toBe(true);
			expect(sevDeskNode.description.properties.length).toBeGreaterThan(0);
		});

		it('should have valid inputs and outputs', () => {
			expect(sevDeskNode.description.inputs).toEqual(['main']);
			expect(sevDeskNode.description.outputs).toEqual(['main']);
		});

		it('should have correct icon reference', () => {
			expect(sevDeskNode.description.icon).toBe('file:sevDesk.svg');
		});

		it('should have proper subtitle template', () => {
			expect(sevDeskNode.description.subtitle).toBe('={{$parameter["operation"] + ": " + $parameter["resource"]}}');
		});
	});
});
