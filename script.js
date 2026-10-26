/**
 * script.js
 *
 * Entry point for index.html.
 *
 * Responsibilities:
 * - Bootstrap movie search functionality.
 * - Configure the search page with the default behavior.
 *
 * Search results on index.html are rendered directly
 * into the page's movie list container.
 *
 * Contrast this with watchlist.html:
 * - watchlist.js initializes the same search module
 * - search results are displayed inside a modal
 *
 * By keeping initialization separate, both pages can
 * reuse the same search implementation while providing
 * different user experiences.
 */

import { initializeSearch } from "./search.js";

/**
 * Initialize standard search behavior.
 *
 * No custom callback is provided,
 * therefore search.js will render
 * search results directly into the page.
 */
initializeSearch();
