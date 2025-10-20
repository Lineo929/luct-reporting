import pool from "../db/index.js";

export const getCourses = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, course_name, course_code FROM courses ORDER BY course_name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Error fetching courses" });
  }
};