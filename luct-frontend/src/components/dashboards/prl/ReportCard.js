// src/components/dashboards/PRL/ReportCard.jsx
import React, { useState } from "react";
import api from "../../../services/api";

const ReportCard = ({ report }) => {
  const [feedback, setFeedback] = useState(report.prl_feedback || "");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!feedback) return alert("Feedback cannot be empty.");
    try {
      setLoading(true);
      await api.post(`/prl/reports/${report.report_id}/feedback`, {
        feedback_text: feedback,
      });
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        {new Date(report.lecture_date).toLocaleDateString()} -{" "}
        {report.class_name}
      </div>
      <div className="card-body">
        <p>
          <strong>Course:</strong> {report.course_name}
        </p>
        <p>
          <strong>Lecturer:</strong> {report.lecturer_name}
        </p>
        <p>
          <strong>Topic:</strong> {report.topic_taught}
        </p>
        <p>
          <strong>Students Present:</strong>{" "}
          {report.actual_students_present ?? "N/A"}
        </p>
        <p>
          <strong>Total Registered:</strong>{" "}
          {report.total_registered_students ?? "N/A"}
        </p>
        <p>
          <strong>Learning Outcomes:</strong>{" "}
          {report.learning_outcomes || "N/A"}
        </p>
        <p>
          <strong>Lecturer Recommendations:</strong>{" "}
          {report.lecturer_recommendations || "N/A"}
        </p>

        <div className="mt-3">
          <textarea
            className="form-control mb-2"
            rows="3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback..."
          />
          <button
            className="btn btn-success btn-sm"
            disabled={loading}
            onClick={submitFeedback}
          >
            {report.prl_feedback ? "Update Feedback" : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
