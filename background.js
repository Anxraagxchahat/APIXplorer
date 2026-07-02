import { startScanner, stopScanner } from "./core/scanner.js";

// APIXplorer background service worker.
// The Phase 3 implementation wires in the scanner lifecycle hooks without
// introducing interception or network logic.
void startScanner();
void stopScanner();
console.log("APIXplorer Background Started");
