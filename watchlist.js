import { renderMovies } from "./utils.js";

const movieList = document.querySelector(".movie-list");

const watchListMovies =
  JSON.parse(localStorage.getItem("watchlistMovies")) || [];

movieList.innerHTML = renderMovies(watchListMovies, true);

movieList.addEventListener("click", (event) => {
  if (!event.target.matches(".remove-from-watchlist-btn")) return;

  const imdbID = event.target.dataset.imdbid;

  const updatedWatchlist = removeFromWatchlist(imdbID);

  movieList.innerHTML = renderMovies(updatedWatchlist, true);
});

export function addToWatchlist(movie) {
  const watchListMovies =
    JSON.parse(localStorage.getItem("watchlistMovies")) || [];

  const alreadyExists = watchListMovies.some(
    (watchlistMovie) => watchlistMovie.imdbID === movie.imdbID,
  );

  if (alreadyExists) return;

  watchListMovies.push(movie);

  localStorage.setItem("watchlistMovies", JSON.stringify(watchListMovies));
}

function removeFromWatchlist(imdbID) {
  const watchListMovies =
    JSON.parse(localStorage.getItem("watchlistMovies")) || [];

  const updatedWatchlist = watchListMovies.filter(
    (movie) => movie.imdbID !== imdbID,
  );

  localStorage.setItem("watchlistMovies", JSON.stringify(updatedWatchlist));

  return updatedWatchlist;
}
