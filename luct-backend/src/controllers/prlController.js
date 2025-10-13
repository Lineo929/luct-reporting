// src/controllers/prlController.js
import pool from "../db/index.js";

// -------------------- COURSES --------------------
// GET /api/prl/courses
export const getPRLCourses = async (req, res) => {
  try {
    const { id } = req.user; // PRL user's ID

    const result = await pool.query(
      `
      SELECT 
        c.id AS course_id,
        c.course_name,
        c.course_code,
        COALESCE(
          json_agg(
            json_build_object(
              'class_id', cl.id,
              'class_name', cl.class_name,
              'venue', cl.venue,
              'scheduled_time', cl.scheduled_time,
              'lectures', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'report_id', r.id,
                      'topic_taught', r.topic_taught,
                      'lecture_date', r.lecture_date,
                      'week_of_reporting', r.week_of_reporting,
                      'lecturer_name', u.full_name
                    )
                    ORDER BY r.lecture_date DESC
                  )
                  FROM reports r
                  JOIN users u ON r.lecturer_id = u.id
                  WHERE r.class_id = cl.id
                ),
                '[]'::json
              )
            )
          ) FILTER (WHERE cl.id IS NOT NULL),
          '[]'::json
        ) AS classes
      FROM courses c
      LEFT JOIN classes cl ON cl.course_id = c.id
      WHERE c.stream_id = (
        SELECT stream_id FROM users WHERE id = $1
      )
      GROUP BY c.id
      ORDER BY c.course_name
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getPRLCourses error:", err);
    res.status(500).json({ error: "Failed to fetch PRL courses" });
  }
};

// -------------------- REPORT FEEDBACK --------------------
// GET /api/prl/reports/:reportId/feedback
export const getPRLReportFeedback = async (req, res) => {
  try {
    const prlId = req.user?.id;
    const { reportId } = req.params;

    if (!prlId) return res.status(401).json({ message: "Unauthorized" });

    const { rows } = await pool.query(
      `SELECT * FROM report_feedback WHERE report_id = $1 AND prl_id = $2`,
      [reportId, prlId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getPRLReportFeedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/prl/reports/:reportId/feedback
export const submitPRLFeedback = async (req, res) => {
  try {
    const prlId = req.user?.id;
    const { reportId } = req.params;
    const { feedback_text } = req.body;

    if (!prlId) return res.status(401).json({ message: "Unauthorized" });
    if (!feedback_text)
      return res.status(400).json({ message: "Feedback text is required" });

    // If you want to prevent duplicates, use a unique constraint on (report_id, prl_id)
    // Otherwise, this plain insert will work fine:
    await pool.query(
      `
      INSERT INTO report_feedback (report_id, prl_id, feedback_text, created_at)
      VALUES ($1, $2, $3, NOW())
      `,
      [reportId, prlId, feedback_text]
    );

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("submitPRLFeedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPRLClasses = async (req, res) => {
  try {
    const prlId = req.user?.id;
    if (!prlId) return res.status(401).json({ message: "Unauthorized" });

    const { rows } = await pool.query(
      `
      SELECT 
        cl.id,
        cl.class_name,
        cl.venue,
        cl.scheduled_time,
        cl.total_registered,
        c.course_name,
        c.course_code,
        COALESCE(
          json_agg(DISTINCT u.full_name) FILTER (WHERE u.id IS NOT NULL), '[]'
        ) AS lecturers
      FROM classes cl
      LEFT JOIN courses c ON cl.course_id = c.id
      LEFT JOIN reports r ON r.class_id = cl.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      WHERE c.stream_id = (
        SELECT stream_id FROM users WHERE id = $1
      )
      GROUP BY cl.id, c.course_name, c.course_code
      ORDER BY cl.class_name
      `,
      [prlId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getPRLClasses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPRLClassReports = async (req, res) => {
  try {
    const prlId = req.user.id;
    const { classId } = req.params;

    const { rows } = await pool.query(`
      SELECT 
        r.id AS report_id,
        r.lecture_date,
        r.topic_taught,
        r.actual_students_present,
        r.total_registered_students,
        r.learning_outcomes,
        r.lecturer_recommendations,
        u.full_name AS lecturer_name,
        -- Get PRL feedback for this report by this PRL
        rf.feedback_text AS prl_feedback
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      LEFT JOIN report_feedback rf
        ON rf.report_id = r.id AND rf.prl_id = $1
      WHERE r.class_id = $2
      ORDER BY r.lecture_date DESC
    `, [prlId, classId]);

    res.json(rows);
  } catch (err) {
    console.error("getPRLClassReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPRLReports = async (req, res) => {
  try {
    const prlId = req.user.id;

    // 1. Get reports for classes under the PRL's stream
    const { rows } = await pool.query(`
      SELECT
        r.id AS report_id,
        r.lecture_date,
        r.topic_taught,
        r.actual_students_present,
        r.total_registered_students,
        r.learning_outcomes,
        r.lecturer_recommendations,
        c.id AS class_id,
        c.class_name,
        co.id AS course_id,
        co.course_name,
        u.full_name AS lecturer_name,
        rf.feedback_text AS prl_feedback
      FROM reports r
      JOIN classes c ON r.class_id = c.id
      JOIN courses co ON r.course_id = co.id
      JOIN users u ON r.lecturer_id = u.id
      LEFT JOIN report_feedback rf
        ON rf.report_id = r.id AND rf.prl_id = $1
      WHERE co.stream_id = (SELECT stream_id FROM users WHERE id = $1)
      ORDER BY r.lecture_date DESC
    `, [prlId]);

    res.json(rows);
  } catch (err) {
    console.error("getAllPRLReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/prl/monitoring
export const getPRLMonitoring = async (req, res) => {
  try {
    const prlId = req.user?.id;
    if (!prlId) return res.status(401).json({ message: "Unauthorized" });

    // 1️⃣ Get the stream ID of the PRL
    const streamResult = await pool.query(
      `SELECT stream_id FROM users WHERE id = $1`,
      [prlId]
    );
    const streamId = streamResult.rows[0]?.stream_id;
    if (!streamId) return res.status(404).json({ message: "Stream not found" });

    // 2️⃣ Lecturer Performance: Average ratings per lecturer under this stream
    const lecturerPerformanceResult = await pool.query(
      `
      SELECT u.full_name AS lecturer_name,
             ROUND(AVG(r.rating)::numeric, 2) AS average_rating
      FROM users u
      JOIN reports rep ON rep.lecturer_id = u.id
      LEFT JOIN ratings r ON r.report_id = rep.id
      JOIN classes cl ON cl.id = rep.class_id
      WHERE u.role = 'lecturer' AND cl.course_id IN (
        SELECT id FROM courses WHERE stream_id = $1
      )
      GROUP BY u.full_name
      ORDER BY average_rating DESC
      `,
      [streamId]
    );

    // 3️⃣ Attendance: Calculate % of students present per class
    const attendanceResult = await pool.query(
      `
      SELECT cl.class_name,
             CASE
               WHEN SUM(rep.total_registered_students) = 0 THEN 0
               ELSE ROUND(SUM(rep.actual_students_present)::numeric / SUM(rep.total_registered_students) * 100, 2)
             END AS percentage
      FROM classes cl
      JOIN reports rep ON rep.class_id = cl.id
      WHERE cl.course_id IN (
        SELECT id FROM courses WHERE stream_id = $1
      )
      GROUP BY cl.class_name
      ORDER BY cl.class_name
      `,
      [streamId]
    );

    res.json({
      lecturerPerformance: lecturerPerformanceResult.rows,
      attendance: attendanceResult.rows,
    });
  } catch (err) {
    console.error("getPRLMonitoring error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
