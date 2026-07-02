/**
 * Request metadata collector for APIXplorer.
 *
 * The collector accepts browser-visible request metadata from the content
 * script, normalizes it into internal API records, and saves only unique
 * records while emitting lifecycle events for the popup and background layer.
 */

import { detectApiType } from "./detector.js";
import { parseUrl } from "./parser.js";
import { saveApi, getApis } from "./storage.js";
import { emitScannerEvent, incrementDetectedCount, isScannerRunning } from "./scanner.js";

function normalizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const search = parsedUrl.searchParams.toString();
    return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${search ? `?${search}` : ""}`;
  } catch {
    return url;
  }
}

function buildRecord(metadata) {
  const parsedUrl = parseUrl(metadata.url);
  const normalizedUrl = normalizeUrl(metadata.url);
  const method = (metadata.method || "GET").toUpperCase();

  return {
    id: `${method}:${normalizedUrl}`,
    method,
    url: metadata.url,
    normalizedUrl,
    hostname: parsedUrl.hostname,
    pathname: parsedUrl.pathname,
    queryParams: parsedUrl.queryParams,
    apiType: detectApiType(metadata.url),
    source: metadata.type || "unknown",
    timestamp: metadata.timestamp || Date.now(),
  };
}

export async function handleRequestMetadata(metadata) {
  if (!metadata?.url || !isScannerRunning()) {
    return null;
  }

  const record = buildRecord(metadata);
  const existingApis = await getApis();
  const duplicate = existingApis.some((api) => api.method === record.method && api.normalizedUrl === record.normalizedUrl);

  emitScannerEvent("api_detected", record);

  if (duplicate) {
    return null;
  }

  const savedRecord = await saveApi(record);
  await incrementDetectedCount();
  emitScannerEvent("api_saved", savedRecord);
  return savedRecord;
}
