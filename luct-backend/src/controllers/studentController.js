import pool from "../db/index.js";

// -------------------- MONITORING --------------------
export const getMonitoring = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    const query = `
      SELECT
        r.id AS id,
        COALESCE(cls.class_name, '') AS "className",
        r.lecture_date::text AS date,
        COALESCE(c.course_name, '') AS "courseName",
        COALESCE(u.full_name, '') AS "lecturerName",
        r.topic_taught AS "topicTaught",
        sa.attended AS attended,
        r.actual_students_present,
        r.total_registered_students
      FROM reports r
      INNER JOIN student_enrollments se ON se.class_id = r.class_id AND se.student_id = $1
      LEFT JOIN classes cls ON r.class_id = cls.id
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      LEFT JOIN student_attendance sa 
        ON sa.report_id = r.id AND sa.student_id = $1
      ORDER BY r.lecture_date DESC;
    `;

    const { rows } = await pool.query(query, [studentId]);

    const normalized = rows.map((lec) => ({
      ...lec,
      attended: lec.attended === null ? null : Boolean(lec.attended),
    }));

    return res.json(normalized);
  } catch (err) {
    console.error("getMonitoring error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ATTENDANCE --------------------
export const markAttendance = async (req, res) => {
  const studentId = req.user?.id;
  const { reportId, attended } = req.body;

  if (!studentId) return res.status(401).json({ message: "Unauthorized" });
  if (!reportId || attended === undefined)
    return res.status(400).json({ message: "Report ID and attended status required" });

  try {
    await pool.query(`
      INSERT INTO student_attendance (student_id, report_id, attended, created_at)
      SELECT $1, $2, $3, NOW()
      WHERE EXISTS (
        SELECT 1 FROM student_enrollments se
        INNER JOIN reports r ON r.class_id = se.class_id
        WHERE se.student_id = $1 AND r.id = $2
      )
      ON CONFLICT (student_id, report_id)
      DO UPDATE SET attended = EXCLUDED.attended, created_at = NOW();
    `, [studentId, reportId, attended]);

    return res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    console.error("markAttendance error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- RATINGS --------------------
export const getCoursesForRating = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    const query = `
      SELECT
        r.id AS "reportId",
        c.course_name AS "courseName",
        u.full_name AS "lecturerName",
        r.lecture_date AS "lectureDate",
        r.topic_taught AS "topicTaught",
        rt.rating AS "rating",
        rt.comment AS "comment"
      FROM reports r
      INNER JOIN student_enrollments se ON se.class_id = r.class_id AND se.student_id = $1
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      LEFT JOIN ratings rt ON rt.report_id = r.id AND rt.user_id = $1
      ORDER BY r.lecture_date DESC
      LIMIT 50;
    `;

    const { rows } = await pool.query(query, [studentId]);

    // Separate into rated and unrated lectures
    const rated = [];
    const unrated = [];
    rows.forEach((lec) => {
      const normalized = { ...lec, rating: lec.rating ?? null, comment: lec.comment ?? "" };
      if (lec.rating !== null) rated.push(normalized);
      else unrated.push(normalized);
    });

    return res.json({ rated, unrated });
  } catch (err) {
    console.error("getCoursesForRating error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitRating = async (req, res) => {
  const studentId = req.user?.id;
  if (!studentId) return res.status(401).json({ message: "Unauthorized" });

  const ratings = req.body;
  if (!Array.isArray(ratings) || ratings.length === 0)
    return res.status(400).json({ message: "Invalid payload" });

  try {
    await pool.query("BEGIN");

    for (const r of ratings) {
      const { report_id, rating, comment } = r;
      const rate = parseInt(rating, 10);

      if (isNaN(rate) || rate < 1 || rate > 5) {
        await pool.query("ROLLBACK");
        return res.status(400).json({ message: "Rating must be 1-5" });
      }

      await pool.query(`
        INSERT INTO ratings (user_id, report_id, rating, comment, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, report_id)
        DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = NOW();
      `, [studentId, report_id, rate, comment || null]);
    }

    await pool.query("COMMIT");
    return res.json({ message: "Ratings saved" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("submitRating error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ENROLLMENTS --------------------
export const getAvailableClasses = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        cls.id AS "classId",
        cls.class_name AS "className",
        c.course_name AS "courseName",
        cls.venue,
        cls.scheduled_time
      FROM classes cls
      JOIN courses c ON cls.course_id = c.id
      ORDER BY c.course_name ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAvailableClasses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    const { rows } = await pool.query(`
      SELECT 
        se.class_id AS "classId",
        cls.class_name AS "className",
        c.course_name AS "courseName",
        cls.venue,
        cls.scheduled_time
      FROM student_enrollments se
      JOIN classes cls ON se.class_id = cls.id
      JOIN courses c ON cls.course_id = c.id
      WHERE se.student_id = $1;
    `, [studentId]);
    res.json(rows);
  } catch (err) {
    console.error("getMyEnrollments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const enrollInClass = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { classId } = req.body;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });
    if (!classId) return res.status(400).json({ message: "Class ID required" });

    await pool.query(`
      INSERT INTO student_enrollments (student_id, class_id)
      VALUES ($1, $2)
      ON CONFLICT (student_id, class_id) DO NOTHING;
    `, [studentId, classId]);

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("enrollInClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unenrollFromClass = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { classId } = req.params;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    await pool.query(`
      DELETE FROM student_enrollments
      WHERE student_id = $1 AND class_id = $2;
    `, [studentId, classId]);

    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    console.error("unenrollFromClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
