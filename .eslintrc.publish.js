/**
 * Simplified ESLint configuration for publishing
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
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
	],
	rules: {
		// Basic rules for publishing
		'no-console': 'off', // Allow console for debugging
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
	},
	ignorePatterns: [
		'.eslintrc.js', 
		'.eslintrc.publish.js',
		'**/*.js', 
		'**/node_modules/**', 
		'**/dist/**',
		'**/tests/**',
		'**/test/**'
	],
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