// Inject page script
const script = document.createElement("script");

script.src = chrome.runtime.getURL("inject.js");
script.onload = () => script.remove();

(document.head || document.documentElement).appendChild(script);

// Listen for messages coming from page context
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (!event.data) return;

  if (event.data.source !== "APIXplorer") return;

  chrome.runtime.sendMessage({
    type: "request:metadata",
    payload: event.data.payload,
  });
});

console.log("APIXplorer Content Loaded");