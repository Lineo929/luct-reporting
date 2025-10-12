import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../../utils/auth";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const user = getUser();
  const location = useLocation();

  const menu = {
    student: [
      { name: "Dashboard", path: "/student" },
      { name: "Monitoring", path: "/student/monitoring" },
      { name: "Rating", path: "/student/rating" },
      { name: "Enrollments", path: "/student/enrollments" },
    ],
    lecturer: [
      { name: "Dashboard", path: "/lecturer" },
      { name: "Classes", path: "/lecturer/classes" },
      { name: "Reports", path: "/lecturer/reports" },
      { name: "Monitoring", path: "/lecturer/monitoring" },
      { name: "Rating", path: "/lecturer/rating" },
    ],
    pl: [
      { name: "Dashboard", path: "/pl" },
      { name: "Courses", path: "/pl/courses" },
      { name: "Reports", path: "/pl/reports" },
      { name: "Monitoring", path: "/pl/monitoring" },
      { name: "Classes", path: "/pl/classes" },
      { name: "Lectures", path: "/pl/lectures" },
      { name: "Rating", path: "/pl/rating" },
    ],
    prl: [
      { name: "Dashboard", path: "/prl" },
      { name: "Courses", path: "/prl/courses" },
      { name: "Reports", path: "/prl/reports" },
      { name: "Monitoring", path: "/prl/monitoring" },
      { name: "Rating", path: "/prl/rating" },
      { name: "Classes", path: "/prl/classes" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Users", path: "/admin/users" },
      { name: "Settings", path: "/admin/settings" },
    ],
  };

  const items = menu[user?.role] || [];

  return (
    <div className={`sidebar d-flex flex-column p-3 ${isOpen ? "open" : "closed"}`}>
      <h4 className="text-center mb-4">Menu</h4>
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
