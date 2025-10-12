import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Classes = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/lecturer/classes");
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <DashboardLayout>
      <h2>My Classes</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Course</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Scheduled Time</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.className}</td>
                <td>{cls.courseName}</td>
                <td>{cls.date}</td>
                <td>{cls.venue}</td>
                <td>{cls.scheduledTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No classes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default Classes;
