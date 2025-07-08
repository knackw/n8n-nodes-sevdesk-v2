/**
 * Rate Limiter for SevDesk API calls
 *
 * This module provides rate limiting functionality to prevent exceeding
 * SevDesk API rate limits and implements exponential backoff for retries.
 */

export interface RateLimiterConfig {
	/** Maximum requests per time window */
	maxRequests: number;
	/** Time window in milliseconds */
	windowMs: number;
	/** Minimum delay between requests in milliseconds */
	minDelay: number;
	/** Maximum retry attempts */
	maxRetries: number;
	/** Base delay for exponential backoff in milliseconds */
	baseRetryDelay: number;
}

export interface RequestInfo {
	timestamp: number;
	retryCount: number;
}

/**
 * Rate limiter implementation with exponential backoff
 */
export class RateLimiter {
	private requests: RequestInfo[] = [];
	private lastRequestTime = 0;
	private config: RateLimiterConfig;

	constructor(config: Partial<RateLimiterConfig> = {}) {
		this.config = {
			maxRequests: 100, // SevDesk default limit
			windowMs: 60 * 1000, // 1 minute window
			minDelay: 100, // 100ms minimum delay
			maxRetries: 3,
			baseRetryDelay: 1000, // 1 second base delay
			...config,
		};
	}

	/**
	 * Wait for rate limit compliance before making a request
	 */
	async waitForSlot(): Promise<void> {
		const now = Date.now();

		// Clean old requests outside the time window
		this.cleanOldRequests(now);

		// Check if we need to wait due to minimum delay
		const timeSinceLastRequest = now - this.lastRequestTime;
		if (timeSinceLastRequest < this.config.minDelay) {
			const delayNeeded = this.config.minDelay - timeSinceLastRequest;
			await this.delay(delayNeeded);
		}

		// Check if we're at the rate limit
		if (this.requests.length >= this.config.maxRequests) {
			// Wait until the oldest request expires
			const oldestRequest = this.requests[0];
			const waitTime = (oldestRequest.timestamp + this.config.windowMs) - Date.now();
			if (waitTime > 0) {
				await this.delay(waitTime);
				// Clean again after waiting
				this.cleanOldRequests(Date.now());
			}
		}

		// Record this request
		this.requests.push({
			timestamp: Date.now(),
			retryCount: 0,
		});
		this.lastRequestTime = Date.now();
	}

	/**
	 * Calculate delay for retry with exponential backoff
	 */
	calculateRetryDelay(retryCount: number, retryAfter?: number): number {
		// If server provides retry-after header, use it
		if (retryAfter) {
			return retryAfter * 1000; // Convert seconds to milliseconds
		}

		// Exponential backoff: baseDelay * (2 ^ retryCount) + jitter
		const exponentialDelay = this.config.baseRetryDelay * Math.pow(2, retryCount);
		const jitter = Math.random() * 1000; // Add up to 1 second of jitter
		return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
	}

	/**
	 * Check if we should retry based on retry count
	 */
	shouldRetry(retryCount: number): boolean {
		return retryCount < this.config.maxRetries;
	}

	/**
	 * Get current rate limit status
	 */
	getStatus(): {
		requestsInWindow: number;
		maxRequests: number;
		windowMs: number;
		nextAvailableSlot: number;
	} {
		const now = Date.now();
		this.cleanOldRequests(now);

		let nextAvailableSlot = now;

		// Check minimum delay constraint
		const timeSinceLastRequest = now - this.lastRequestTime;
		if (timeSinceLastRequest < this.config.minDelay) {
			nextAvailableSlot = Math.max(nextAvailableSlot, this.lastRequestTime + this.config.minDelay);
		}

		// Check rate limit constraint
		if (this.requests.length >= this.config.maxRequests) {
			const oldestRequest = this.requests[0];
			nextAvailableSlot = Math.max(nextAvailableSlot, oldestRequest.timestamp + this.config.windowMs);
		}

		return {
			requestsInWindow: this.requests.length,
			maxRequests: this.config.maxRequests,
			windowMs: this.config.windowMs,
			nextAvailableSlot,
		};
	}

	/**
	 * Reset rate limiter state (useful for testing)
	 */
	reset(): void {
		this.requests = [];
		this.lastRequestTime = 0;
	}

	/**
	 * Update rate limiter configuration
	 */
	updateConfig(newConfig: Partial<RateLimiterConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * Remove requests older than the time window
	 */
	private cleanOldRequests(now: number): void {
		const cutoff = now - this.config.windowMs;
		this.requests = this.requests.filter(req => req.timestamp > cutoff);
	}

	/**
	 * Promise-based delay utility
	 */
	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

/**
 * Global rate limiter instance for SevDesk API
 */
export const sevDeskRateLimiter = new RateLimiter({
	maxRequests: 100, // Conservative limit for SevDesk API
	windowMs: 60 * 1000, // 1 minute window
	minDelay: 100, // 100ms between requests
	maxRetries: 3,
	baseRetryDelay: 1000,
});

/**
 * Decorator function to add rate limiting to HTTP request methods
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	rateLimiter: RateLimiter = sevDeskRateLimiter
): T {
	return (async (...args: any[]) => {
		await rateLimiter.waitForSlot();
		return fn(...args);
	}) as T;
}
