import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";
import ReportCard from "./ReportCard";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/prl/reports");
        setReports(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="mb-3">Reports</h2>
        <p>Review submitted lecturer and student reports.</p>

        {loading && <p>Loading reports...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-muted">No reports available at the moment.</p>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="row">
            {reports.map((report) => (
              <div className="col-md-6" key={report.report_id}>
                <ReportCard report={report} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
