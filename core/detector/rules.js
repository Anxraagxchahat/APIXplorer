/**
 * Rule definitions for API classification.
 *
 * Rules are intentionally simple and extensible so new API families can be
 * added by appending a new rule object.
 */

import { KEYWORDS } from "./keywords.js";

export const RULES = [
  {
    type: "GraphQL API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.graphql.some((token) => combined.includes(token));
    },
  },
  {
    type: "Product API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.product.some((token) => combined.includes(token));
    },
  },
  {
    type: "Search API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.search.some((token) => combined.includes(token));
    },
  },
  {
    type: "Cart API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.cart.some((token) => combined.includes(token));
    },
  },
  {
    type: "Offer API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.offer.some((token) => combined.includes(token));
    },
  },
  {
    type: "Auth API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.auth.some((token) => combined.includes(token));
    },
  },
  {
    type: "User API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.user.some((token) => combined.includes(token));
    },
  },
  {
    type: "Order API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.order.some((token) => combined.includes(token));
    },
  },
  {
    type: "Payment API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.payment.some((token) => combined.includes(token));
    },
  },
  {
    type: "Inventory API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.inventory.some((token) => combined.includes(token));
    },
  },
  {
    type: "Review API",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.review.some((token) => combined.includes(token));
    },
  },
  {
    type: "Static Asset",
    match: (pathname, query) => {
      const combined = `${pathname} ${query}`.toLowerCase();
      return KEYWORDS.staticAsset.some((token) => combined.includes(token));
    },
  },
];
