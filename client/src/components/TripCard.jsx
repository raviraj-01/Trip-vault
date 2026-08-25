const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

function TripCard({ trip, onEdit, onDelete }) {
  const rating = trip.rating
    ? `${"★".repeat(trip.rating)}${"☆".repeat(5 - trip.rating)} (${trip.rating}/5)`
    : "No rating";

  return (
    <article className="trip-card">
      <div className="trip-card-header">
        <h3>{trip.title}</h3>
        <span className="trip-rating">{rating}</span>
      </div>
      <p className="trip-destination">{trip.destination}</p>
      <p className="trip-dates">
        {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
      </p>
      {trip.description && <p className="trip-description">{trip.description}</p>}
      <div className="trip-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(trip)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(trip)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TripCard;
