import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import logo from "../assets/images/logo.png"; // University logo
import heroImage from "../assets/images/university-hero.jpg"; // Hero image

const LandingPage = () => {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="overlay"></div>

      <header className="text-center text-light py-5">
        <img src={logo} alt="LUCT Logo" className="logo mb-3" />
        <h1 className="display-4 fw-bold mb-3">LUCT Reporting System</h1>
        <p className="lead mb-4">
          Manage lecturer reports, attendance, course topics, and recommendations with ease.
        </p>
        <div>
          <Link to="/login" className="btn btn-primary mx-2 px-4 py-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-light mx-2 px-4 py-2">
            Register
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features text-center text-dark py-5">
        <div className="container">
          <h2 className="mb-4">Key Features</h2>
          <div className="row justify-content-center">
            <div className="col-md-3 mb-4">
              <div className="feature-card p-3 shadow-sm rounded">
                <h5>Attendance Tracking</h5>
                <p>Record and monitor student attendance for each lecture.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="feature-card p-3 shadow-sm rounded">
                <h5>Lecture Reports</h5>
                <p>Submit detailed reports on topics taught and learning outcomes.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="feature-card p-3 shadow-sm rounded">
                <h5>Role-Based Dashboards</h5>
                <p>Access dashboards tailored for students, lecturers, and administrators.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="feature-card p-3 shadow-sm rounded">
                <h5>Analytics & Recommendations</h5>
                <p>Monitor trends and give recommendations to improve learning outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
