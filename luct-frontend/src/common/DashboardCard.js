import React from "react";

const DashboardCard = ({ title, description, icon, children }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4 hover-scale">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          {icon && <div className="me-3 text-primary fs-3">{icon}</div>}
          <h5 className="card-title fw-bold mb-0">{title}</h5>
        </div>
        <p className="text-muted">{description}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
