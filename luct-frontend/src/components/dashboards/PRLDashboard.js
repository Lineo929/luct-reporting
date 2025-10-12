import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link } from "react-router-dom";

const PRLDashboard = () => {
  return (
    <DashboardLayout>
      <h2>Principal Lecturer Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <Link to="/prl/courses" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Courses</h5>
            <p>View all courses under your stream.</p>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/prl/reports" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Reports</h5>
            <p>View lecture reports and add feedback.</p>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/prl/monitoring" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Monitoring</h5>
            <p>Track student attendance and performance.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PRLDashboard;
