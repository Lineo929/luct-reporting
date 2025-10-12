import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Monitoring = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/lecturer/monitoring");
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch monitoring data:", err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <DashboardLayout>
      <h2>Monitoring</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Class</th>
            <th>Date</th>
            <th>Course</th>
            <th>Students Present</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.className}</td>
                <td>{cls.date}</td>
                <td>{cls.courseName}</td>
                <td>{cls.actualStudentsPresent}/{cls.totalRegisteredStudents}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default Monitoring;
