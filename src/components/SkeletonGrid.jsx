function SkeletonGrid() {
  return (
    <div className="movie-grid">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton poster-skeleton" />
          <div className="skeleton-line wide" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}
export default SkeletonGrid;