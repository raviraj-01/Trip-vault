import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getApiError } from "../components/api";

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/trips/${id}`)
      .then(({ data }) => setTrip(data))
      .catch((err) => setError(getApiError(err, "Unable to load this trip.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="card dashboard-wide">
          <p>Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page dashboard-page">
        <div className="card dashboard-wide">
          <div className="alert alert-error">{error || "Trip not found"}</div>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const photos = trip.photos?.length ? trip.photos : trip.coverImage ? [trip.coverImage] : [];

  return (
    <div className="page dashboard-page">
      <div className="card dashboard-wide">
        <div className="dashboard-header">
          <div>
            <h1>{trip.title}</h1>
            <p className="subtitle">{trip.destination}</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            Back
          </Link>
        </div>

        {trip.description && <p className="trip-description">{trip.description}</p>}

        {photos.length === 0 ? (
          <div className="empty-state">
            <h2>No photos yet</h2>
            <p>Edit this trip from the dashboard to upload a cover photo or extra photos.</p>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((url) => (
              <img key={url} src={url} alt={`${trip.title} photo`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetail;
