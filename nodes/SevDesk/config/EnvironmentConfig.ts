/**
 * Centralized Environment Configuration Management
 *
 * This module provides a unified way to handle environment variables across
 * the entire n8n-nodes-sevdesk-v2 project. It ensures consistent default values,
 * proper validation, and type safety for all environment-based configuration.
 */

export interface EnvironmentConfig {
	// n8n Configuration
	n8n: {
		host: string;
		port: string;
		protocol: string;
		apiKey?: string;
		apiUrl: string;
	};

	// Node Environment
	nodeEnv: string;

	// Development & Debugging
	debug: {
		enabled: boolean;
		logLevel: string;
	};

	// Docker Configuration
	docker: {
		installLocalNode: boolean;
		nodePath: string;
	};
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: EnvironmentConfig = {
	n8n: {
		host: 'localhost',
		port: '5678',
		protocol: 'http',
		apiKey: undefined,
		apiUrl: 'http://localhost:5678/api/v1',
	},
	nodeEnv: 'development',
	debug: {
		enabled: true,
		logLevel: 'info',
	},
	docker: {
		installLocalNode: true,
		nodePath: '/sevdesk-node',
	},
};

/**
 * Required environment variables that must be set
 */
const REQUIRED_ENV_VARS: string[] = [
	// Add required variables here as needed
	// 'N8N_API_KEY', // Uncomment if API key should be required
];

/**
 * Environment variable validation errors
 */
export class EnvironmentValidationError extends Error {
	constructor(message: string, public missingVars: string[] = []) {
		super(message);
		this.name = 'EnvironmentValidationError';
	}
}

/**
 * Load and validate environment configuration
 *
 * @returns {EnvironmentConfig} Validated environment configuration
 * @throws {EnvironmentValidationError} If required environment variables are missing
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
	// Validate required environment variables
	const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
	if (missingVars.length > 0) {
		throw new EnvironmentValidationError(
			`Missing required environment variables: ${missingVars.join(', ')}`,
			missingVars
		);
	}

	// Build configuration with environment variables and defaults
	const config: EnvironmentConfig = {
		n8n: {
			host: process.env.N8N_HOST || DEFAULT_CONFIG.n8n.host,
			port: process.env.N8N_PORT || DEFAULT_CONFIG.n8n.port,
			protocol: process.env.N8N_PROTOCOL || DEFAULT_CONFIG.n8n.protocol,
			apiKey: process.env.N8N_API_KEY,
			apiUrl: process.env.N8N_API_URL ||
				`${process.env.N8N_PROTOCOL || DEFAULT_CONFIG.n8n.protocol}://${process.env.N8N_HOST || DEFAULT_CONFIG.n8n.host}:${process.env.N8N_PORT || DEFAULT_CONFIG.n8n.port}/api/v1`,
		},
		nodeEnv: process.env.NODE_ENV || DEFAULT_CONFIG.nodeEnv,
		debug: {
			enabled: process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true',
			logLevel: process.env.LOG_LEVEL || DEFAULT_CONFIG.debug.logLevel,
		},
		docker: {
			installLocalNode: process.env.INSTALL_LOCAL_SEVDESK_NODE !== 'false',
			nodePath: process.env.SEVDESK_NODE_PATH || DEFAULT_CONFIG.docker.nodePath,
		},
	};

	return config;
}

/**
 * Get current environment configuration
 * Cached for performance - call loadEnvironmentConfig() to reload
 */
let cachedConfig: EnvironmentConfig | null = null;

export function getEnvironmentConfig(): EnvironmentConfig {
	if (!cachedConfig) {
		cachedConfig = loadEnvironmentConfig();
	}
	return cachedConfig;
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetEnvironmentConfig(): void {
	cachedConfig = null;
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
	return getEnvironmentConfig().nodeEnv === 'development';
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
	return getEnvironmentConfig().nodeEnv === 'production';
}

/**
 * Check if running in staging environment
 */
export function isStaging(): boolean {
	return getEnvironmentConfig().nodeEnv === 'staging';
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
	return getEnvironmentConfig().nodeEnv === 'test';
}

/**
 * Get environment-specific configuration overrides
 */
export function getEnvironmentSpecificConfig(): Partial<EnvironmentConfig> {
	const nodeEnv = getEnvironmentConfig().nodeEnv;

	switch (nodeEnv) {
		case 'production':
			return {
				debug: {
					enabled: false,
					logLevel: 'error',
				},
				docker: {
					installLocalNode: false,
					nodePath: '/sevdesk-node',
				},
			};

		case 'staging':
			return {
				debug: {
					enabled: true,
					logLevel: 'warn',
				},
				docker: {
					installLocalNode: false,
					nodePath: '/sevdesk-node',
				},
			};

		case 'test':
			return {
				debug: {
					enabled: true,
					logLevel: 'info',
				},
				docker: {
					installLocalNode: true,
					nodePath: '/sevdesk-node-test',
				},
			};

		case 'development':
		default:
			return {
				debug: {
					enabled: true,
					logLevel: 'info',
				},
				docker: {
					installLocalNode: true,
					nodePath: '/sevdesk-node-dev',
				},
			};
	}
}

/**
 * Get deployment environment type
 */
export function getDeploymentEnvironment(): 'development' | 'test' | 'staging' | 'production' | 'unknown' {
	const nodeEnv = getEnvironmentConfig().nodeEnv.toLowerCase();

	if (['development', 'dev'].includes(nodeEnv)) return 'development';
	if (['test', 'testing'].includes(nodeEnv)) return 'test';
	if (['staging', 'stage'].includes(nodeEnv)) return 'staging';
	if (['production', 'prod'].includes(nodeEnv)) return 'production';

	return 'unknown';
}

/**
 * Check if debug logging is enabled
 */
export function isDebugEnabled(): boolean {
	return getEnvironmentConfig().debug.enabled;
}

/**
 * Get n8n API configuration
 */
export function getN8nConfig() {
	return getEnvironmentConfig().n8n;
}

/**
 * Validate environment configuration and log warnings for common issues
 */
export function validateAndWarnEnvironmentConfig(): void {
	try {
		const config = getEnvironmentConfig();

		// Warn about missing optional but recommended variables
		if (!config.n8n.apiKey) {
			console.warn('⚠️  N8N_API_KEY is not set. Some features may not work correctly.');
		}

		// Warn about development settings in production
		if (isProduction() && config.debug.enabled) {
			console.warn('⚠️  Debug logging is enabled in production environment.');
		}

		// Validate port number
		const port = parseInt(config.n8n.port, 10);
		if (isNaN(port) || port < 1 || port > 65535) {
			console.warn(`⚠️  Invalid N8N_PORT value: ${config.n8n.port}. Using default: ${DEFAULT_CONFIG.n8n.port}`);
		}

		// Validate protocol
		if (!['http', 'https'].includes(config.n8n.protocol)) {
			console.warn(`⚠️  Invalid N8N_PROTOCOL value: ${config.n8n.protocol}. Should be 'http' or 'https'.`);
		}

	} catch (error) {
		if (error instanceof EnvironmentValidationError) {
			console.error(`❌ Environment validation failed: ${error.message}`);
			throw error;
		}
		console.error('❌ Unexpected error during environment validation:', error);
		throw error;
	}
}
