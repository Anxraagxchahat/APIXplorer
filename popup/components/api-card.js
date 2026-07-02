/**
 * Render a single saved API record as a card.
 */

export function createApiCard(api) {
  const card = document.createElement("article");
  card.className = "api-card";

  const method = api.method || "GET";
  const timestamp = api.savedAt ? new Date(api.savedAt).toLocaleString() : "Unknown";

  card.innerHTML = `
    <div class="api-card__header">
      <span class="api-card__method">${method}</span>
      <span class="api-card__type">${api.apiType || "Unknown API"}</span>
    </div>
    <div class="api-card__body">
      <p class="api-card__host">${api.hostname || "Unknown host"}</p>
      <p class="api-card__path">${api.pathname || "/"}</p>
    </div>
    <div class="api-card__meta">
      <span>${timestamp}</span>
    </div>
  `;

  return card;
}
