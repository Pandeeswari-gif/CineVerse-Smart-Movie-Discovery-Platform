import { useEffect, useMemo, useState } from "react";
import { Bookmark, Check, Clapperboard, Film, Search, Sparkles, X } from "lucide-react";
import { getGenres, getMovies, searchMovies } from "./services/tmdb";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import SkeletonGrid from "./components/SkeletonGrid";

const sections = [
  { id: "trending", label: "Trending Now", endpoint: "trending" },
  { id: "popular", label: "Popular Picks", endpoint: "popular" },
  { id: "top_rated", label: "Critics' Favorites", endpoint: "top_rated" },
  { id: "upcoming", label: "Coming Soon", endpoint: "upcoming" }
];

function App() {
  const [activeSection, setActiveSection] = useState("trending");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cineverse-watchlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    if (query.trim()) return;
    loadSection(activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem("cineverse-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => current - i);
  }, []);

  async function loadSection(section) {
    setLoading(true);
    setError("");
    try {
      const result = await getMovies(section);
      setMovies(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event?.preventDefault();
    const value = query.trim();
    if (!value) {
      setActiveSection("trending");
      return;
    }
    setSearching(true);
    setLoading(true);
    setError("");
    try {
      const result = await searchMovies(value);
      setMovies(result);
      setActiveSection("search");
    } catch (err) {
      setError(err.message || "Search failed.");
      setMovies([]);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setSelectedGenre("all");
    setSelectedYear("all");
    setActiveSection("trending");
  }

  function toggleWatchlist(movie) {
    setWatchlist((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie]
    );
  }

  const visibleMovies = useMemo(() => {
    return movies.filter((movie) => {
      const genreOk =
        selectedGenre === "all" ||
        (movie.genre_ids || []).includes(Number(selectedGenre)) ||
        (movie.genres || []).some((g) => g.id === Number(selectedGenre));
      const year = Number((movie.release_date || "").slice(0, 4));
      const yearOk = selectedYear === "all" || year === Number(selectedYear);
      return genreOk && yearOk;
    });
  }, [movies, selectedGenre, selectedYear]);

  const featured = movies[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="CineVerse home">
          <span className="brand-mark"><Clapperboard size={18} /></span>
          <span>Cine<span>Verse</span></span>
        </a>

        <nav className="desktop-nav">
          <button onClick={() => { clearSearch(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Discover</button>
          <button onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}>Browse</button>
          <button onClick={() => {
            setMovies(watchlist);
            setQuery("");
            setSelectedGenre("all");
            setSelectedYear("all");
            setActiveSection("watchlist");
            document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
          }}>Watchlist</button>
        </nav>

        <div className="nav-actions">
          <form className="nav-search" onSubmit={handleSearch}>
            <Search size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies..." />
            {query && <button type="button" className="clear-search" onClick={clearSearch}><X size={15} /></button>}
          </form>
          <div className="avatar">CV</div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={15} /> Your next favorite film is here</div>
            <h1>Find a movie.<br /><span>Feel the story.</span></h1>
            <p>
              Explore popular releases, hidden gems and timeless favorites —
              all in one cinematic space.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to watch tonight?"
              />
              <button type="submit">{searching ? "Searching..." : "Explore"}</button>
            </form>
            <div className="hero-meta">
              <span><Film size={15} /> Live movie discovery</span>
              <span>•</span>
              <span>Personal watchlist</span>
              <span>•</span>
              <span>Responsive UI</span>
            </div>
          </div>
          {featured && (
            <button className="hero-poster" onClick={() => setSelectedMovie(featured)}>
              <img src={featured.backdrop_url || featured.poster_url} alt="" />
              <div className="hero-poster-overlay">
                <span>Featured tonight</span>
                <strong>{featured.title}</strong>
              </div>
            </button>
          )}
        </section>

        <section className="stats-strip">
          <div><strong>01</strong><span>Search</span></div>
          <div><strong>02</strong><span>Discover</span></div>
          <div><strong>03</strong><span>Save</span></div>
          <div><strong>04</strong><span>Watch</span></div>
        </section>

        <section id="catalogue" className="catalogue">
          <div className="section-heading">
            <div>
              <p className="kicker">THE COLLECTION</p>
              <h2>{activeSection === "search" ? `Results for “${query}”` : activeSection === "watchlist" ? "My Watchlist" : sections.find(s => s.id === activeSection)?.label || "Discover"}</h2>
            </div>
            {activeSection !== "watchlist" && (
              <div className="section-switcher">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={activeSection === section.id ? "active" : ""}
                    onClick={() => { setQuery(""); setActiveSection(section.id); }}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filters">
            <div className="genre-list">
              <button className={selectedGenre === "all" ? "filter active" : "filter"} onClick={() => setSelectedGenre("all")}>All</button>
              {genres.slice(0, 7).map((genre) => (
                <button key={genre.id} className={Number(selectedGenre) === genre.id ? "filter active" : "filter"} onClick={() => setSelectedGenre(genre.id)}>
                  {genre.name}
                </button>
              ))}
            </div>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} aria-label="Filter by year">
              <option value="all">Any year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          {error && (
            <div className="error-box">
              <div><strong>Couldn’t load the catalogue</strong><span>{error}</span></div>
              <button onClick={() => activeSection === "search" ? handleSearch() : loadSection(activeSection)}>Try again</button>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : visibleMovies.length ? (
            <div className="movie-grid">
              {visibleMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  saved={watchlist.some((item) => item.id === movie.id)}
                  onSelect={setSelectedMovie}
                  onToggle={toggleWatchlist}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Bookmark /></div>
              <h3>{activeSection === "watchlist" ? "Your watchlist is empty" : "No movies found"}</h3>
              <p>{activeSection === "watchlist" ? "Save movies you want to remember and they will appear here." : "Try a different genre, year or search phrase."}</p>
              {activeSection === "watchlist" && <button onClick={clearSearch}>Discover movies</button>}
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-brand"><span className="brand-mark"><Clapperboard size={17} /></span> CineVerse</div>
        <span>Built with React • Movie discovery made simple.</span>
        <span>© {new Date().getFullYear()} CineVerse</span>
      </footer>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          saved={watchlist.some((item) => item.id === selectedMovie.id)}
          onClose={() => setSelectedMovie(null)}
          onToggle={() => toggleWatchlist(selectedMovie)}
        />
      )}
    </div>
  );
}

export default App;