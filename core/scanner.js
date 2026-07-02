/**
 * Scanner lifecycle helpers for APIXplorer.
 *
 * This module provides the lightweight architecture hooks for starting and
 * stopping capture sessions. No interception or network activity is performed
 * here yet.
 */

let isScanning = false;

/**
 * Start a capture session.
 * @returns {{ isScanning: boolean }} The updated scanner state.
 */
export function startScanner() {
  isScanning = true;
  return { isScanning };
}

/**
 * Stop the current capture session.
 * @returns {{ isScanning: boolean }} The updated scanner state.
 */
export function stopScanner() {
  isScanning = false;
  return { isScanning };
}
