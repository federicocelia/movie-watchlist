import { renderMovies } from "./utils.js";

const movieList = document.querySelector(".movie-list");

const watchListMovies =
  JSON.parse(localStorage.getItem("watchlistMovies")) || [];

movieList.innerHTML = renderMovies(watchListMovies);
