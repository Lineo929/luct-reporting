import React, { useState } from "react";
import api from "../services/api";
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      alert("Registration successful! You can now log in.");
      console.log("Registered:", data);
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input type="text" name="full_name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select name="role" className="form-select" onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="pl">Program Leader (PL)</option>
              <option value="prl">Principal Lecturer (PRL)</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
