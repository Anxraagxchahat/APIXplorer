/**
 * API type detection helpers for APIXplorer.
 *
 * Detection logic is intentionally deferred for now, so the extension uses a
 * safe default while the live scan engine is being built.
 */

const API_TYPES = {
  PRODUCT: "Product API",
  SEARCH: "Search API",
  CART: "Cart API",
  OFFER: "Offer API",
  UNKNOWN: "Unknown API",
};

/**
 * Classify a URL into a high-level API category.
 * @param {string} url - The URL to examine.
 * @returns {string} The detected API type.
 */
export function detectApiType(url) {
  if (!url) {
    return API_TYPES.UNKNOWN;
  }

  return API_TYPES.UNKNOWN;
}

export { API_TYPES };
