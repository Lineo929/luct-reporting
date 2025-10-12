import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link } from "react-router-dom";

const PLDashboard = () => {
  return (
    <DashboardLayout>
      <h2>Program Leader Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <Link to="/pl/courses" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Courses</h5>
            <p>Add or assign modules and lectures.</p>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/pl/reports" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Reports</h5>
            <p>View reports from PRL and lecturers.</p>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/pl/classes" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Classes</h5>
            <p>Monitor all classes under your program.</p>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/pl/rating" className="card p-3 shadow-sm text-dark text-decoration-none">
            <h5>Rating</h5>
            <p>Rate lecturers and provide feedback.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PLDashboard;
