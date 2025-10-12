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

const COLORS = ["#0088FE", "#FF8042"]; // Attended / Missed

const Monitoring = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const { data } = await api.get("/student/monitoring");
        // Normalize attended: null remains null, true/false as Boolean
        const normalized = data.map((lec) => ({
          ...lec,
          attended: lec.attended === null ? null : Boolean(lec.attended),
        }));
        setLectures(normalized);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleAttendanceToggle = async (lectureId, attended) => {
    try {
      await api.patch("/student/attendance", { reportId: lectureId, attended });
      setLectures((prev) =>
        prev.map((lec) =>
          lec.id === lectureId ? { ...lec, attended } : lec
        )
      );
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-5">Loading Stats...</div>
      </DashboardLayout>
    );
  }

  // Filter only lectures that have been marked for chart
  const markedLectures = lectures.filter((lec) => lec.attended !== null);

  const chartData = markedLectures.map((lec, index) => ({
    name: lec.className,
    attended: lec.attended ? 1 : 0,
    missed: lec.attended ? 0 : 1,
    week: index + 1,
  }));

  const totalAttended = chartData.reduce((sum, lec) => sum + lec.attended, 0);
  const totalMissed = chartData.reduce((sum, lec) => sum + lec.missed, 0);
  const pieData = [
    { name: "Attended", value: totalAttended },
    { name: "Missed", value: totalMissed },
  ];

  return (
    <DashboardLayout>
      <h2 className="mb-4">My Attendance</h2>

      {/* Attendance Table */}
      <div className="table-responsive mb-5">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Class Name</th>
              <th>Date</th>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Status</th>
              <th>Topic</th>
            </tr>
          </thead>
          <tbody>
            {lectures.length > 0 ? (
              lectures.map((lec) => (
                <tr key={lec.id}>
                  <td>{lec.className}</td>
                  <td>{new Date(lec.date).toLocaleDateString()}</td>
                  <td>{lec.courseName}</td>
                  <td>{lec.lecturerName}</td>
                  <td>
                    {lec.attended === null ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAttendanceToggle(lec.id, true)}
                        >
                          Present
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAttendanceToggle(lec.id, false)}
                        >
                          Absent
                        </button>
                      </div>
                    ) : lec.attended ? (
                      <span className="text-success">Present</span>
                    ) : (
                      <span className="text-danger">Absent</span>
                    )}
                  </td>
                  <td>{lec.topicTaught}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No lectures found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <h4 className="mb-3">Weekly Attendance</h4>
      {markedLectures.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" label={{ value: "Week", position: "insideBottomRight", offset: -5 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="attended" fill="#0088FE" name="Attended" />
            <Bar dataKey="missed" fill="#FF8042" name="Missed" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted">No attendance data to display yet.</p>
      )}

      {/* Pie Chart */}
      <h4 className="mt-5 mb-3">Attendance Summary</h4>
      {markedLectures.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted">No attendance summary available yet.</p>
      )}
    </DashboardLayout>
  );
};

export default Monitoring;
