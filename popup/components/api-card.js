/**
 * Render a single saved API record as a rich card.
 */

export function createApiCard(api) {
  const card = document.createElement("article");
  card.className = "api-card";

  const method = api.method || "GET";
  const apiType = api.apiType || "Unknown API";

  const badgeClass = apiType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const confidence = api.confidence ?? "--";
  const calls = api.calls ?? 1;

  const firstSeen = api.firstSeen
    ? new Date(api.firstSeen).toLocaleTimeString()
    : "--";

  const lastSeen = api.lastSeen
    ? new Date(api.lastSeen).toLocaleTimeString()
    : "--";

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
        ${api.hostname || "Unknown Host"}
      </div>

      <div class="api-card__path">
        ${api.pathname || "/"}
      </div>

    </div>

    <div class="api-card__stats">

      <span>🎯 ${confidence}%</span>

      <span>📡 ${calls} calls</span>

    </div>

    <div class="api-card__time">

      <span>First: ${firstSeen}</span>

      <span>Last: ${lastSeen}</span>

    </div>

    <div class="api-card__actions">

      <button class="copy-url">
        Copy URL
      </button>

      <button class="copy-curl">
        Copy cURL
      </button>

    </div>
  `;

  card
    .querySelector(".copy-url")
    ?.addEventListener("click", () => {
      navigator.clipboard.writeText(api.url);
    });

  card
    .querySelector(".copy-curl")
    ?.addEventListener("click", () => {

      const curl =
`curl -X ${method} "${api.url}"`;

      navigator.clipboard.writeText(curl);
    });

  return card;
}