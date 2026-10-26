import { renderMovies } from "./utils.js";
import { addToWatchlist } from "./watchlist.js";
import { searchMovies, getMovieDetails } from "./api.js";

const searchForm = document.querySelector("#search-form");
const searchBtn = document.querySelector(".searchBtn");
const movieList = document.querySelector(".movie-list");
const movieSearchInput = document.querySelector("#movie-search");
const movieYearInput = document.querySelector("#movie-Year");

/**
 * Allows instant access to a movie object by imdbID.
 *
 * Example:
 * movieLookup.get("tt0137523")
 */
const movieLookup = new Map();

/**
 * Render a loading state while searching.
 */
function renderLoadingState() {
  movieList.innerHTML = `
    <div class="loading">
      <p>Searching movies...</p>
    </div>
  `;
}

/**
 * Render an error message.
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
 * Handle movie search.
 */
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = movieSearchInput.value.trim();
  const searchYear = movieYearInput.value.trim();

  if (!searchTerm) {
    renderErrorMessage("Missing Search", "Please enter a movie title.");

    return;
  }

  try {
    searchBtn.disabled = true;

    renderLoadingState();

    /**
     * Search for matching movies.
     */
    const searchResults = await searchMovies(searchTerm, searchYear);

    if (searchResults.Response === "False") {
      renderErrorMessage(
        "No Results Found",
        "Unable to find what you're looking for. Please try another search.",
      );

      return;
    }

    /**
     * Retrieve full details for each movie.
     */
    const fullMovieDetails = await Promise.all(
      searchResults.Search.map((movie) => getMovieDetails(movie.imdbID)),
    );

    /**
     * Refresh lookup map.
     */
    movieLookup.clear();

    fullMovieDetails.forEach((movie) => {
      movieLookup.set(movie.imdbID, movie);
    });

    /**
     * Render search results.
     */
    movieList.innerHTML = renderMovies(fullMovieDetails);

    /**
     * Reset form after a successful search.
     */
    searchForm.reset();
  } catch (error) {
    console.error("Movie search failed:", error);

    renderErrorMessage(
      "Search Failed",
      "Unable to retrieve movie data at the moment.",
    );
  } finally {
    searchBtn.disabled = false;
  }
});

/**
 * Handle add-to-watchlist clicks using event delegation.
 */
movieList.addEventListener("click", (event) => {
  if (!event.target.matches(".add-to-watchlist-btn")) {
    return;
  }

  const { imdbid } = event.target.dataset;

  const movie = movieLookup.get(imdbid);

  if (!movie) {
    console.error(`Movie ${imdbid} not found in lookup map.`);

    return;
  }

  addToWatchlist(movie);
});
