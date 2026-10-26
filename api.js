const BASE_URL = "http://localhost:3000/api/omdb";

/**
 * Search movies by title.
 */
export async function searchMovies(title, year = "") {
  let url = `${BASE_URL}?s=${encodeURIComponent(title)}`;

  if (year) {
    url += `&y=${year}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  return response.json();
}

/**
 * Fetch complete movie details by imdbID.
 */
export async function getMovieDetails(imdbID) {
  const response = await fetch(`${BASE_URL}?i=${imdbID}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch details for ${imdbID}`);
  }

  return response.json();
}
