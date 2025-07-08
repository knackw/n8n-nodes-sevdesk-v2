/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	plugins: ['@typescript-eslint'],

	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
		'@typescript-eslint/recommended-requiring-type-checking',
	],

	rules: {
		// TypeScript specific rules for better code quality
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/no-misused-promises': 'error',

		// General code quality rules
		'prefer-const': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-template': 'error',
		'no-console': 'warn',
		'eqeqeq': ['error', 'always'],
		'curly': ['error', 'all'],

		// n8n specific best practices
		'no-throw-literal': 'error',
		'prefer-promise-reject-errors': 'error',
	},

	ignorePatterns: ['.eslintrc.js', '**/*.js', '**/node_modules/**', '**/dist/**'],

	overrides: [
		{
			files: ['package.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'off',
			},
		},
		{
			files: ['./credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/credentials'],
			rules: {
				'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
				'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
			},
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/nodes'],
			rules: {
				'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
				'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
				'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
			},
		},
	],
};
