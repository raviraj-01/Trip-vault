const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

function TripCard({ trip, onEdit, onDelete, onOpen, publicView = false }) {
  const rating = trip.rating
    ? `${"★".repeat(trip.rating)}${"☆".repeat(5 - trip.rating)} (${trip.rating}/5)`
    : "No rating";

  return (
    <article className="trip-card">
      {trip.coverImage ? (
        <img className="trip-cover" src={trip.coverImage} alt={trip.title} />
      ) : (
        <div className="trip-cover trip-cover-fallback" aria-hidden="true">
          No cover photo
        </div>
      )}

      <div className="trip-card-header">
        <h3>{trip.title}</h3>
        <span className="trip-rating">{rating}</span>
      </div>
      <p className="trip-destination">{trip.destination}</p>
      <p className="trip-dates">
        {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
      </p>
      {!publicView && trip.description && <p className="trip-description">{trip.description}</p>}

      {!publicView && (
        <div className="trip-actions">
          {onOpen && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onOpen(trip)}>
              View
            </button>
          )}
          {onEdit && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(trip)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(trip)}>
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default TripCard;
