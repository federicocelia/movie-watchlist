/**
 * api.js
 *
 * Responsibilities:
 * - Centralize all API communication.
 * - Hide request implementation details from the rest
 *   of the application.
 * - Provide reusable methods for retrieving movie data.
 *
 * Why does this file exist?
 *
 * Instead of scattering fetch() calls throughout the app,
 * every movie-related request is routed through this module.
 *
 * Benefits:
 * - Single place to maintain API requests.
 * - Easier debugging.
 * - Easier future migrations to a different API.
 * - Keeps search.js focused on search logic instead of networking.
 *
 * Application architecture:
 *
 * Browser
 *    ↓
 * api.js
 *    ↓
 * Express backend
 *    ↓
 * OMDb API
 *
 * The browser never talks directly to OMDb.
 * The backend acts as a proxy so the API key
 * remains hidden from users.
 */

/**
 * Backend endpoint used by the frontend.
 *
 * Express injects the OMDb API key before
 * forwarding requests to OMDb.
 */
const BASE_URL = "http://localhost:3000/api/omdb";

/**
 * Search movies by title.
 *
 * Parameters:
 * - title: movie title entered by the user
 * - year: optional release year filter
 *
 * OMDb Search Endpoint:
 *
 * ?s=<movie title>
 *
 * Example:
 *
 * searchMovies("Batman")
 *
 * returns a collection of matching movies,
 * each containing a subset of movie data.
 *
 * Important:
 * The search endpoint does NOT return all
 * available movie information.
 *
 * It primarily provides:
 * - Title
 * - Year
 * - Poster
 * - imdbID
 *
 * Full movie details require a second request
 * using the imdbID.
 */
export async function searchMovies(title, year = "") {
  /**
   * Encode user input before inserting it
   * into the URL.
   *
   * This prevents invalid URLs when titles
   * contain spaces or special characters.
   */
  let url = `${BASE_URL}?s=${encodeURIComponent(title)}`;

  /**
   * Apply optional release year filter.
   */
  if (year) {
    url += `&y=${year}`;
  }

  const response = await fetch(url);

  /**
   * Handle network-level failures.
   *
   * Examples:
   * - Backend unavailable
   * - Server errors
   * - Invalid response
   */
  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  /**
   * Convert JSON response into
   * a JavaScript object.
   */
  return response.json();
}

/**
 * Retrieve complete movie details.
 *
 * Parameters:
 * - imdbID: unique OMDb movie identifier
 *
 * Example:
 *
 * getMovieDetails("tt0133093")
 *
 * Why do we need this request?
 *
 * The search endpoint returns only partial data.
 *
 * After receiving search results we perform
 * a second request for each imdbID in order
 * to obtain:
 *
 * - Genre
 * - Plot
 * - Runtime
 * - imdbRating
 * - Full movie metadata
 *
 * This data is used when rendering movie cards.
 */
export async function getMovieDetails(imdbID) {
  const response = await fetch(`${BASE_URL}?i=${imdbID}`);

  /**
   * Protect callers from failed requests.
   */
  if (!response.ok) {
    throw new Error(`Failed to fetch details for ${imdbID}`);
  }

  /**
   * Return the parsed movie object.
   */
  return response.json();
}
