module.exports = {
	root: true,
	env: {
		browser: false,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	rules: {
		// Add any custom rules here
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
	},
	overrides: [
		{
			files: ['./credentials/**/*.ts'],
			extends: ['plugin:n8n-nodes-base/credentials'],
		},
		{
			files: ['./nodes/**/*.ts'],
			extends: ['plugin:n8n-nodes-base/nodes'],
		},
		{
			files: ['package.json'],
			extends: ['plugin:n8n-nodes-base/community'],
		},
	],
	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
	],
};
