/**
 * search.js
 *
 * Responsibilities:
 * - Handle movie searches.
 * - Fetch search results from OMDb.
 * - Fetch complete movie details for each result.
 * - Render search results.
 * - Handle adding movies to the watchlist.
 *
 * Why does this module exist?
 *
 * The application supports movie searching from
 * multiple pages:
 *
 * - index.html
 * - watchlist.html
 *
 * Instead of duplicating search logic, both pages
 * reuse this module through initializeSearch().
 */

import { renderMovies } from "./utils.js";
import { addToWatchlist } from "./watchlist.js";
import { searchMovies, getMovieDetails } from "./api.js";

/**
 * Initialize movie search functionality.
 *
 * Optional configuration:
 *
 * onResults:
 * Allows each page to decide what should happen
 * once search results are retrieved.
 *
 * Examples:
 *
 * index.html
 *   → render directly in the page
 *
 * watchlist.html
 *   → open results inside a modal
 */
export function initializeSearch({ onResults } = {}) {
  /**
   * Search form elements.
   *
   * These selectors are shared between pages.
   */
  const searchForm = document.querySelector("#search-form");

  const searchBtn = document.querySelector(".searchBtn");

  const movieList = document.querySelector(".movie-list");

  const modalMovieList = document.querySelector(".modal-movie-list");

  const movieSearchInput = document.querySelector("#movie-search");

  const movieYearInput = document.querySelector("#movie-Year");

  /**
   * Abort initialization if required elements
   * do not exist on the current page.
   *
   * This allows the module to be imported safely
   * without causing runtime errors.
   */
  if (
    !searchForm ||
    !searchBtn ||
    !movieList ||
    !movieSearchInput ||
    !movieYearInput
  ) {
    return;
  }

  /**
   * Fast lookup table:
   *
   * imdbID -> movie object
   *
   * Search results are stored here so clicks on
   * "Add to Watchlist" can instantly retrieve the
   * corresponding movie object.
   *
   * Using a Map is significantly faster and cleaner
   * than searching through an array every time.
   */
  const movieLookup = new Map();

  /**
   * Display a loading state while waiting
   * for network requests to complete.
   *
   * Note:
   * Only used on the main search page.
   *
   * Watchlist searches use a modal and therefore
   * do not replace existing page content.
   */
  function renderLoadingState() {
    movieList.innerHTML = `
      <div class="loading">
        <p>Searching movies...</p>
      </div>
    `;
  }

  /**
   * Display an error message inside the
   * results container.
   */
  function renderErrorMessage(
    title = "Something went wrong",
    message = "Please try again.",
  ) {
    movieList.innerHTML = `
      <div class="search-error">
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * Handle movie search submissions.
   */
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    /**
     * Remove leading/trailing whitespace
     * from user input.
     */
    const searchTerm = movieSearchInput.value.trim();

    const searchYear = movieYearInput.value.trim();

    /**
     * Reject empty searches.
     */
    if (!searchTerm) {
      renderErrorMessage("Missing Search", "Please enter a movie title.");

      return;
    }

    try {
      /**
       * Prevent duplicate searches while
       * a request is already in progress.
       */
      searchBtn.disabled = true;

      /**
       * Loading UI should only replace content
       * on the main search page.
       *
       * When onResults exists (watchlist page),
       * search results will eventually open
       * inside a modal instead.
       */
      if (!onResults) {
        renderLoadingState();
      }

      /**
       * First API request:
       *
       * Search OMDb using movie title.
       *
       * This endpoint returns basic information
       * and imdbIDs.
       */
      const searchResults = await searchMovies(searchTerm, searchYear);

      /**
       * Handle searches with no matches.
       */
      if (searchResults.Response === "False") {
        renderErrorMessage(
          "No Results Found",
          "Unable to find what you're looking for.",
        );

        return;
      }

      /**
       * Second API request:
       *
       * Retrieve full movie details for each
       * search result.
       *
       * Promise.all executes all requests
       * concurrently instead of waiting for
       * each request one at a time.
       */
      const fullMovieDetails = await Promise.all(
        searchResults.Search.map((movie) => getMovieDetails(movie.imdbID)),
      );

      /**
       * Rebuild the lookup map.
       *
       * Only the most recent search results
       * should exist inside the map.
       */
      movieLookup.clear();

      fullMovieDetails.forEach((movie) => {
        movieLookup.set(movie.imdbID, movie);
      });

      /**
       * Delegate rendering responsibility.
       *
       * If a page supplies a callback, let
       * that page decide how results should
       * be displayed.
       *
       * Otherwise render results directly.
       */
      if (onResults) {
        onResults(fullMovieDetails);
      } else {
        movieList.innerHTML = renderMovies(fullMovieDetails);
      }

      /**
       * Clear inputs after a successful search.
       */
      searchForm.reset();
    } catch (error) {
      console.error(error);

      renderErrorMessage("Search Failed", "Unable to retrieve movie data.");
    } finally {
      /**
       * Always re-enable the button,
       * regardless of success or failure.
       */
      searchBtn.disabled = false;
    }
  });

  /**
   * Handle Add To Watchlist clicks.
   *
   * Uses event delegation because movie cards
   * are dynamically generated after every search.
   */
  function handleAddToWatchlist(event) {
    if (!event.target.matches(".add-to-watchlist-btn")) {
      return;
    }

    const { imdbid } = event.target.dataset;

    const movie = movieLookup.get(imdbid);

    /**
     * Safety check.
     *
     * The clicked movie should always exist
     * in the lookup map, but we'll guard
     * against unexpected states.
     */
    if (!movie) {
      return;
    }

    addToWatchlist(movie);
  }

  /**
   * Search page results container.
   */
  movieList?.addEventListener("click", handleAddToWatchlist);

  /**
   * Watchlist modal results container.
   *
   * Allows search results rendered inside
   * the modal to use the exact same
   * add-to-watchlist functionality.
   */
  modalMovieList?.addEventListener("click", handleAddToWatchlist);
}
