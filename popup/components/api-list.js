/**
 * Render and manage the saved API list dashboard.
 */

import { createApiDetails } from "./api-details.js";
import { clearApis, getApis } from "../../core/storage.js";
import { createApiCard } from "./api-card.js";
import { createFilters } from "./filters.js";

export async function renderApiDashboard(container, { onRefresh }) {
  container.innerHTML = "";
  container.className = "dashboard-panel";

  const header = document.createElement("div");
  header.className = "dashboard-header";
  header.innerHTML = `
    <div>
      <h2>Saved APIs</h2>
      <p>Browse the records captured during scans.</p>
    </div>
  `;

  const listWrapper = document.createElement("div");
  listWrapper.className = "api-list";

  const detailsWrapper = document.createElement("div");
  detailsWrapper.className = "api-details-panel";

  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.textContent = "No saved API records yet.";

  let records = [];
  let filter = "All";
  let query = "";

  const renderList = async () => {
    records = await getApis();
    const filtered = records.filter((api) => {
      const matchesFilter = filter === "All" || api.method === filter;
      const haystack = `${api.hostname || ""} ${api.pathname || ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });

    listWrapper.innerHTML = "";

    if (!filtered.length) {
      listWrapper.appendChild(emptyState.cloneNode(true));
      return;
    }

 filtered.forEach((api) => {
  const card = createApiCard(api, (selectedApi) => {
    detailsWrapper.innerHTML = "";
    detailsWrapper.appendChild(createApiDetails(selectedApi));
  });

  listWrapper.appendChild(card);
});

  const { controls } = createFilters({
    onFilterChange: (nextFilter) => {
      filter = nextFilter;
      void renderList();
    },
    onSearchChange: (nextQuery) => {
      query = nextQuery;
      void renderList();
    },
    onClear: async () => {
      await clearApis();
      await renderList();
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    },
    onExport: async () => {
      const currentRecords = await getApis();
      const blob = new Blob([JSON.stringify(currentRecords, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "apixplorer-records.json";
      link.click();
      URL.revokeObjectURL(url);
    },
  });

  container.append(
  header,
  controls,
  listWrapper,
  detailsWrapper
);