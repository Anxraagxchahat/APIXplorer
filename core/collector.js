/**
 * APIXplorer
 * Request Collector
 *
 * Builds normalized request records,
 * enriches them with intelligence,
 * tracks metrics,
 * prevents duplicate records.
 */

import { parseUrl } from "./parser.js";
import { saveApi, getApis } from "./storage.js";
import {
  emitScannerEvent,
  incrementDetectedCount,
  isScannerRunning,
} from "./scanner.js";

import { generateRequestId } from "./id.js";
import { createMetrics, updateMetrics } from "./metrics.js";
import { analyzeRequest } from "./request-analyzer.js";

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);

    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function buildRecord(metadata) {
  const parsed = parseUrl(metadata.url);

  const record = {
    id: generateRequestId(),

    method: (metadata.method || "GET").toUpperCase(),

    url: metadata.url,

    normalizedUrl: normalizeUrl(metadata.url),

    hostname: parsed.hostname,

    pathname: parsed.pathname,

    queryParams: parsed.queryParams,

    source: metadata.type || "unknown",

    ...createMetrics(metadata.timestamp),
  };

  return analyzeRequest(record);
}

export async function handleRequestMetadata(metadata) {
  if (!metadata?.url) return null;

  if (!isScannerRunning()) return null;

  const record = buildRecord(metadata);

  const existing = await getApis();

  const duplicate = existing.find(
    (api) =>
      api.method === record.method &&
      api.normalizedUrl === record.normalizedUrl
  );

  emitScannerEvent("api_detected", record);

  if (duplicate) {
    Object.assign(
      duplicate,
      updateMetrics(duplicate, metadata.timestamp)
    );

    await saveApi(duplicate);

    emitScannerEvent("api_updated", duplicate);

    return duplicate;
  }

  await saveApi(record);

  await incrementDetectedCount();

  emitScannerEvent("api_saved", record);

  return record;
}