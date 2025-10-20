// src/components/dashboards/PL/Rating.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Rating = () => {
  const [ratings, setRatings] = useState([]);
  const [filters, setFilters] = useState({ lecturer: "", course: "" });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await api.get("/pl/ratings", { params: filters });
      setRatings(res.data);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        <h2 className="fw-bold mb-3">Lecturer Ratings</h2>

        {/* Filters */}
        <div className="card mb-4 p-3">
          <div className="d-flex flex-wrap gap-2">
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Courses</option>
              {/* TODO: Map courses dynamically */}
            </select>

            <select
              value={filters.lecturer}
              onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Lecturers</option>
              {/* TODO: Map lecturers dynamically */}
            </select>

            <button className="btn btn-primary" onClick={fetchRatings}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="card shadow-sm overflow-auto">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Lecturer</th>
                <th>Course</th>
                <th>Week</th>
                <th>Date</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((r) => (
                  <tr key={r.rating_id}>
                    <td>{r.lecturer_name}</td>
                    <td>{r.course_name}</td>
                    <td>{r.week_of_reporting}</td>
                    <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                    <td>{r.rating || "N/A"}</td>
                    <td>{r.comment || "No comment"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No ratings available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rating;
