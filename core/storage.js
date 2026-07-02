/**
 * Storage helpers for persisted API data.
 *
 * The module wraps chrome.storage.local with simple async helpers for saving,
 * loading, and clearing discovered API entries.
 */

const STORAGE_KEY = "apixplorer.apis";

/**
 * Persist a discovered API entry.
 * @param {Object} api - The API record to save.
 * @returns {Promise<Object>} The saved API entry.
 */
export async function saveApi(api) {
  const payload = {
    ...api,
    savedAt: Date.now(),
  };

  const existingApis = await getApis();
  const nextApis = [...existingApis, payload];

  await chrome.storage.local.set({ [STORAGE_KEY]: nextApis });
  return payload;
}

/**
 * Load all saved API entries.
 * @returns {Promise<Array>} The stored API records.
 */
export async function getApis() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : [];
}

/**
 * Remove all saved API entries.
 * @returns {Promise<void>}
 */
export async function clearApis() {
  await chrome.storage.local.remove(STORAGE_KEY);
}
