// controllers/ratingController.js
import pool from "../db/index.js";

// ==============================
// Create new rating (Lecturer Rating Page)
// ==============================
export const createRating = async (req, res) => {
  try {
    const { report_id, rating, comment } = req.body;
    const user_id = req.user.id; // from JWT middleware

    if (!report_id || !rating) {
      return res.status(400).json({ message: "Report ID and rating are required" });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, report_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, report_id, rating, comment || null]
    );

    res.status(201).json({
      message: "Rating submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Get all ratings for lecturer's reports
// ==============================
export const getRatingsByLecturer = async (req, res) => {
  try {
    const lecturer_id = req.user.id;

    const result = await pool.query(
      `
      SELECT r.id as report_id, rt.id as rating_id, rt.rating, rt.comment, u.full_name AS rated_by, rt.created_at
      FROM ratings rt
      JOIN reports r ON rt.report_id = r.id
      JOIN users u ON rt.user_id = u.id
      WHERE r.lecturer_id = $1
      ORDER BY rt.created_at DESC;
      `,
      [lecturer_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Get average rating per report
// ==============================
export const getAverageRatingByReport = async (req, res) => {
  try {
    const { report_id } = req.params;

    const result = await pool.query(
      `
      SELECT AVG(rating)::numeric(10,2) AS average_rating, COUNT(*) AS total_ratings
      FROM ratings
      WHERE report_id = $1
      `,
      [report_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
