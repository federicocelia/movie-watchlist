/**
 * storage.js
 *
 * Responsibilities:
 * - Provide a single interface for watchlist persistence.
 * - Read watchlist data from localStorage.
 * - Save watchlist data to localStorage.
 * - Protect the rest of the application from
 *   localStorage and JSON parsing errors.
 *
 * Why does this module exist?
 *
 * Instead of accessing localStorage throughout the app,
 * every read and write operation goes through this file.
 *
 * This creates a single source of truth for persistence
 * and keeps storage concerns separate from UI concerns.
 */

/**
 * localStorage key used to persist the user's watchlist.
 *
 * Changing this value would effectively create a brand-new
 * watchlist because the application would begin reading
 * from a different storage location.
 */
const STORAGE_KEY = "watchlistMovies";

/**
 * Retrieve the persisted watchlist.
 *
 * Returns:
 * - Array of movie objects
 * - Empty array if no watchlist exists
 * - Empty array if stored data is invalid
 *
 * Defensive measures:
 * - Handles missing storage.
 * - Handles corrupted JSON.
 * - Validates the data structure.
 */
export function getWatchlist() {
  try {
    /**
     * localStorage returns a string or null.
     */
    const storedData = localStorage.getItem(STORAGE_KEY);

    /**
     * First-time users will not have a watchlist.
     */
    if (!storedData) {
      return [];
    }

    /**
     * Convert JSON string back into JavaScript objects.
     */
    const parsedData = JSON.parse(storedData);

    /**
     * Validate stored data.
     *
     * We expect an array of movie objects.
     *
     * Any malformed entries are discarded.
     */
    return Array.isArray(parsedData)
      ? parsedData.filter((movie) => movie.imdbID)
      : [];
  } catch (error) {
    /**
     * Safeguard against:
     * - Corrupted storage
     * - Invalid JSON
     * - Browser storage issues
     *
     * Returning an empty array allows the
     * application to continue functioning.
     */
    console.error("Failed to retrieve watchlist from localStorage:", error);

    return [];
  }
}

/**
 * Save a watchlist to localStorage.
 *
 * Parameters:
 * - watchlist: array of movie objects
 *
 * Returns:
 * - true if save succeeds
 * - false if save fails
 *
 * Returning a status instead of throwing
 * allows callers to control the user experience
 * (for example, displaying notifications).
 */
export function saveWatchlist(watchlist) {
  try {
    /**
     * localStorage only stores strings,
     * therefore the array must be serialized.
     */
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));

    return true;
  } catch (error) {
    /**
     * Possible causes:
     * - Storage quota exceeded
     * - Browser restrictions
     * - Private browsing limitations
     */
    console.error("Failed to save watchlist to localStorage:", error);

    return false;
  }
}
