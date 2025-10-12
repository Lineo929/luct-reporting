import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Enrollments = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available classes and student's current enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const [availableRes, enrolledRes] = await Promise.all([
        api.get("/student/classes/available"),
        api.get("/student/classes/enrollments"),
      ]);
      setAvailableClasses(availableRes.data);
      setMyEnrollments(enrolledRes.data);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleEnroll = async (classId) => {
    try {
      await api.post("/student/classes/enroll", { classId });
      const enrolledClass = availableClasses.find((c) => c.classId === classId);
      setMyEnrollments((prev) => [...prev, enrolledClass]);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Failed to enroll. Try again.");
    }
  };

  const handleUnenroll = async (classId) => {
    try {
      await api.delete(`/student/classes/unenroll/${classId}`);
      setMyEnrollments((prev) => prev.filter((c) => c.classId !== classId));
    } catch (err) {
      console.error("Unenroll failed:", err);
      alert("Failed to unenroll. Try again.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-5">Loading Enrollments...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">My Enrollments</h2>

      <h4 className="mb-3">Enrolled Classes</h4>
      {myEnrollments.length > 0 ? (
        <ul className="list-group mb-4">
          {myEnrollments.map((c) => (
            <li
              key={c.classId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {c.courseName} - {c.className} ({c.venue} | {c.scheduled_time})
              </span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleUnenroll(c.classId)}
              >
                Unenroll
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No enrolled classes.</p>
      )}

      <h4 className="mb-3">Available Classes</h4>
      {availableClasses.length > 0 ? (
        <ul className="list-group">
          {availableClasses.map((c) => {
            const isEnrolled = myEnrollments.some((m) => m.classId === c.classId);
            return (
              <li
                key={c.classId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {c.courseName} - {c.className} ({c.venue} | {c.scheduled_time})
                </span>
                <button
                  className={`btn btn-sm ${isEnrolled ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => !isEnrolled && handleEnroll(c.classId)}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? "Enrolled" : "Enroll"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No available classes at the moment.</p>
      )}
    </DashboardLayout>
  );
};

export default Enrollments;
