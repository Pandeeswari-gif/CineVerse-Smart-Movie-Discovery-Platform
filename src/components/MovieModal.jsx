import { Bookmark, CalendarDays, Clock3, Star, X } from "lucide-react";

function MovieModal({ movie, saved, onClose, onToggle }) {
  const year = movie.release_date?.slice(0, 4) || "Unknown";
  const backdrop = movie.backdrop_url || movie.poster_url;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="movie-modal">
        <button className="modal-close" onClick={onClose}><X /></button>
        <div className="modal-cover" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,9,13,.98) 8%, rgba(8,9,13,.78) 46%, rgba(8,9,13,.12)), url(${backdrop})` }} />
        <div className="modal-content">
          <img className="modal-poster" src={movie.poster_url} alt="" />
          <div className="modal-copy">
            <span className="modal-label">MOVIE PROFILE</span>
            <h2>{movie.title}</h2>
            <div className="modal-meta">
              <span><CalendarDays size={15} /> {year}</span>
              {movie.runtime && <span><Clock3 size={15} /> {movie.runtime} min</span>}
              <span className="modal-rating"><Star size={15} fill="currentColor" /> {movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}</span>
            </div>
            <p>{movie.overview || "No synopsis is available for this title."}</p>
            <div className="modal-actions">
              <button className={`primary-btn ${saved ? "saved-primary" : ""}`} onClick={onToggle}>
                <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved to Watchlist" : "Add to Watchlist"}
              </button>
              <button className="secondary-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;