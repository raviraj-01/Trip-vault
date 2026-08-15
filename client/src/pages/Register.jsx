import { Link, useNavigate } from "react-router-dom";
import api, { getApiError } from "../components/api";
import AuthCard from "../components/AuthCard";
import useForm from "../components/useForm";

function Register() {
  const navigate = useNavigate();
  const { values, error, setError, loading, setLoading, handleChange } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", values);
      navigate("/login");
    } catch (err) {
      setError(getApiError(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Join TripVault to manage your trips securely."
      error={error}
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />

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
          minLength={6}
          autoComplete="new-password"
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Register;
