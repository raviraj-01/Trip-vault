import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearToken, getApiError } from "../components/api";
import AuthCard from "../components/AuthCard";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then(({ data }) => setUser(data))
      .catch((err) => setError(getApiError(err, "Unable to load your profile.")))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (loading) {
    return (
      <AuthCard title="Dashboard">
        <p>Loading your dashboard...</p>
      </AuthCard>
    );
  }

  if (error) {
    return (
      <AuthCard title="Dashboard" error={error}>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to login
        </button>
      </AuthCard>
    );
  }

  return (
    <div className="page">
      <div className="card dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">You are signed in to TripVault.</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="user-panel">
          <p className="label">Signed in as</p>
          <p className="user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
