import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const Monitoring = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ course: "", week: "" });

  useEffect(() => {
    fetchMonitoringData();
    fetchPerformanceData();
    fetchAlerts();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const response = await api.get("/pl/monitoring/attendance", { params: filters });
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await api.get("/pl/monitoring/performance");
      setPerformanceData(response.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/pl/monitoring/alerts");
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const calculateAttendancePercent = (present, total) => {
    if (!present || !total) return 0;
    return ((present / total) * 100).toFixed(1);
  };

  // Attendance chart
  const attendanceChart = {
    labels: attendanceData.map(a => a.class_name),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map(a => calculateAttendancePercent(a.actual_students_present, a.total_registered_students)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Performance chart
  const performanceChart = {
    labels: performanceData.map(p => p.lecturer_name),
    datasets: [
      {
        label: "Average Rating",
        data: performanceData.map(p => p.avg_rating),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Monitoring</h2>
            <p className="text-muted mb-0">
              Monitor academic progress, attendance, and alerts across your program.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 p-3">
          <div className="d-flex flex-wrap gap-2">
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Courses</option>
              {/* TODO: dynamically map courses */}
            </select>

            <select
              value={filters.week}
              onChange={(e) => setFilters({ ...filters, week: e.target.value })}
              className="form-select w-auto"
            >
              <option value="">All Weeks</option>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={fetchMonitoringData}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="card mb-4 shadow-sm p-3">
          <h5 className="card-title fw-semibold">Attendance Overview</h5>
          {attendanceData.length > 0 ? (
            <Bar data={attendanceChart} />
          ) : (
            <p className="text-muted text-center py-4">No attendance data available</p>
          )}
        </div>

        {/* Academic Performance */}
        <div className="card mb-4 shadow-sm p-3">
          <h5 className="card-title fw-semibold">Academic Performance</h5>
          {performanceData.length > 0 ? (
            <Bar data={performanceChart} />
          ) : (
            <p className="text-muted text-center py-4">No performance data available</p>
          )}
        </div>

        {/* Alerts */}
        <div className="card mb-4 shadow-sm p-3">
          <h5 className="card-title fw-semibold">Alerts & Notifications</h5>
          {alerts.length > 0 ? (
            <ul className="list-group list-group-flush">
              {alerts.map((a, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>{a.class_name}</strong> — {a.week_of_reporting ? `Week ${a.week_of_reporting}` : ""} 
                  {a.alert_type ? `: ${a.alert_type}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center py-4">No alerts</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Monitoring;
