import { getApis, clearApis } from "./core/storage.js";

const app = document.getElementById("app");

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createToolbar({ onSearch, onMethodChange, onTypeChange, onClear, onExportJson, onExportCurl }) {
  const panel = createElement("section", "panel");
  const toolbar = createElement("div", "toolbar");

  const searchInput = createElement("input");
  searchInput.placeholder = "Search hostname or path";
  searchInput.addEventListener("input", (event) => onSearch(event.target.value));

  const methodSelect = createElement("select");
  methodSelect.innerHTML = `<option value="All">All methods</option><option value="GET">GET</option><option value="POST">POST</option>`;
  methodSelect.addEventListener("change", (event) => onMethodChange(event.target.value));

  const typeSelect = createElement("select");
  typeSelect.innerHTML = `
    <option value="All">All types</option>
    <option value="Product API">Product API</option>
    <option value="Search API">Search API</option>
    <option value="Cart API">Cart API</option>
    <option value="Offer API">Offer API</option>
    <option value="Auth API">Auth API</option>
    <option value="User API">User API</option>
    <option value="Order API">Order API</option>
    <option value="Payment API">Payment API</option>
    <option value="Inventory API">Inventory API</option>
    <option value="Review API">Review API</option>
    <option value="GraphQL API">GraphQL API</option>
    <option value="Static Asset">Static Asset</option>
    <option value="Unknown API">Unknown API</option>
  `;
  typeSelect.addEventListener("change", (event) => onTypeChange(event.target.value));

  const actions = createElement("div", "row");
  const clearButton = createElement("button", "secondary", "Clear");
  clearButton.addEventListener("click", onClear);
  const exportJsonButton = createElement("button", "secondary", "Export JSON");
  exportJsonButton.addEventListener("click", onExportJson);
  const exportCurlButton = createElement("button", "secondary", "Export cURL");
  exportCurlButton.addEventListener("click", onExportCurl);
  actions.append(clearButton, exportJsonButton, exportCurlButton);

  toolbar.append(searchInput, methodSelect, typeSelect, actions);
  panel.appendChild(toolbar);
  return panel;
}

function createList(records, onSelect) {
  const panel = createElement("section", "panel");
  const list = createElement("div", "list");

  if (!records.length) {
    const empty = createElement("div", "empty-state", "No API records stored yet.");
    list.appendChild(empty);
  } else {
    records.forEach((record) => {
      const item = createElement("div", "item");
      item.addEventListener("click", () => onSelect(record));

      const header = createElement("div", "item-header");
      header.appendChild(createElement("span", "method", record.method || "GET"));
      header.appendChild(createElement("span", "meta", record.apiType || "Unknown API"));
      item.appendChild(header);
      item.appendChild(createElement("div", "meta", record.hostname || "Unknown host"));
      item.appendChild(createElement("div", "meta", record.pathname || "/"));
      list.appendChild(item);
    });
  }

  panel.appendChild(list);
  return panel;
}

function createDetailView(record) {
  const panel = createElement("section", "panel");
  const detail = createElement("div", "detail-view");

  const rows = [
    ["URL", record.url || ""],
    ["Hostname", record.hostname || ""],
    ["Pathname", record.pathname || ""],
    ["Method", record.method || "GET"],
    ["Timestamp", record.savedAt ? new Date(record.savedAt).toLocaleString() : ""],
    ["Classification", record.apiType || "Unknown API"],
    ["Query Parameters", JSON.stringify(record.queryParams || {}, null, 2)],
  ];

  rows.forEach(([label, value]) => {
    const row = createElement("div", "detail-row");
    row.appendChild(createElement("div", "label", label));
    row.appendChild(createElement("div", "value", value));
    detail.appendChild(row);
  });

  panel.appendChild(detail);
  return panel;
}

function buildCurl(record) {
  const url = record.url || "";
  const method = record.method || "GET";
  return `curl -X ${method} "${url}"`;
}

async function render() {
  const records = await getApis();
  let filtered = [...records];
  let search = "";
  let methodFilter = "All";
  let typeFilter = "All";
  let selectedRecord = filtered[0] || null;

  const refresh = () => {
    const next = filtered.filter((record) => {
      const matchesSearch = `${record.hostname || ""} ${record.pathname || ""}`.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === "All" || (record.method || "GET") === methodFilter;
      const matchesType = typeFilter === "All" || (record.apiType || "Unknown API") === typeFilter;
      return matchesSearch && matchesMethod && matchesType;
    });

    app.innerHTML = "";
    app.appendChild(createToolbar({
      onSearch: (value) => {
        search = value;
        refresh();
      },
      onMethodChange: (value) => {
        methodFilter = value;
        refresh();
      },
      onTypeChange: (value) => {
        typeFilter = value;
        refresh();
      },
      onClear: async () => {
        await clearApis();
        await render();
      },
      onExportJson: async () => {
        const currentRecords = await getApis();
        const blob = new Blob([JSON.stringify(currentRecords, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "apixplorer-records.json";
        link.click();
        URL.revokeObjectURL(url);
      },
      onExportCurl: async () => {
        const currentRecords = await getApis();
        const content = currentRecords.map((record) => buildCurl(record)).join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "apixplorer-records.sh";
        link.click();
        URL.revokeObjectURL(url);
      },
    }));

    app.appendChild(createList(next, (record) => {
      selectedRecord = record;
      refresh();
    }));

    if (selectedRecord) {
      const exists = next.some((record) => record.id === selectedRecord.id);
      if (!exists) {
        selectedRecord = next[0] || null;
      }
    }

    if (selectedRecord) {
      app.appendChild(createDetailView(selectedRecord));
    }
  };

  refresh();
}

render();
