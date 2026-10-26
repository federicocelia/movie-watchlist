import { renderMovies } from "./utils.js";
import { getWatchlist, saveWatchlist } from "./storage.js";
import { showNotification } from "./notifications.js";

const movieList = document.querySelector(".movie-list");

/**
 * Render current watchlist.
 */
function renderWatchlist() {
  const movies = getWatchlist();

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
 * Add movie to watchlist.
 */
export function addToWatchlist(movie) {
  const watchlist = getWatchlist();

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
  } else {
    showNotification("Unable to save watchlist.", "error");
  }
}

/**
 * Remove movie from watchlist.
 */
function removeFromWatchlist(imdbID) {
  const watchlist = getWatchlist();

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
 */
movieList?.addEventListener("click", (event) => {
  if (!event.target.matches(".remove-from-watchlist-btn")) {
    return;
  }

  const { imdbid } = event.target.dataset;

  removeFromWatchlist(imdbid);

  renderWatchlist();
});

renderWatchlist();

const toggleSearchBtn = document.querySelector(".watchlist-movie-search-btn");

const searchForm = document.querySelector("#search-form");

if (toggleSearchBtn && searchForm) {
  toggleSearchBtn.addEventListener("click", () => {
    searchForm.classList.toggle("hidden");
  });
}
