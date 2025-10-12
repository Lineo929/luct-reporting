// src/components/dashboards/lecturer/Rating.js
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const LecturerRating = () => {
  const [ratings, setRatings] = useState([]);
  const [averages, setAverages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Get all ratings for lecturer
        const res = await api.get("/ratings/lecturer");
        setRatings(res.data);

        // Calculate average rating per report
        const reportIds = [...new Set(res.data.map(r => r.report_id))];
        const avgObj = {};
        for (let id of reportIds) {
          const avgRes = await api.get(`/ratings/${id}/average`);
          avgObj[id] = avgRes.data.average_rating;
        }
        setAverages(avgObj);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return (
          <DashboardLayout>
            <div className="text-center mt-5">
              Loading ratings...
            </div>
          </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mt-5">
        <h2 className="mb-4 text-primary">Lecturer Ratings</h2>
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Report ID</th>
              <th>Rated By</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Average Rating</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length > 0 ? (
              ratings.map((r) => (
                <tr key={r.rating_id}>
                  <td>{r.report_id}</td>
                  <td>{r.rated_by}</td>
                  <td>{r.rating}</td>
                  <td>{r.comment || "N/A"}</td>
                  <td>{averages[r.report_id] || "N/A"}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No ratings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default LecturerRating;
