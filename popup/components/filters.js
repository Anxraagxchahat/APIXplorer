/**
 * Filter controls for the API dashboard.
 */

export function createFilters({ onFilterChange, onSearchChange, onClear, onExport }) {
  const controls = document.createElement("div");
  controls.className = "dashboard-controls";

  const filterGroup = document.createElement("div");
  filterGroup.className = "filter-group";

  const methods = ["All", "GET", "POST"];

  methods.forEach((method) => {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.type = "button";
    button.textContent = method;
    button.dataset.method = method;
    button.addEventListener("click", () => onFilterChange(method));
    filterGroup.appendChild(button);
  });

  const searchInput = document.createElement("input");
  searchInput.className = "search-input";
  searchInput.type = "search";
  searchInput.placeholder = "Search hostname or path";
  searchInput.addEventListener("input", (event) => onSearchChange(event.target.value));

  const actions = document.createElement("div");
  actions.className = "dashboard-actions";

  const clearButton = document.createElement("button");
  clearButton.className = "secondary-btn";
  clearButton.type = "button";
  clearButton.textContent = "Clear";
  clearButton.addEventListener("click", onClear);

  const exportButton = document.createElement("button");
  exportButton.className = "primary-btn";
  exportButton.type = "button";
  exportButton.textContent = "Export JSON";
  exportButton.addEventListener("click", onExport);

  actions.append(clearButton, exportButton);
  controls.append(filterGroup, searchInput, actions);
  return { controls, searchInput };
}
