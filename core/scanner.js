/**
 * Scanner lifecycle helpers for APIXplorer.
 *
 * This module coordinates the live scan state and emits lifecycle events that
 * the popup and background worker can consume without processing sensitive
 * request contents.
 */

const STORAGE_KEY = "apixplorer.scanState";

let scannerState = {
  isScanning: false,
  detectedCount: 0,
  sessionId: null,
};

const listeners = new Set();

async function hydrateState() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (result[STORAGE_KEY]) {
    scannerState = {
      ...scannerState,
      ...result[STORAGE_KEY],
    };
  }
  return scannerState;
}

async function persistState() {
  await chrome.storage.local.set({ [STORAGE_KEY]: scannerState });
}

export function emitScannerEvent(type, payload = {}) {
  for (const listener of listeners) {
    try {
      listener({ type, payload });
    } catch (error) {
      console.warn("APIXplorer listener failed.", error);
    }
  }

  chrome.runtime.sendMessage({ type: "scanner-event", event: type, payload }).catch(() => {
    // Ignore missing listeners when no popup is open.
  });
}

export function subscribeToScannerEvents(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getScannerState() {
  return hydrateState();
}

export async function startScanner() {
  await hydrateState();
  scannerState = {
    ...scannerState,
    isScanning: true,
    detectedCount: 0,
    sessionId: `session-${Date.now()}`,
  };
  await persistState();
  emitScannerEvent("scan_started", scannerState);
  return scannerState;
}

export async function stopScanner() {
  await hydrateState();
  scannerState = {
    ...scannerState,
    isScanning: false,
    sessionId: null,
  };
  await persistState();
  emitScannerEvent("scan_stopped", scannerState);
  return scannerState;
}

export async function incrementDetectedCount() {
  await hydrateState();
  scannerState = {
    ...scannerState,
    detectedCount: scannerState.detectedCount + 1,
  };
  await persistState();
  return scannerState.detectedCount;
}

export function isScannerRunning() {
  return scannerState.isScanning;
}
