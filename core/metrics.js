/**
 * APIXplorer
 * Request Metrics
 */

/**
 * Create metrics for a new API record.
 */
export function createMetrics(timestamp = Date.now()) {
  return {
    calls: 1,
    firstSeen: timestamp,
    lastSeen: timestamp,
  };
}

/**
 * Update metrics when the same endpoint
 * is detected again.
 */
export function updateMetrics(existingRecord, timestamp = Date.now()) {
  return {
    ...existingRecord,
    calls: (existingRecord.calls || 1) + 1,
    lastSeen: timestamp,
  };
}

/**
 * Convert milliseconds into a readable date.
 */
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}