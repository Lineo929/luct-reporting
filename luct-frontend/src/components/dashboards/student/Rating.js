import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Rating = () => {
  const [ratedLectures, setRatedLectures] = useState([]);
  const [unratedLectures, setUnratedLectures] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch lectures for rating
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const { data } = await api.get("/student/courses");
        // Ensure defaults
        setRatedLectures(data?.rated || []);
        setUnratedLectures(data?.unrated || []);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleRatingChange = (lectureId, value) => {
    setRatings({ ...ratings, [lectureId]: value });
  };

  const handleCommentChange = (lectureId, value) => {
    setComments({ ...comments, [lectureId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = unratedLectures.map((lec) => ({
      report_id: lec.reportId,
      rating: parseInt(ratings[lec.reportId]),
      comment: comments[lec.reportId] || "",
    }));

    if (payload.length === 0) {
      alert("No new lectures to rate.");
      return;
    }

    try {
      await api.post("/student/rating", payload);
      alert("Ratings submitted successfully!");

      // Refresh lectures after submission
      const { data } = await api.get("/student/courses");
      setRatedLectures(data?.rated || []);
      setUnratedLectures(data?.unrated || []);
      setRatings({});
      setComments({});
    } catch (err) {
      console.error("Failed to submit ratings:", err);
      alert("Failed to submit ratings.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">Loading Ratings...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h2 className="mb-4">Rate Your Lectures</h2>

      {/* Previously Rated Lectures */}
      {ratedLectures.length > 0 && (
        <>
          <h4 className="mb-3">Previously Rated Lectures</h4>
          {ratedLectures.map((lec) => (
            <div
              key={lec.reportId}
              className="mb-3 p-3 border rounded shadow-sm"
            >
              <h5>
                {lec.courseName} - {lec.lecturerName}
              </h5>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(lec.lectureDate).toLocaleDateString()} |{" "}
                <strong>Topic:</strong> {lec.topicTaught}
              </p>
              <p>
                <strong>Rating:</strong> {lec.rating} ⭐
              </p>
              {lec.comment && (
                <p>
                  <strong>Comment:</strong> {lec.comment}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* Unrated Lectures */}
      {unratedLectures.length > 0 && (
        <>
          <h4 className="mb-3 mt-4">Lectures to Rate</h4>
          <form onSubmit={handleSubmit}>
            {unratedLectures.map((lec) => (
              <div
                key={lec.reportId}
                className="mb-4 p-3 border rounded shadow-sm"
              >
                <h5>
                  {lec.courseName} - {lec.lecturerName}
                </h5>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(lec.lectureDate).toLocaleDateString()} |{" "}
                  <strong>Topic:</strong> {lec.topicTaught}
                </p>

                <label className="form-label">Rating (1 - 5)</label>
                <select
                  className="form-select mb-2"
                  value={ratings[lec.reportId] || ""}
                  onChange={(e) =>
                    handleRatingChange(lec.reportId, e.target.value)
                  }
                  required
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>

                <label className="form-label">Comment (optional)</label>
                <textarea
                  className="form-control"
                  placeholder="Add a comment"
                  value={comments[lec.reportId] || ""}
                  onChange={(e) =>
                    handleCommentChange(lec.reportId, e.target.value)
                  }
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary mt-3">
              Submit Ratings
            </button>
          </form>
        </>
      )}

      {ratedLectures.length === 0 && unratedLectures.length === 0 && (
        <p>No lectures available.</p>
      )}
    </DashboardLayout>
  );
};

export default Rating;
