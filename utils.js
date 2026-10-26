export function renderMovies(movies, isWatchlistPage = false) {
  return movies
    .map((movie) => createMovieCard(movie, isWatchlistPage))
    .join("");
}

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

export function createMovieCard(movie, isWatchlistPage = false) {
  const { Genre, Plot, Poster, Runtime, Title, imdbID, imdbRating } = movie;

  const buttonHTML = createWatchlistButton(imdbID, isWatchlistPage);

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
