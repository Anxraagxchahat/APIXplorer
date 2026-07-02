/**
 * APIXplorer
 * Request Intelligence Engine
 *
 * Analyzes captured requests and enriches them
 * with developer-friendly metadata.
 */

import { detectApiType } from "./detector.js";

function guessEndpointName(pathname = "") {
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.trim());

  if (parts.length === 0) {
    return "Root Endpoint";
  }

  return parts[parts.length - 1]
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function calculateConfidence(apiType, pathname = "") {
  if (apiType === "Unknown API") {
    return 20;
  }

  let score = 60;

  if (pathname.includes("/api")) score += 10;
  if (pathname.includes("/v1")) score += 10;
  if (pathname.includes("/v2")) score += 10;
  if (pathname.includes("/graphql")) score = 100;

  return Math.min(score, 100);
}

export function analyzeRequest(record) {
  const apiType = detectApiType(record.url);

  return {
    ...record,
    endpointName: guessEndpointName(record.pathname),
    apiType,
    confidence: calculateConfidence(apiType, record.pathname),
  };
}