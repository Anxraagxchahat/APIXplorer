export function createApiDetails(api) {
  const container = document.createElement("div");
  container.className = "api-details";

  container.innerHTML = `
    <h2>${api.apiType}</h2>

    <p><strong>Method:</strong> ${api.method}</p>

    <p><strong>URL:</strong> ${api.url}</p>

    <p><strong>Host:</strong> ${api.hostname}</p>

    <p><strong>Path:</strong> ${api.pathname}</p>

    <p><strong>Confidence:</strong> ${api.confidence ?? "--"}%</p>

    <p><strong>Calls:</strong> ${api.calls ?? 1}</p>
  `;

  return container;