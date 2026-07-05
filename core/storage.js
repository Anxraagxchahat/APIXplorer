/**
 * APIXplorer Storage Layer
 */

const STORAGE_KEY = "apixplorer.apis";

export async function getApis() {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return Array.isArray(result[STORAGE_KEY])
    ? result[STORAGE_KEY]
    : [];
}

export async function saveApi(api) {
  const apis = await getApis();

  const index = apis.findIndex((item) => item.id === api.id);

  if (index >= 0) {
    apis[index] = {
      ...apis[index],
      ...api,
      updatedAt: Date.now(),
    };
  } else {
    apis.push({
      ...api,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  await chrome.storage.local.set({
    [STORAGE_KEY]: apis,
  });

  return api;
}

export async function removeApi(id) {
  const apis = await getApis();

  const filtered = apis.filter(
    (item) => item.id !== id
  );

  await chrome.storage.local.set({
    [STORAGE_KEY]: filtered,
  });
}

export async function clearApis() {
  await chrome.storage.local.remove(STORAGE_KEY);
}

export async function getApiById(id) {
  const apis = await getApis();

  return apis.find((item) => item.id === id) || null;
}

export async function getApisByHost(hostname) {
  const apis = await getApis();

  return apis.filter(
    (item) => item.hostname === hostname
  );
}

export async function getApisByType(type) {
  const apis = await getApis();

  return apis.filter(
    (item) => item.apiType === type
  );
}