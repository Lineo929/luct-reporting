import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({});
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/prl/courses");
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        alert("Error fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Fetch feedback for a specific report
  const fetchFeedback = async (reportId) => {
    try {
      const { data } = await api.get(`/prl/reports/${reportId}/feedback`);
      if (data.length > 0) {
        setFeedbacks((prev) => ({ ...prev, [reportId]: data[0].feedback_text }));
      }
    } catch (err) {
      console.error(`Failed to fetch feedback for report ${reportId}:`, err);
    }
  };

  // ✅ Submit feedback
  const handleSubmitFeedback = async (reportId) => {
    const feedbackText = feedbacks[reportId];
    if (!feedbackText || feedbackText.trim() === "") {
      alert("Please enter feedback before submitting.");
      return;
    }

    try {
      setSubmitting(reportId);
      await api.post(`/prl/reports/${reportId}/feedback`, {
        feedback_text: feedbackText,
      });
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Error submitting feedback.");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">Loading courses...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h2 className="mb-4">Courses & Lectures</h2>
      {courses.length === 0 && <p>No courses available for your stream.</p>}

      {courses.map((course) => (
        <div key={course.course_id} className="card mb-3 shadow-sm p-3">
          <h4>
            {course.course_name} ({course.course_code})
          </h4>

          {course.classes && course.classes.length > 0 ? (
            course.classes.map((cls) => (
              <div key={cls.class_id} className="mb-4">
                <h5 className="mt-3">Class: {cls.class_name}</h5>
                {cls.lectures && cls.lectures.length > 0 ? (
                  <table className="table table-sm table-striped mt-2">
                    <thead>
                      <tr>
                        <th>Lecture Topic</th>
                        <th>Date</th>
                        <th>Lecturer</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.lectures.map((lec) => (
                        <tr key={lec.report_id}>
                          <td>{lec.topic_taught}</td>
                          <td>
                            {new Date(lec.lecture_date).toLocaleDateString()}
                          </td>
                          <td>{lec.lecturer_name}</td>
                          <td>
                            <textarea
                              className="form-control mb-2"
                              placeholder="Write feedback..."
                              rows="2"
                              value={feedbacks[lec.report_id] || ""}
                              onChange={(e) =>
                                setFeedbacks((prev) => ({
                                  ...prev,
                                  [lec.report_id]: e.target.value,
                                }))
                              }
                              onFocus={() => fetchFeedback(lec.report_id)}
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={submitting === lec.report_id}
                              onClick={() => handleSubmitFeedback(lec.report_id)}
                            >
                              {submitting === lec.report_id
                                ? "Submitting..."
                                : "Submit"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">
                    No lectures assigned to this class yet.
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted">No classes assigned to this course yet.</p>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
};

export default Courses;
