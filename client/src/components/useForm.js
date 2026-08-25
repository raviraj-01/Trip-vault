import { useState } from "react";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  return { values, setValues, error, setError, loading, setLoading, handleChange };
};

export default useForm;
