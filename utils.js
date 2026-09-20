export function renderMovies(arrayOfMovies) {
  // Transform each movie object into an HTML string
  // and merge all strings into one large HTML fragment.
  return arrayOfMovies.map(createMovieCard).join("");
}

export function createMovieCard(movie) {
  // Destructuring movie
  const {
    Genre,
    Plot,
    Poster,
    Runtime,
    Title,
    Type,
    Year,
    imdbID,
    imdbRating,
  } = movie;

  return `
           <li class="movie-card" id="${imdbID}" data-imdbid="${imdbID}">
      <div class="movie-poster-container">
      <img class="movie-poster" alt="poster-image-of-${Title}" src="${Poster}" onerror="this.onerror=null;this.src='./img/default-movie-poster.jpg';"/>
      </div>
      <div class="movie-poster-container">

    <div class="movie-section-details">
      <div class="movie-header">
        <h3 class="movie-title">${Title}</h3>
        <p class="movie-rating">${imdbRating}</p>
      </div>
      <div class="movie-meta">
        <p class="movie-runtime">${Runtime}</p>
        <p class="movie-genre">${Genre}</p>
        <div class="watchlist-container">
          <button class="add-to-watchlist-btn" data-imdbid="${imdbID}">
            +
          </button>
          <p class="add-to-watchlist-highlight">Watchlist</p>
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
