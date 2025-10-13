import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/prl/classes");
        setClasses(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="mb-3">Classes</h2>
        <p className="text-muted mb-4">
          Manage and view all classes under your department.
        </p>

        {loading && <p>Loading classes...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive shadow rounded border">
            <table className="table table-striped table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>Class Name</th>
                  <th>Course</th>
                  <th>Lecturers</th>
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
                      <td>
                        {cls.lecturers && cls.lecturers.length > 0
                          ? cls.lecturers.join(", ")
                          : "N/A"}
                      </td>
                      <td>{cls.venue || "N/A"}</td>
                      <td>{cls.scheduled_time || "N/A"}</td>
                      <td>{cls.total_registered ?? 0}</td>
                      <td>
                        <button
                          onClick={() =>
                            navigate(`/prl/classes/${cls.id}/reports`)
                          }
                          className="btn btn-primary btn-sm"
                        >
                          View Reports
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Classes;
