import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { setUser } from "../utils/auth";
import "../styles/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      // Fix: flatten user and token
      const userData = data.user ? { ...data.user, token: data.token } : data;

      if (!userData.token || !userData.role) {
        alert("Login failed: missing token or role.");
        return;
      }

      setUser(userData);

      // Redirect based on role
      switch (userData.role) {
        case "student":
          navigate("/student");
          break;
        case "lecturer":
          navigate("/lecturer");
          break;
        case "pl":
          navigate("/pl");
          break;
        case "prl":
          navigate("/prl");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/"); // fallback
      }

    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
