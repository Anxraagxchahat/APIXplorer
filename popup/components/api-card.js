/**
 * Render a single saved API record as a rich card.
 */

export function createApiCard(api, onSelect) {
  const card = document.createElement("article");

  card.className = "api-card";

  const method = api.method || "GET";
  const apiType = api.apiType || "Unknown API";

  const badgeClass = apiType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const confidence = api.confidence ?? "--";
  const calls = api.calls ?? 1;

  card.innerHTML = `
    <div class="api-card__header">

      <span class="api-card__method">
        ${method}
      </span>

      <span class="api-card__type badge ${badgeClass}">
        ${apiType}
      </span>

    </div>

    <div class="api-card__body">

      <div class="api-card__host">
        ${api.hostname}
      </div>

      <div class="api-card__path">
        ${api.pathname}
      </div>

    </div>

    <div class="api-card__stats">

      <span>🎯 ${confidence}%</span>

      <span>📡 ${calls}</span>

    </div>
  `;

  card.addEventListener("click", () => {
    if (typeof onSelect === "function") {
      onSelect(api);
    }
  });

  return card;
}