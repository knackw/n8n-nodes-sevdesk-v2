import {
    ResourceValidator,
    GermanBusinessValidator,
    IResourceValidationSchema
} from '../nodes/SevDesk/validation/ResourceValidator';

describe('GermanBusinessValidator', () => {
    describe('validateVATNumber', () => {
        it('should validate correct German VAT numbers', () => {
            expect(GermanBusinessValidator.validateVATNumber('DE123456789')).toBe(true);
            expect(GermanBusinessValidator.validateVATNumber('DE987654321')).toBe(true);
        });

        it('should reject invalid German VAT numbers', () => {
            expect(GermanBusinessValidator.validateVATNumber('DE12345678')).toBe(false); // too short
            expect(GermanBusinessValidator.validateVATNumber('DE1234567890')).toBe(false); // too long
            expect(GermanBusinessValidator.validateVATNumber('AT123456789')).toBe(false); // wrong country
            expect(GermanBusinessValidator.validateVATNumber('123456789')).toBe(false); // no country code
            expect(GermanBusinessValidator.validateVATNumber('DE12345678A')).toBe(false); // contains letter
            expect(GermanBusinessValidator.validateVATNumber('')).toBe(false); // empty
        });
    });

    describe('validatePostalCode', () => {
        it('should validate correct German postal codes', () => {
            expect(GermanBusinessValidator.validatePostalCode('12345')).toBe(true);
            expect(GermanBusinessValidator.validatePostalCode('00000')).toBe(true);
            expect(GermanBusinessValidator.validatePostalCode('99999')).toBe(true);
        });

        it('should reject invalid German postal codes', () => {
            expect(GermanBusinessValidator.validatePostalCode('1234')).toBe(false); // too short
            expect(GermanBusinessValidator.validatePostalCode('123456')).toBe(false); // too long
            expect(GermanBusinessValidator.validatePostalCode('1234A')).toBe(false); // contains letter
            expect(GermanBusinessValidator.validatePostalCode('')).toBe(false); // empty
            expect(GermanBusinessValidator.validatePostalCode('ABCDE')).toBe(false); // all letters
        });
    });

    describe('validatePhoneNumber', () => {
        it('should validate correct German phone numbers', () => {
            expect(GermanBusinessValidator.validatePhoneNumber('+4912345678901')).toBe(true);
            expect(GermanBusinessValidator.validatePhoneNumber('012345678901')).toBe(true);
            expect(GermanBusinessValidator.validatePhoneNumber('+49 123 456 789')).toBe(true);
            expect(GermanBusinessValidator.validatePhoneNumber('0123-456-789')).toBe(true);
            expect(GermanBusinessValidator.validatePhoneNumber('0123 (456) 789')).toBe(true);
        });

        it('should reject invalid German phone numbers', () => {
            expect(GermanBusinessValidator.validatePhoneNumber('+4901234567890123456')).toBe(false); // too long
            expect(GermanBusinessValidator.validatePhoneNumber('+490')).toBe(false); // too short
            expect(GermanBusinessValidator.validatePhoneNumber('+4901234567890')).toBe(false); // starts with 0 after country code
            expect(GermanBusinessValidator.validatePhoneNumber('')).toBe(false); // empty
            expect(GermanBusinessValidator.validatePhoneNumber('123456789')).toBe(false); // no country code or leading 0
        });
    });

    describe('validateIBAN', () => {
        it('should validate correct German IBAN format', () => {
            expect(GermanBusinessValidator.validateIBAN('DE12345678901234567890')).toBe(true);
            expect(GermanBusinessValidator.validateIBAN('DE 12 3456 7890 1234 5678 90')).toBe(true);
        });

        it('should reject invalid German IBAN format', () => {
            expect(GermanBusinessValidator.validateIBAN('DE1234567890123456789')).toBe(false); // too short
            expect(GermanBusinessValidator.validateIBAN('DE123456789012345678901')).toBe(false); // too long
            expect(GermanBusinessValidator.validateIBAN('AT12345678901234567890')).toBe(false); // wrong country
            expect(GermanBusinessValidator.validateIBAN('DE1234567890123456789A')).toBe(false); // contains letter
            expect(GermanBusinessValidator.validateIBAN('')).toBe(false); // empty
        });
    });

    describe('validateTaxNumber', () => {
        it('should validate correct German tax number format', () => {
            expect(GermanBusinessValidator.validateTaxNumber('12/345/67890')).toBe(true);
            expect(GermanBusinessValidator.validateTaxNumber('123/456/78901')).toBe(true);
        });

        it('should reject invalid German tax number format', () => {
            expect(GermanBusinessValidator.validateTaxNumber('1/345/67890')).toBe(false); // first part too short
            expect(GermanBusinessValidator.validateTaxNumber('12/34/67890')).toBe(false); // second part too short
            expect(GermanBusinessValidator.validateTaxNumber('12/345/6789')).toBe(false); // third part too short
            expect(GermanBusinessValidator.validateTaxNumber('12-345-67890')).toBe(false); // wrong separator
            expect(GermanBusinessValidator.validateTaxNumber('')).toBe(false); // empty
        });
    });
});

describe('ResourceValidator', () => {
    beforeEach(() => {
        ResourceValidator.clearSchemas();
    });

    describe('registerSchema and getSchema', () => {
        it('should register and retrieve validation schemas', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [
                    { field: 'name', type: 'required' },
                    { field: 'email', type: 'email' }
                ]
            };

            ResourceValidator.registerSchema(schema);
            const retrievedSchema = ResourceValidator.getSchema('Contact', 'create');

            expect(retrievedSchema).toEqual(schema);
        });

        it('should return null for non-existent schema', () => {
            const schema = ResourceValidator.getSchema('NonExistent', 'create');
            expect(schema).toBeNull();
        });

        it('should replace existing schema for same resource and operation', () => {
            const schema1: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'name', type: 'required' }]
            };

            const schema2: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'email', type: 'required' }]
            };

            ResourceValidator.registerSchema(schema1);
            ResourceValidator.registerSchema(schema2);

            const retrievedSchema = ResourceValidator.getSchema('Contact', 'create');
            expect(retrievedSchema).toEqual(schema2);
        });
    });

    describe('validate', () => {
        it('should return valid result when no schema exists', () => {
            const result = ResourceValidator.validate({ name: 'Test' }, 'Contact', 'create');
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('should validate required fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [
                    { field: 'name', type: 'required' },
                    { field: 'email', type: 'required' }
                ]
            };

            ResourceValidator.registerSchema(schema);

            // Valid data
            const validResult = ResourceValidator.validate(
                { name: 'John Doe', email: 'john@example.com' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);
            expect(validResult.errors).toEqual([]);

            // Missing required field
            const invalidResult = ResourceValidator.validate(
                { name: 'John Doe' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toHaveLength(1);
            expect(invalidResult.errors[0].field).toBe('email');
            expect(invalidResult.errors[0].message).toContain('required');
        });

        it('should validate string fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'name', type: 'string' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid string
            const validResult = ResourceValidator.validate(
                { name: 'John Doe' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid type
            const invalidResult = ResourceValidator.validate(
                { name: 123 },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('must be a string');
        });

        it('should validate number fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'age', type: 'number' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid number
            const validResult = ResourceValidator.validate(
                { age: 25 },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid type
            const invalidResult = ResourceValidator.validate(
                { age: 'twenty-five' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('must be a number');
        });

        it('should validate email fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'email', type: 'email' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid email
            const validResult = ResourceValidator.validate(
                { email: 'john@example.com' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid email
            const invalidResult = ResourceValidator.validate(
                { email: 'invalid-email' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('valid email address');
        });

        it('should validate date fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'birthDate', type: 'date' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid date
            const validResult = ResourceValidator.validate(
                { birthDate: '2023-01-01' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid date
            const invalidResult = ResourceValidator.validate(
                { birthDate: 'invalid-date' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('valid date');
        });

        it('should validate boolean fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'active', type: 'boolean' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid boolean
            const validResult = ResourceValidator.validate(
                { active: true },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid type
            const invalidResult = ResourceValidator.validate(
                { active: 'yes' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('must be a boolean');
        });

        it('should validate array fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'tags', type: 'array' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid array
            const validResult = ResourceValidator.validate(
                { tags: ['tag1', 'tag2'] },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid type
            const invalidResult = ResourceValidator.validate(
                { tags: 'tag1,tag2' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('must be an array');
        });

        it('should validate object fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'address', type: 'object' }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid object
            const validResult = ResourceValidator.validate(
                { address: { street: 'Main St', city: 'Berlin' } },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid type (array)
            const invalidResult1 = ResourceValidator.validate(
                { address: ['street', 'city'] },
                'Contact',
                'create'
            );
            expect(invalidResult1.isValid).toBe(false);
            expect(invalidResult1.errors[0].message).toContain('must be an object');

            // Invalid type (string)
            const invalidResult2 = ResourceValidator.validate(
                { address: 'Main St, Berlin' },
                'Contact',
                'create'
            );
            expect(invalidResult2.isValid).toBe(false);
            expect(invalidResult2.errors[0].message).toContain('must be an object');
        });

        it('should validate custom fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{
                    field: 'customField',
                    type: 'custom',
                    validator: (value: any) => value === 'expected',
                    message: 'Custom validation failed'
                }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid custom validation
            const validResult = ResourceValidator.validate(
                { customField: 'expected' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid custom validation
            const invalidResult = ResourceValidator.validate(
                { customField: 'unexpected' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toBe('Custom validation failed');
        });

        it('should validate allowedValues fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{
                    field: 'status',
                    type: 'allowedValues',
                    allowedValues: ['active', 'inactive', 'pending']
                }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid value
            const validResult = ResourceValidator.validate(
                { status: 'active' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid value
            const invalidResult = ResourceValidator.validate(
                { status: 'unknown' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('must be one of: active, inactive, pending');
        });

        it('should validate string length constraints', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{
                    field: 'name',
                    type: 'string',
                    minLength: 2,
                    maxLength: 10
                }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid length
            const validResult = ResourceValidator.validate(
                { name: 'John' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Too short
            const shortResult = ResourceValidator.validate(
                { name: 'J' },
                'Contact',
                'create'
            );
            expect(shortResult.isValid).toBe(false);
            expect(shortResult.errors[0].message).toContain('at least 2 characters');

            // Too long
            const longResult = ResourceValidator.validate(
                { name: 'VeryLongName' },
                'Contact',
                'create'
            );
            expect(longResult.isValid).toBe(false);
            expect(longResult.errors[0].message).toContain('at most 10 characters');
        });

        it('should validate number range constraints', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{
                    field: 'age',
                    type: 'number',
                    min: 18,
                    max: 65
                }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid range
            const validResult = ResourceValidator.validate(
                { age: 25 },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Too low
            const lowResult = ResourceValidator.validate(
                { age: 16 },
                'Contact',
                'create'
            );
            expect(lowResult.isValid).toBe(false);
            expect(lowResult.errors[0].message).toContain('at least 18');

            // Too high
            const highResult = ResourceValidator.validate(
                { age: 70 },
                'Contact',
                'create'
            );
            expect(highResult.isValid).toBe(false);
            expect(highResult.errors[0].message).toContain('at most 65');
        });

        it('should validate pattern constraints', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{
                    field: 'code',
                    type: 'string',
                    pattern: /^[A-Z]{3}\d{3}$/
                }]
            };

            ResourceValidator.registerSchema(schema);

            // Valid pattern
            const validResult = ResourceValidator.validate(
                { code: 'ABC123' },
                'Contact',
                'create'
            );
            expect(validResult.isValid).toBe(true);

            // Invalid pattern
            const invalidResult = ResourceValidator.validate(
                { code: 'abc123' },
                'Contact',
                'create'
            );
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors[0].message).toContain('does not match the required pattern');
        });

        it('should skip validation for empty optional fields', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [
                    { field: 'name', type: 'required' },
                    { field: 'email', type: 'email' } // optional
                ]
            };

            ResourceValidator.registerSchema(schema);

            // Empty optional field should be valid
            const result = ResourceValidator.validate(
                { name: 'John Doe', email: '' },
                'Contact',
                'create'
            );
            expect(result.isValid).toBe(true);
        });
    });

    describe('getAllSchemas', () => {
        it('should return all registered schemas', () => {
            const schema1: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'name', type: 'required' }]
            };

            const schema2: IResourceValidationSchema = {
                resource: 'Invoice',
                operation: 'create',
                rules: [{ field: 'amount', type: 'number' }]
            };

            ResourceValidator.registerSchema(schema1);
            ResourceValidator.registerSchema(schema2);

            const allSchemas = ResourceValidator.getAllSchemas();
            expect(allSchemas.size).toBe(2);
            expect(allSchemas.has('Contact')).toBe(true);
            expect(allSchemas.has('Invoice')).toBe(true);
        });
    });

    describe('clearSchemas', () => {
        it('should clear all registered schemas', () => {
            const schema: IResourceValidationSchema = {
                resource: 'Contact',
                operation: 'create',
                rules: [{ field: 'name', type: 'required' }]
            };

            ResourceValidator.registerSchema(schema);
            expect(ResourceValidator.getAllSchemas().size).toBe(1);

            ResourceValidator.clearSchemas();
            expect(ResourceValidator.getAllSchemas().size).toBe(0);
        });
    });
});
