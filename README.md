# API Hunter

API Hunter is a Chrome Extension scaffold for exploring and organizing browser-visible web APIs. This phase focuses on creating a clean, production-ready foundation for future discovery and analysis features.

## Project Structure

- `manifest.json` - Manifest V3 extension configuration, permissions, and entry points.
- `popup.html` / `popup.css` / `popup.js` - Extension popup UI and basic active-tab detection.
- `background.js` - Service worker placeholder for future coordination and state management.
- `content.js` - Content script placeholder that logs when the extension is loaded.
- `icons/` - Placeholder icon assets for the extension store and toolbar.

## Planned Features

Future phases may include:

- API discovery and inventory from visible browser contexts
- Request interception and inspection workflows
- Structured storage for discovered endpoints and APIs
- Filtering and organization of browser-observable interfaces
- Export and reporting tools for developers

## Installation

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" in the top-right corner.
3. Click "Load unpacked".
4. Select the `api-hunter` folder from this workspace.
5. The API Hunter extension will appear in your toolbar.

## Notes

This phase intentionally does not implement API detection, interception, scraping, or backend integration. The goal is to provide a solid scaffold that is easy to extend.
