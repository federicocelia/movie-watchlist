/**
 * utils.js
 *
 * Responsibilities:
 * - Convert movie data into HTML.
 * - Generate reusable movie card markup.
 * - Adapt card actions depending on the current page.
 *
 * This file should ONLY be responsible for presentation.
 *
 * Important:
 * This module does not:
 * - Fetch data
 * - Manage state
 * - Handle events
 * - Interact with localStorage
 *
 * It receives movie data and returns HTML strings.
 */

/**
 * Convert an array of movie objects into one HTML string.
 *
 * Why?
 * Instead of appending each card individually to the DOM,
 * we generate one large HTML fragment and render it in
 * a single DOM update. This is simpler and more performant.
 *
 * Parameters:
 * - movies: array of movie objects returned from OMDb
 * - isWatchlistPage: determines whether cards should render
 *   "add" or "remove" watchlist controls
 */
export function renderMovies(movies, isWatchlistPage = false) {
  return movies
    .map((movie) => createMovieCard(movie, isWatchlistPage))
    .join("");
}

/**
 * Generate the appropriate watchlist button.
 *
 * Search Page:
 * - Show "+" button
 * - Allow adding movies
 *
 * Watchlist Page:
 * - Show "-" button
 * - Allow removing movies
 *
 * This helper keeps createMovieCard()
 * focused only on rendering movie data.
 */
function createWatchlistButton(imdbID, isWatchlistPage) {
  return isWatchlistPage
    ? `
      <button
        class="remove-from-watchlist-btn"
        data-imdbid="${imdbID}"
      >
        -
      </button>

      <p class="remove-from-watchlist-highlight">
        Watchlist
      </p>
    `
    : `
      <button
        class="add-to-watchlist-btn"
        data-imdbid="${imdbID}"
      >
        +
      </button>

      <p class="add-to-watchlist-highlight">
        Watchlist
      </p>
    `;
}

/**
 * Generate markup for a single movie card.
 *
 * Parameters:
 * - movie: full movie object from OMDb
 * - isWatchlistPage: determines button behavior
 *
 * Returns:
 * HTML string representing one movie card.
 */
export function createMovieCard(movie, isWatchlistPage = false) {
  /**
   * Extract only the properties required
   * by the presentation layer.
   */
  const { Genre, Plot, Poster, Runtime, Title, imdbID, imdbRating } = movie;

  /**
   * Build page-specific watchlist controls.
   */
  const buttonHTML = createWatchlistButton(imdbID, isWatchlistPage);

  /**
   * Some OMDb results return:
   *
   * Poster: "N/A"
   *
   * Use a local fallback image instead of
   * displaying a broken image placeholder.
   */
  const poster = Poster === "N/A" ? "./img/default-movie-poster.jpg" : Poster;

  return `
    <li
      class="movie-card"
      data-imdbid="${imdbID}"
    >
      <div class="movie-poster-container">

        <img
          class="movie-poster"
          src="${poster}"
          alt="${Title} poster"
        />

      </div>

      <div class="movie-section-details">

        <div class="movie-header">

          <h3 class="movie-title">
            ${Title}
          </h3>

          <p class="movie-rating">
            ${imdbRating}
          </p>

        </div>

        <div class="movie-meta">

          <p class="movie-runtime">
            ${Runtime}
          </p>

          <p class="movie-genre">
            ${Genre}
          </p>

          <div class="watchlist-container">
            ${buttonHTML}
          </div>

        </div>

        <div class="movie-description">

          <p class="movie-plot">
            ${Plot}
          </p>

        </div>

      </div>

    </li>
  `;
}
