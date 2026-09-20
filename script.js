const searchBtn = document.querySelector(".searchBtn");
const movies = [];

let movieListHtml = "";

searchBtn.addEventListener("click", async () => {
  const searchTerm = document.querySelector("#movie-search").value;
  const searchYear = document.querySelector("#movie-Year").value;

  let url1 = `http://localhost:3000/api/omdb?s=${searchTerm}`;

  if (searchYear) {
    url1 += `&y=${searchYear}`;
  }

  try {
    const response = await fetch(url1);

    const data = await response.json();

    const movieArray = data.Search || [];

    movies.push(...movieArray);

    //const { Title, Year, Poster, Type, imdbID } = movieArray; //needed

    const movieList = document.querySelector(".movie-list");

    movieListHtml = "";

    for (const movie of movieArray) {
      const url2 = `http://localhost:3000/api/omdb?i=${movie.imdbID}`;

      const fullDetailsResponse = await fetch(url2);
      const fullDetailsData = await fullDetailsResponse.json();

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
      } = fullDetailsData;
      console.log(fullDetailsData);

      //const { ...} = fullDetailsData
      movieListHtml += `
      <li class="movie-card" id="" data-imdbid="${imdbID}">
      <div class="movie-poster-container">
      <img class="movie-poster" alt="poster-image-of-${Title}" src="${Poster}" />
      </div>

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

    movieList.innerHTML = movieListHtml;
  } catch (error) {
    console.error(error);
  }
});
