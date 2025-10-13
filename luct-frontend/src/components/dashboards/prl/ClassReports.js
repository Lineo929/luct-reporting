import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";
import ReportCard from "./ReportCard";

const ClassReports = () => {
  const { classId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get(`/prl/classes/${classId}/reports`);
        setReports(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [classId]);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2>Class Reports</h2>
        {loading && <p>Loading reports...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-muted">No reports found for this class.</p>
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

export default ClassReports;
