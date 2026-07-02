/**
 * Pure, rule-based API classification engine.
 *
 * The detector accepts a URL and returns a normalized API type using the
 * registered rules. It remains independent of UI and scan lifecycle concerns.
 */

import { parseUrl } from "../parser.js";
import { RULES } from "./rules.js";

export const API_TYPES = {
  PRODUCT: "Product API",
  SEARCH: "Search API",
  CART: "Cart API",
  OFFER: "Offer API",
  AUTH: "Auth API",
  USER: "User API",
  ORDER: "Order API",
  PAYMENT: "Payment API",
  INVENTORY: "Inventory API",
  REVIEW: "Review API",
  GRAPHQL: "GraphQL API",
  STATIC_ASSET: "Static Asset",
  UNKNOWN: "Unknown API",
};

/**
 * Classify a URL by applying the rule set against pathname and query params.
 * @param {string} url - The URL to classify.
 * @returns {string} The detected API type.
 */
export function detectApiType(url) {
  if (!url) {
    return API_TYPES.UNKNOWN;
  }

  const parsedUrl = parseUrl(url);
  const pathname = parsedUrl.pathname || "";
  const query = new URLSearchParams(parsedUrl.queryParams).toString();

  for (const rule of RULES) {
    if (rule.match(pathname, query)) {
      return rule.type;
    }
  }

  return API_TYPES.UNKNOWN;
}
