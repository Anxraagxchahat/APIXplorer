(() => {
  if (window.__APIXPLORER_INJECTED__) return;
  window.__APIXPLORER_INJECTED__ = true;

  function send(data) {
    window.postMessage(
      {
        source: "APIXplorer",
        payload: data,
      },
      "*"
    );
  }

  // ---- Fetch Hook ----
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      const request = args[0];
      const options = args[1] || {};

      const url =
        typeof request === "string"
          ? request
          : request instanceof Request
          ? request.url
          : String(request);

      send({
        type: "fetch",
        method: (options.method || "GET").toUpperCase(),
        url,
        timestamp: Date.now(),
      });
    } catch (e) {}

    return originalFetch.apply(window, args);
  };

  // ---- XHR Hook ----
  const open = XMLHttpRequest.prototype.open;
  const sendXHR = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__apixplorer = {
      method,
      url,
    };

    return open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("loadend", () => {
      if (!this.__apixplorer) return;

      send({
        type: "xhr",
        method: this.__apixplorer.method,
        url: this.__apixplorer.url,
        timestamp: Date.now(),
      });
    });

    return sendXHR.apply(this, arguments);
  };

  console.log("APIXplorer Injected");
})();