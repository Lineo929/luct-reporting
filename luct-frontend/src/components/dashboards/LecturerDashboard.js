import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link } from "react-router-dom";

const LecturerDashboard = () => {
  return (
    <DashboardLayout>
      <h2>Lecturer Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <Link to="/lecturer/classes" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Classes</h5>
            <p>View and manage your classes.</p>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/lecturer/reports" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Reports</h5>
            <p>Add new lecture reports for your courses.</p>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/lecturer/monitoring" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Monitoring</h5>
            <p>Track student attendance and engagement.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturerDashboard;
