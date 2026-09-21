import { renderMovies } from "./utils.js";
import { addToWatchlist } from "./watchlist.js";

const searchForm = document.querySelector("#search-form");
const searchBtn = document.querySelector(".searchBtn");
const movieList = document.querySelector(".movie-list");
const movieSearchInput = document.querySelector("#movie-search");
const movieYearInput = document.querySelector("#movie-Year");

// Stores the full details of the movies returned by the latest search.
const movies = [];

// Allows instant access to a movie object by imdbID.
const movieLookup = new Map();

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Read the current values from the search form.
  const searchTerm = movieSearchInput.value;
  const searchYear = movieYearInput.value;

  // Search endpoint:
  // OMDb returns a list of matching movies when searching by title.
  let url1 = `http://localhost:3000/api/omdb?s=${searchTerm}`;

  // Add the year filter only if the user supplied one.
  if (searchYear) {
    url1 += `&y=${searchYear}`;
  }

  try {
    // First request:
    // Retrieve the list of movies matching the search term.
    //
    // Important:
    // This endpoint does NOT return all available movie properties.
    // It only returns a subset of information, including imdbID.
    const response = await fetch(url1);
    const data = await response.json();

    // If OMDb returns no matches, use an empty array to avoid errors
    // when later mapping over the results.
    const movieArray = data.Search || [];

    //if search produce no result, message to be displayed
    if (data.Response === "False") {
      movieList.innerHTML = `
    <div class="search-error">
      <h3>No results found</h3>
      <p>
        Unable to find what you're looking for.
        Please try another search.
      </p>
    </div>
  `;
      return;
    }
    // Reuse the existing array while removing data from previous searches.
    movies.length = 0;

    // Second request:
    //
    // For each result we use its imdbID to request the complete movie data.
    //
    // Promise.all executes all requests in parallel, making the search much
    // faster than fetching each movie one-by-one inside a loop.
    const fullMovieDetails = await Promise.all(
      movieArray.map(async (movie) => {
        const response = await fetch(
          `http://localhost:3000/api/omdb?i=${movie.imdbID}`,
        );

        return response.json();
      }),
    );

    // Populate the search results array with the fully detailed movie objects.
    movies.push(...fullMovieDetails);

    // Rebuild the lookup map so it only contains movies
    // from the current search results.
    movieLookup.clear();

    // Structure:
    //
    // imdbID -> movie object
    //
    // Example:
    // "tt0780504" => { Title: "Drive", ... }
    fullMovieDetails.forEach((movie) => {
      movieLookup.set(movie.imdbID, movie);
    });

    // Convert the movie objects into HTML and render them
    // in a single DOM update for better performance.
    movieList.innerHTML = renderMovies(movies);
    searchForm.reset();
  } catch (error) {
    // Display a user-friendly message while still logging
    // the real error for debugging.
    console.error(error);

    movieList.innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
});

movieList.addEventListener("click", (event) => {
  if (!event.target.matches(".add-to-watchlist-btn")) return;

  const imdbID = event.target.dataset.imdbid;

  const movieToAddWatchlist = movieLookup.get(imdbID);

  addToWatchlist(movieToAddWatchlist);
});
