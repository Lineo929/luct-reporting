import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <h2>Student Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <Link to="/student/monitoring" className="card p-3 shadow-sm text-decoration-none text-dark">
            <h5>Monitoring</h5>
            <p>View your attendance and progress for each lecture.</p>
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <Link to="/student/rating" className="card p-3 shadow-sm text-decoration-none text-dark">
            <h5>Rating</h5>
            <p>Rate lecturers and provide feedback on courses.</p>
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <Link to="/student/enrollments" className="card p-3 shadow-sm text-decoration-none text-dark">
            <h5>Enrollments</h5>
            <p>View and manage your class enrollments.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
