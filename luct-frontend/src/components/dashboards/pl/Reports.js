import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    course: "",
    week: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/pl/reports", { params: filters });
      setReports(response.data);
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const calculateAttendance = (present, total) => {
    if (!present || !total) return "N/A";
    return `${((present / total) * 100).toFixed(1)}%`;
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Reports</h2>
            <p className="text-muted mb-0">
              Access and review lecturer-submitted weekly teaching reports.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Course</label>
                <select
                  className="form-select"
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                >
                  <option value="">All Courses</option>
                  {/* TODO: Map course options dynamically */}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Week</label>
                <select
                  className="form-select"
                  value={filters.week}
                  onChange={(e) =>
                    setFilters({ ...filters, week: e.target.value })
                  }
                >
                  <option value="">All Weeks</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Week {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 text-end">
                <button className="btn btn-primary px-4" onClick={fetchReports}>
                  <i className="bi bi-funnel me-2"></i>Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Course</th>
                    <th>Lecturer</th>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Topic</th>
                    <th>Attendance %</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-semibold">{r.course_name}</td>
                        <td>{r.lecturer_name}</td>
                        <td>{r.week_of_reporting}</td>
                        <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                        <td className="text-truncate" style={{ maxWidth: "180px" }}>
                          {r.topic_taught}
                        </td>
                        <td className="fw-bold text-primary">
                          {calculateAttendance(
                            r.actual_students_present,
                            r.total_registered_students
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              alert(
                                `📘 Topic: ${r.topic_taught}\n\nLearning Outcomes: ${
                                  r.learning_outcomes || "N/A"
                                }\n\nRecommendations: ${
                                  r.lecturer_recommendations || "N/A"
                                }`
                              )
                            }
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4 fst-italic">
                        No reports available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
