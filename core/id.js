/**
 * APIXplorer
 * Request ID Generator
 */

let counter = 0;

/**
 * Generate a unique request id.
 *
 * Example:
 * req_000001
 * req_000002
 */
export function generateRequestId() {
  counter += 1;

  return `req_${String(counter).padStart(6, "0")}`;
}

/**
 * Reset counter.
 * Useful during testing.
 */
export function resetRequestCounter() {
  counter = 0;
}