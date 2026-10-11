import { Bookmark, Play, Star } from "lucide-react";

function MovieCard({ movie, index, saved, onSelect, onToggle }) {
  const year = movie.release_date?.slice(0, 4) || "—";
  return (
    <article className="movie-card" style={{ "--delay": `${index * 45}ms` }}>
      <button className="poster-button" onClick={() => onSelect(movie)} aria-label={`View ${movie.title}`}>
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="poster-placeholder"><Play size={28} /></div>
        )}
        <div className="poster-shade" />
        <span className="rating"><Star size={13} fill="currentColor" /> {movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}</span>
        <span className="quick-view"><Play size={15} fill="currentColor" /> Details</span>
      </button>
      <div className="card-info">
        <div>
          <h3>{movie.title}</h3>
          <p>{year} <span>•</span> {movie.original_language?.toUpperCase() || "EN"}</p>
        </div>
        <button className={`save-btn ${saved ? "saved" : ""}`} onClick={() => onToggle(movie)} aria-label={saved ? "Remove from watchlist" : "Save to watchlist"}>
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

export default MovieCard;