const STORAGE_KEY = "watchlistMovies";

/**
 * Retrieve watchlist from localStorage
 */
export function getWatchlist() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedData = JSON.parse(storedData);

    return Array.isArray(parsedData)
      ? parsedData.filter((movie) => movie.imdbID)
      : [];
  } catch (error) {
    console.error("Failed to retrieve watchlist from localStorage:", error);

    return [];
  }
}

/**
 * Save watchlist to localStorage
 */
export function saveWatchlist(watchlist) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));

    return true;
  } catch (error) {
    console.error("Failed to save watchlist to localStorage:", error);

    return false;
  }
}
