import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getApiError, getToken } from "../components/api";
import TripCard from "../components/TripCard";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/api/users/${encodeURIComponent(username)}/profile`, { skipAuth: true })
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(getApiError(err, "Unable to load this profile.")))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="card dashboard-wide">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page dashboard-page">
        <div className="card dashboard-wide">
          <div className="alert alert-error">{error || "Profile not found"}</div>
          <Link to={getToken() ? "/dashboard" : "/"} className="btn btn-primary">
            {getToken() ? "Back to dashboard" : "Go home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <div className="card dashboard-wide">
        <div className="dashboard-header">
          <div>
            <h1>{profile.name}</h1>
            <p className="subtitle">@{profile.username}</p>
            <p className="profile-bio">{profile.bio || "This traveler has not added a bio yet."}</p>
          </div>
          <Link to={getToken() ? "/dashboard" : "/"} className="btn btn-secondary">
            {getToken() ? "Dashboard" : "Home"}
          </Link>
        </div>

        {profile.trips.length === 0 ? (
          <div className="empty-state">
            <h2>No public trips yet</h2>
            <p>This user has not added any trips.</p>
          </div>
        ) : (
          <div className="trip-grid">
            {profile.trips.map((trip) => (
              <TripCard key={`${trip.title}-${trip.destination}-${trip.startDate}`} trip={trip} publicView />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
