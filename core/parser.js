/**
 * URL parsing utilities for APIXplorer.
 *
 * This module isolates URL parsing so the rest of the extension can work with
 * normalized hostname, pathname, and query data without duplicating logic.
 */

/**
 * Parse a URL into a small view model.
 * @param {string} url - The URL to parse.
 * @returns {{ hostname: string, pathname: string, queryParams: Object }}
 */
export function parseUrl(url) {
  if (!url) {
    return {
      hostname: "",
      pathname: "",
      queryParams: {},
    };
  }

  const parsedUrl = new URL(url);

  return {
    hostname: parsedUrl.hostname,
    pathname: parsedUrl.pathname,
    queryParams: Object.fromEntries(parsedUrl.searchParams.entries()),
  };
}
