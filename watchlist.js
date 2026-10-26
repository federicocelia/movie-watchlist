/**
 * watchlist.js
 *
 * Responsibilities:
 * - Render the user's persisted watchlist.
 * - Add and remove movies from the watchlist.
 * - Synchronize UI updates with localStorage.
 * - Display notifications for user actions.
 * - Manage the search modal on watchlist.html.
 * - Reuse shared search functionality from search.js.
 *
 * This file is the entry point for watchlist.html.
 */

import { renderMovies } from "./utils.js";
import { getWatchlist, saveWatchlist } from "./storage.js";
import { showNotification } from "./notifications.js";
import { initializeSearch } from "./search.js";

/**
 * Primary watchlist container.
 *
 * Important:
 * This container is dedicated to rendering the user's
 * persisted watchlist.
 *
 * Search results should NEVER replace this content.
 * Search results are displayed inside a modal instead.
 */
const movieList = document.querySelector(".movie-list");

/**
 * Search modal elements.
 *
 * The modal allows users to search for movies and
 * add them to their watchlist without losing sight
 * of the watchlist underneath.
 */
const modal = document.querySelector("#search-modal");

const modalMovieList = document.querySelector(".modal-movie-list");

const closeModalBtn = document.querySelector("#close-modal-btn");

/**
 * Render the latest watchlist state.
 *
 * Source of truth:
 * localStorage
 *
 * Instead of maintaining a separate in-memory list,
 * the watchlist is always reconstructed from storage.
 *
 * This guarantees the UI reflects the persisted state.
 */
export function renderWatchlist() {
  const movies = getWatchlist();

  /**
   * Show a friendly empty state when the user
   * hasn't saved any movies yet.
   */
  if (!movies.length) {
    movieList.innerHTML = `
      <div class="empty-watchlist">
        <h3>Your watchlist is empty</h3>
        <p>Add some movies to get started.</p>
      </div>
    `;

    return;
  }

  movieList.innerHTML = renderMovies(movies, true);
}

/**
 * Display search results inside the modal.
 *
 * Why a modal?
 *
 * We want users to search for additional movies
 * while keeping their current watchlist visible.
 *
 * This creates a better experience than replacing
 * the existing watchlist content.
 */
export function openSearchModal(movies) {
  if (!modal || !modalMovieList) {
    return;
  }

  modalMovieList.innerHTML = renderMovies(movies);

  modal.classList.remove("hidden");
}

/**
 * Close the search modal.
 *
 * Search results are cleared on close so each
 * search session starts fresh.
 */
function closeSearchModal() {
  if (!modal || !modalMovieList) {
    return;
  }

  modal.classList.add("hidden");

  modalMovieList.innerHTML = "";
}

/**
 * Persist a movie to the watchlist.
 *
 * Rules:
 * - A movie can only exist once.
 * - Updates are saved to localStorage.
 * - User receives visual feedback.
 * - Watchlist UI is refreshed immediately.
 */
export function addToWatchlist(movie) {
  const watchlist = getWatchlist();

  /**
   * Prevent duplicate entries.
   */
  const alreadyExists = watchlist.some((item) => item.imdbID === movie.imdbID);

  if (alreadyExists) {
    showNotification(
      `"${movie.Title}" is already in your watchlist.`,
      "warning",
    );

    return;
  }

  watchlist.push(movie);

  if (saveWatchlist(watchlist)) {
    showNotification(`"${movie.Title}" added to watchlist.`, "success");

    /**
     * Immediately synchronize UI with storage.
     */
    renderWatchlist();
  } else {
    showNotification("Unable to save watchlist.", "error");
  }
}

/**
 * Remove a movie from the watchlist.
 *
 * Returns:
 * Updated watchlist array after removal.
 */
function removeFromWatchlist(imdbID) {
  const watchlist = getWatchlist();

  /**
   * Keep a reference so we can display
   * a meaningful notification.
   */
  const movieToRemove = watchlist.find((movie) => movie.imdbID === imdbID);

  const updatedWatchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);

  if (saveWatchlist(updatedWatchlist)) {
    showNotification(
      `"${movieToRemove?.Title ?? "Movie"}" removed from watchlist.`,
      "success",
    );
  } else {
    showNotification("Unable to update watchlist.", "error");
  }

  return updatedWatchlist;
}

/**
 * Event delegation for remove buttons.
 *
 * Rather than attaching a click handler to every
 * individual remove button, we attach a single
 * listener to the parent container.
 *
 * This continues to work even when the list
 * is completely re-rendered.
 */
movieList?.addEventListener("click", (event) => {
  if (!event.target.matches(".remove-from-watchlist-btn")) {
    return;
  }

  const { imdbid } = event.target.dataset;

  removeFromWatchlist(imdbid);

  renderWatchlist();
});

/**
 * Search form visibility controls.
 *
 * The button simply shows/hides the search form.
 *
 * Actual searching is handled by search.js.
 */
const toggleSearchBtn = document.querySelector(".watchlist-movie-search-btn");

const searchForm = document.querySelector("#search-form");

if (toggleSearchBtn && searchForm) {
  toggleSearchBtn.addEventListener("click", () => {
    searchForm.classList.toggle("hidden");
  });
}

/**
 * Allow explicit modal dismissal.
 */
closeModalBtn?.addEventListener("click", closeSearchModal);

/**
 * Allow users to dismiss the modal by
 * clicking outside the modal content.
 *
 * Only clicks on the backdrop should close it.
 */
modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeSearchModal();
  }
});

/**
 * Initial page render.
 *
 * When watchlist.html loads, immediately
 * synchronize the interface with localStorage.
 */
renderWatchlist();

/**
 * Reuse shared search functionality.
 *
 * The search system is shared between:
 *
 * - index.html
 * - watchlist.html
 *
 * By passing openSearchModal as the callback,
 * search.js knows that search results should
 * be displayed inside the modal instead of
 * replacing page content.
 */
initializeSearch({
  onResults: openSearchModal,
});
