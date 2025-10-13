// src/components/dashboards/PRL/Monitoring.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6F91"];

const Monitoring = () => {
  const [lecturerPerformance, setLecturerPerformance] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        const response = await api.get("/prl/monitoring");
        // Ensure numerical values
        const formattedAttendance = response.data.attendance.map((a) => ({
          ...a,
          percentage: Number(a.percentage),
        }));

        const formattedPerformance = response.data.lecturerPerformance.map((l) => ({
          ...l,
          average_rating: Number(l.average_rating),
        }));

        setLecturerPerformance(formattedPerformance);
        setAttendanceData(formattedAttendance);
      } catch (err) {
        console.error(err);
        setError("Failed to load monitoring data.");
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoringData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="mb-2">Monitoring</h2>
        <p className="text-muted mb-4">
          Track lecturer performance and attendance records.
        </p>

        {loading && <p>Loading monitoring data...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="row">
            {/* Lecturer Performance Bar Chart */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white">
                  Lecturer Performance (Average Ratings)
                </div>
                <div className="card-body">
                  {lecturerPerformance.length === 0 ? (
                    <p className="text-muted">No data available.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={lecturerPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lecturer_name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="average_rating" fill="#007bff" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Pie Chart */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-success text-white">
                  Attendance Overview
                </div>
                <div className="card-body d-flex justify-content-center align-items-center">
                  {attendanceData.length === 0 ? (
                    <p className="text-muted">No data available.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={attendanceData}
                          dataKey="percentage"
                          nameKey="class_name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {attendanceData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Monitoring;
