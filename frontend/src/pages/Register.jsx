import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.name.trim().length < 20 ||
        form.name.trim().length > 60) {
      setError("Name must contain 20–60 characters.");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.password)) {
      setError(
        "Password must be 8–16 characters with an uppercase letter and special character."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: {
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
        },
      });

      setMessage(data.message || "Registration successful.");
      setForm({
        name: "",
        email: "",
        address: "",
        password: "",
      });

      navigate("/login", {
        state: { message: "Account created. Please log in." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Create your account</h1>
      <p>Join RateSpace to discover and rate stores.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Full name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            minLength={20}
            maxLength={60}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            maxLength={400}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            maxLength={16}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}

export default Register;