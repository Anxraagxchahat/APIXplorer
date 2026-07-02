/**
 * API type detection helpers for APIXplorer.
 *
 * Phase 3 establishes the detection entry point and defaults to Unknown API
 * until real classification logic is implemented.
 */

import { parseUrl } from "./parser.js";

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

  const { pathname } = parseUrl(url);

  if (pathname.includes("/product")) {
    return API_TYPES.PRODUCT;
  }

  if (pathname.includes("/search")) {
    return API_TYPES.SEARCH;
  }

  if (pathname.includes("/cart")) {
    return API_TYPES.CART;
  }

  if (pathname.includes("/offer")) {
    return API_TYPES.OFFER;
  }

  return API_TYPES.UNKNOWN;
}

export { API_TYPES };
