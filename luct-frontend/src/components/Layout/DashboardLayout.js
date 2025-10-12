import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../../utils/auth";
import Sidebar from "./Sidebar";
import "../../styles/DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const user = getUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-layout d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <div className={`main-content flex-fill ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
          <button className="btn btn-outline-light me-3" onClick={toggleSidebar}>
            ☰
          </button>
          <span className="navbar-brand">LUCT Reporting</span>
          <div className="ms-auto d-flex align-items-center">
            <span className="me-3">{user?.name} ({user?.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Dashboard content */}
        <div className="dashboard-content p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
