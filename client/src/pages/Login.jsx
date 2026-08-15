import { Link, useNavigate } from "react-router-dom";
import api, { getApiError, setToken } from "../components/api";
import AuthCard from "../components/AuthCard";
import useForm from "../components/useForm";

function Login() {
  const navigate = useNavigate();
  const { values, error, setError, loading, setLoading, handleChange } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", values);
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiError(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your TripVault account."
      error={error}
      footer={
        <>
          Need an account? <Link to="/register">Register</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Login;
