import { getScannerState, startScanner, stopScanner, subscribeToScannerEvents } from "./core/scanner.js";
import { handleRequestMetadata } from "./core/collector.js";

// APIXplorer background service worker.
// The service worker coordinates the scan lifecycle and forwards request
// metadata from the content script into the collector pipeline.
subscribeToScannerEvents((event) => {
  chrome.runtime.sendMessage({ type: "scanner-event", event: event.type, payload: event.payload }).catch(() => {
    // Ignore missing listeners when the popup is not open.
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "scan:start") {
    startScanner().then((state) => sendResponse(state));
    return true;
  }

  if (message?.type === "scan:stop") {
    stopScanner().then((state) => sendResponse(state));
    return true;
  }

  if (message?.type === "scan:getState") {
    getScannerState().then((state) => sendResponse(state));
    return true;
  }

  if (message?.type === "request:metadata") {
    void handleRequestMetadata(message.payload);
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

void getScannerState();
console.log("APIXplorer Background Started");
