// Content script initialized for APIXplorer.
// The collector patches request metadata in a privacy-preserving way by only
// forwarding method, URL, and request type to the background worker.

function reportRequestMetadata(metadata) {
  chrome.runtime.sendMessage({ type: "request:metadata", payload: metadata }).catch(() => {
    // Ignore failures when the background worker is unavailable.
  });
}

function patchFetch() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input?.url;

    if (typeof url === "string") {
      reportRequestMetadata({
        method: (init?.method || "GET").toUpperCase(),
        url,
        type: "fetch",
        timestamp: Date.now(),
      });
    }

    return originalFetch(input, init);
  };
}

function patchXmlHttpRequest() {
  const originalOpen = window.XMLHttpRequest.prototype.open;
  const originalSend = window.XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function open(method, url) {
    this.__apixplorerMethod = method?.toUpperCase() || "GET";
    this.__apixplorerUrl = typeof url === "string" ? url : String(url);
    return originalOpen.apply(this, arguments);
  };

  window.XMLHttpRequest.prototype.send = function send(body) {
    this.addEventListener("loadend", () => {
      if (this.__apixplorerUrl) {
        reportRequestMetadata({
          method: this.__apixplorerMethod || "GET",
          url: this.__apixplorerUrl,
          type: "xhr",
          timestamp: Date.now(),
        });
      }
    });

    return originalSend.apply(this, arguments);
  };
}

patchFetch();
patchXmlHttpRequest();
console.log("APIXplorer Loaded");
