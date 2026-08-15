import { Link, Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./components/api";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  if (getToken()) return <Navigate to="/dashboard" replace />;

  return (
    <div className="page">
      <div className="card hero">
        <h1>TripVault</h1>
        <p>Secure travel planning starts with secure authentication.</p>
        <div className="actions">
          <Link to="/login" className="btn btn-primary">
            Log in
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
