// src/components/dashboards/PL/Lectures.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Lectures = () => {
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({ course: "", lecturer: "" });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/pl/lectures", { params: filters });
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        <h2 className="fw-bold mb-3">Lecturer Activities</h2>

        {/* Filters */}
        <div className="card mb-4 p-3">
          <div className="d-flex gap-2 flex-wrap">
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Courses</option>
              {/* TODO: map courses dynamically */}
            </select>

            <select
              value={filters.lecturer}
              onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Lecturers</option>
              {/* TODO: map lecturers dynamically */}
            </select>

            <button className="btn btn-primary" onClick={fetchActivities}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Activities Table */}
        <div className="card shadow-sm overflow-auto">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Lecturer</th>
                <th>Course</th>
                <th>Class</th>
                <th>Week</th>
                <th>Date</th>
                <th>Topic</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((a, i) => (
                  <tr key={i}>
                    <td>{a.lecturer_name}</td>
                    <td>{a.course_name}</td>
                    <td>{a.class_name}</td>
                    <td>{a.week_of_reporting}</td>
                    <td>{new Date(a.lecture_date).toLocaleDateString()}</td>
                    <td>{a.topic_taught}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No activities available.
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

export default Lectures;
