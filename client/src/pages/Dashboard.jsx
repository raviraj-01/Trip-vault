import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { clearToken, getApiError } from "../components/api";
import ProfileForm from "../components/ProfileForm";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";

function DashboardShell({ children }) {
  return (
    <div className="page dashboard-page">
      <div className="card dashboard-wide">{children}</div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [activeTrip, setActiveTrip] = useState(undefined);
  const [editingProfile, setEditingProfile] = useState(false);

  const fetchTrips = useCallback(async () => {
    const { data } = await api.get("/api/trips");
    setTrips(data);
  }, []);

  const refreshTrips = () =>
    fetchTrips().catch((err) =>
      setActionError(getApiError(err, "Could not refresh the trip list."))
    );

  const runTripAction = async (action, fallbackMessage) => {
    setActionError("");
    try {
      await action();
      await fetchTrips();
    } catch (err) {
      setActionError(getApiError(err, fallbackMessage));
    }
  };

  useEffect(() => {
    Promise.all([api.get("/api/auth/me"), fetchTrips()])
      .then(([userRes]) => setUser(userRes.data))
      .catch((err) => setError(getApiError(err, "Unable to load your dashboard.")))
      .finally(() => setLoading(false));
  }, [fetchTrips]);

  if (loading) {
    return (
      <DashboardShell>
        <p>Loading your dashboard...</p>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="alert alert-error">{error}</div>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to login
        </button>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {user.name}. Manage your trips below.</p>
        </div>
        <div className="header-actions">
          {user.username && (
            <Link to={`/profile/${user.username}`} className="btn btn-secondary">
              My Profile
            </Link>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => setEditingProfile(true)}>
            Edit Profile
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setActiveTrip(null)}>
            + New trip
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              clearToken();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      {trips.length === 0 ? (
        <div className="empty-state">
          <h2>No trips yet</h2>
          <p>Start planning your next adventure by creating your first trip.</p>
          <button type="button" className="btn btn-primary" onClick={() => setActiveTrip(null)}>
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onOpen={(selected) => navigate(`/trips/${selected._id}`)}
              onEdit={setActiveTrip}
              onDelete={(selected) => {
                if (!window.confirm(`Delete "${selected.title}"? This cannot be undone.`)) return;
                runTripAction(() => api.delete(`/api/trips/${selected._id}`), "Failed to delete trip.");
              }}
            />
          ))}
        </div>
      )}

      {activeTrip !== undefined && (
        <TripForm
          trip={activeTrip}
          onSuccess={() => {
            setActiveTrip(undefined);
            refreshTrips();
          }}
          onCancel={() => setActiveTrip(undefined)}
        />
      )}

      {editingProfile && (
        <ProfileForm
          user={user}
          onSuccess={(updated) => {
            setUser((prev) => ({ ...prev, ...updated }));
            setEditingProfile(false);
          }}
          onCancel={() => setEditingProfile(false)}
        />
      )}
    </DashboardShell>
  );
}

export default Dashboard;
