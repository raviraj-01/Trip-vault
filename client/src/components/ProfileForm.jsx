import { useEffect } from "react";
import api, { getApiError } from "./api";
import useForm from "./useForm";

function ProfileForm({ user, onSuccess, onCancel }) {
  const { values, setValues, error, setError, loading, setLoading, handleChange } = useForm({
    username: "",
    bio: "",
  });

  useEffect(() => {
    setValues({ username: user?.username || "", bio: user?.bio || "" });
    setError("");
  }, [user, setValues, setError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.put("/api/users/profile", {
        username: values.username,
        bio: values.bio,
      });
      onSuccess(data);
    } catch (err) {
      setError(getApiError(err, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>Edit profile</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            required
            minLength={3}
            pattern="[A-Za-z0-9_]+"
            autoComplete="username"
          />

          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows={4} value={values.bio} onChange={handleChange} />

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
