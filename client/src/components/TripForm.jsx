import { useEffect, useState } from "react";
import api, { getApiError } from "./api";
import useForm from "./useForm";

const EMPTY_FORM = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
  rating: "",
};

const FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "destination", label: "Destination", type: "text", required: true },
  { name: "startDate", label: "Start date", type: "date" },
  { name: "endDate", label: "End date", type: "date" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5 },
];

const toFormValues = (trip) => ({
  title: trip?.title ?? "",
  destination: trip?.destination ?? "",
  startDate: trip?.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "",
  endDate: trip?.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
  description: trip?.description ?? "",
  rating: trip?.rating ?? "",
});

function TripForm({ trip, onSuccess, onCancel }) {
  const isEdit = Boolean(trip);
  const { values, setValues, error, setError, loading, setLoading, handleChange } =
    useForm(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setValues(toFormValues(trip));
    setError("");
    setImageFile(null);
    setPreviewUrl("");
  }, [trip, setValues, setError]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setImageFile(null);
      setPreviewUrl("");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...values,
      rating: values.rating === "" ? undefined : Number(values.rating),
    };

    try {
      const { data: saved } = await (isEdit
        ? api.put(`/api/trips/${trip._id}`, payload)
        : api.post("/api/trips", payload));

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== "") formData.append(key, value);
        });

        await api.post(`/api/trips/${saved._id}/upload`, formData);
      }

      onSuccess();
    } catch (err) {
      setError(getApiError(err, `Failed to ${isEdit ? "update" : "create"} trip.`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>{isEdit ? "Edit trip" : "Create trip"}</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          {FIELDS.map(({ name, label, type, required, min, max }) => (
            <div key={name}>
              <label htmlFor={name}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  rows={3}
                  value={values[name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={values[name]}
                  onChange={handleChange}
                  required={required}
                  min={min}
                  max={max}
                />
              )}
            </div>
          ))}

          <label htmlFor="image">Photo</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <img className="image-preview" src={previewUrl} alt="Selected trip photo preview" />
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update trip" : "Create trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripForm;
