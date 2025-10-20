import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ course: "" });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/pl/classes", { params: filters });
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Classes</h2>
            <p className="text-muted mb-0">
              Manage and oversee scheduled classes for your program.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 p-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={fetchClasses}>
              Apply Filter
            </button>
          </div>
        </div>

        {/* Classes Table */}
        <div className="card shadow-sm overflow-auto">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Class</th>
                <th>Course</th>
                <th>Venue</th>
                <th>Scheduled Time</th>
                <th>Total Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.class_name}</td>
                    <td>{cls.course_name}</td>
                    <td>{cls.venue || "-"}</td>
                    <td>{cls.scheduled_time || "-"}</td>
                    <td>{cls.total_registered}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          alert(`Class Details:\n\nName: ${cls.class_name}\nCourse: ${cls.course_name}\nVenue: ${cls.venue || "N/A"}\nScheduled: ${cls.scheduled_time || "N/A"}\nTotal Registered: ${cls.total_registered}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No classes available.
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

export default Classes;
