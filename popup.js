import { parseUrl } from "./core/parser.js";
import { detectApiType } from "./core/detector.js";

document.addEventListener("DOMContentLoaded", async () => {
  const domainElement = document.getElementById("current-domain");
  const statusElement = document.getElementById("status-text");

  const updateStatus = (message) => {
    if (statusElement) {
      statusElement.textContent = message;
    }
  };

  const updateDomain = (value) => {
    if (domainElement) {
      domainElement.textContent = value;
    }
  };

  updateStatus("Ready");
  updateDomain("Loading...");

  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!activeTab?.url) {
      updateDomain("Not Detected");
      return;
    }

    try {
      const parsedUrl = parseUrl(activeTab.url);
      const hostname = parsedUrl.hostname || "Not Detected";
      const apiType = detectApiType(activeTab.url);

      updateDomain(hostname);
      updateStatus(apiType);
    } catch {
      updateDomain("Not Detected");
    }
  } catch (error) {
    console.warn("APIXplorer could not determine the active tab.", error);
    updateDomain("Not Detected");
  }
});
