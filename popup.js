import { parseUrl } from "./core/parser.js";
import { renderApiDashboard } from "./popup/components/api-list.js";

document.addEventListener("DOMContentLoaded", async () => {
  const domainElement = document.getElementById("current-domain");
  const statusElement = document.getElementById("status-text");
  const counterElement = document.getElementById("api-counter");
  const startButton = document.getElementById("start-scan");
  const savedApisButton = document.getElementById("view-apis");
  const dashboardRoot = document.getElementById("dashboard-root");

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

  const updateCounter = (count) => {
    if (counterElement) {
      counterElement.textContent = count ?? 0;
    }
  };

  const updateButtons = (isScanning) => {
    if (startButton) {
      startButton.textContent = isScanning ? "Stop Scan" : "Start Scan";
      startButton.classList.toggle("danger-btn", isScanning);
    }

    if (savedApisButton) {
      savedApisButton.disabled = false;
    }
  };

  const refreshState = async () => {
    try {
      const state = await chrome.runtime.sendMessage({ type: "scan:getState" });
      updateStatus(state?.isScanning ? "Scanning" : "Ready");
      updateCounter(state?.detectedCount ?? 0);
      updateButtons(Boolean(state?.isScanning));
    } catch (error) {
      updateStatus("Ready");
      updateCounter(0);
      updateButtons(false);
    }
  };

  const refreshDashboard = async () => {
    if (dashboardRoot) {
      await renderApiDashboard(dashboardRoot, { onRefresh: refreshState });
    }
  };

  updateStatus("Ready");
  updateDomain("Loading...");
  updateCounter(0);
  updateButtons(false);

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
      updateDomain(parsedUrl.hostname || "Not Detected");
    } catch {
      updateDomain("Not Detected");
    }
  } catch (error) {
    console.warn("APIXplorer could not determine the active tab.", error);
    updateDomain("Not Detected");
  }

  startButton?.addEventListener("click", async () => {
    const isScanning = startButton.textContent === "Stop Scan";
    const state = isScanning
      ? await chrome.runtime.sendMessage({ type: "scan:stop" })
      : await chrome.runtime.sendMessage({ type: "scan:start" });

    updateStatus(state?.isScanning ? "Scanning" : "Ready");
    updateButtons(Boolean(state?.isScanning));
    updateCounter(state?.detectedCount ?? 0);
    await refreshDashboard();
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "scanner-event") {
      return;
    }

    if (message.event === "scan_started") {
      updateStatus("Scanning");
      updateButtons(true);
    } else if (message.event === "scan_stopped") {
      updateStatus("Ready");
      updateButtons(false);
    } else if (message.event === "api_saved") {
      void refreshState();
      void refreshDashboard();
    }
  });

  savedApisButton?.addEventListener("click", () => {
    void refreshDashboard();
  });

  await refreshState();
  await refreshDashboard();
});
