export const LoadingSkeleton = ({ variant = "card", rows = 3 }) => {
  if (variant === "page") {
    return (
      <div className="page-skeleton">
        <div className="skeleton hero" />
        <div className="grid">
          <div className="skeleton block" />
          <div className="skeleton block" />
          <div className="skeleton block" />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton line" />
      ))}
    </div>
  );
};

