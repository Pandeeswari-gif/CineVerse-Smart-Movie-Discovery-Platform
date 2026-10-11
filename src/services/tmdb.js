const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = "https://www.omdbapi.com/";

// OMDb does not provide a genre-list endpoint like TMDB.
// These common genres are mapped so your existing filter UI can still work.
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
];

const GENRE_MAP = new Map(
  GENRES.map((genre) => [genre.name.toLowerCase(), genre.id])
);

function getGenreIds(genreText) {
  if (!genreText || genreText === "N/A") {
    return [];
  }

  return genreText
    .split(",")
    .map((genre) => genre.trim().toLowerCase())
    .map((genre) => GENRE_MAP.get(genre))
    .filter(Boolean);
}

function normalize(movie) {
  return {
    ...movie,

    // Common fields for your existing React components
    id: movie.imdbID,
    title: movie.Title || "",
    overview: movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "",

    poster_url:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : null,

    // OMDb does not provide TMDB-style backdrop images
    backdrop_url: null,

    release_date:
      movie.Released && movie.Released !== "N/A"
        ? movie.Released
        : movie.Year || "",

    vote_average:
      movie.imdbRating && movie.imdbRating !== "N/A"
        ? Number(movie.imdbRating)
        : 0,

    genre_ids: getGenreIds(movie.Genre),

    genre_names:
      movie.Genre && movie.Genre !== "N/A"
        ? movie.Genre.split(",").map((g) => g.trim())
        : [],

    imdb_id: movie.imdbID,
    imdb_rating: movie.imdbRating || "N/A",
    runtime: movie.Runtime || "N/A",
    actors: movie.Actors || "N/A",
    director: movie.Director || "N/A",
    language: movie.Language || "N/A",
    country: movie.Country || "N/A",
    awards: movie.Awards || "N/A",
  };
}

async function request(params) {
  if (!API_KEY) {
    throw new Error(
      "OMDb API key is missing. Add VITE_OMDB_API_KEY to your .env file."
    );
  }

  const url = new URL(BASE);

  Object.entries({
    ...params,
    apikey: API_KEY,
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`OMDb API returned ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found");
  }

  return data;
}

// Get complete movie information using IMDb ID
export async function getMovieDetails(imdbID) {
  if (!imdbID) {
    throw new Error("IMDb movie ID is required.");
  }

  const data = await request({
    i: imdbID,
    plot: "full",
  });

  return normalize(data);
}

// Search movies
export async function searchMovies(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const data = await request({
    s: query.trim(),
    type: "movie",
  });

  const movies = data.Search || [];

  // Get complete details so genre/rating/year information is available
  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      try {
        return await getMovieDetails(movie.imdbID);
      } catch {
        return normalize(movie);
      }
    })
  );

  return detailedMovies;
}

// Category-wise movie discovery
// OMDb does not have real "trending", "popular", "top rated"
// and "upcoming" endpoints like TMDB.
// So these sections use live OMDb search results.
export async function getMovies(type = "trending") {
  const searchTerms = {
    trending: "star",
    popular: "love",
    top_rated: "the",
    upcoming: "man",
  };

  const searchTerm = searchTerms[type] || searchTerms.trending;

  const data = await request({
    s: searchTerm,
    type: "movie",
  });

  const movies = data.Search || [];

  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      try {
        return await getMovieDetails(movie.imdbID);
      } catch {
        return normalize(movie);
      }
    })
  );

  return detailedMovies;
}

// Genre list for existing UI
export async function getGenres() {
  return GENRES;
}