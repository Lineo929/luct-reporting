// controllers/ProgramLeaderController.js
import pool from "../db/index.js"; // adjust this path if your db config is elsewhere

// 🟢 Get all courses
export const getCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.name AS stream_name
      FROM courses c
      LEFT JOIN streams s ON c.stream_id = s.id
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// 🟢 Add a new course
export const addCourse = async (req, res) => {
  try {
    const { course_name, course_code, faculty_name, stream_id } = req.body;

    if (!course_name || !course_code || !faculty_name) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const result = await pool.query(
      `INSERT INTO courses (course_name, course_code, faculty_name, stream_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [course_name, course_code, faculty_name, stream_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ message: "Failed to add course" });
  }
};

// 🟢 Assign lecturer to a course
export const assignLecturerToCourse = async (req, res) => {
  try {
    const { id } = req.params; // course id
    const { lecturer_id } = req.body;

    if (!lecturer_id) {
      return res.status(400).json({ message: "Lecturer ID is required" });
    }

    // optional: create a join table if courses ↔ lecturers is many-to-many
    // for now, let's assume one lecturer can be linked directly per course
    await pool.query(
      `UPDATE courses SET stream_id = stream_id WHERE id = $1`, [id]
    );

    // Save lecturer-course assignment to a junction table if you have one
    await pool.query(
      `INSERT INTO classes (class_name, course_id, total_registered)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [`${id}-class`, id, 0]
    );

    res.json({ message: "Lecturer assigned successfully" });
  } catch (err) {
    console.error("Error assigning lecturer:", err);
    res.status(500).json({ message: "Failed to assign lecturer" });
  }
};

// 🟢 Get all lecturers
export const getLecturers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email FROM users WHERE role = 'lecturer' ORDER BY full_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching lecturers:", err);
    res.status(500).json({ message: "Failed to fetch lecturers" });
  }
};

export const getReports = async (req, res) => {
  try {
    const { course_id, lecturer_id, week_of_reporting } = req.query;

    const conditions = [];
    const values = [];

    if (course_id) {
      values.push(course_id);
      conditions.push(`r.course_id = $${values.length}`);
    }

    if (lecturer_id) {
      values.push(lecturer_id);
      conditions.push(`r.lecturer_id = $${values.length}`);
    }

    if (week_of_reporting) {
      values.push(week_of_reporting);
      conditions.push(`r.week_of_reporting = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        r.id,
        r.week_of_reporting,
        r.lecture_date,
        r.topic_taught,
        r.learning_outcomes,
        r.lecturer_recommendations,
        r.actual_students_present,
        r.total_registered_students,
        c.course_name,
        c.course_code,
        cls.class_name,
        u.full_name AS lecturer_name,
        u.email AS lecturer_email,
        r.created_at
      FROM reports r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN classes cls ON r.class_id = cls.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(query, values);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const getAttendanceOverview = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS class_id,
        c.class_name,
        COUNT(sa.student_id) FILTER (WHERE sa.attended = true) AS present_count,
        COUNT(se.student_id) AS total_students,
        ROUND(
          100.0 * COUNT(sa.student_id) FILTER (WHERE sa.attended = true) / NULLIF(COUNT(se.student_id),0),
          1
        ) AS attendance_percentage
      FROM classes c
      LEFT JOIN student_enrollments se ON se.class_id = c.id
      LEFT JOIN student_attendance sa ON sa.report_id IN (
        SELECT r.id FROM reports r WHERE r.class_id = c.id
      ) AND sa.student_id = se.student_id
      GROUP BY c.id, c.class_name
      ORDER BY c.class_name;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance overview" });
  }
};

export const getAcademicPerformance = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.lecturer_id,
        u.full_name AS lecturer_name,
        ROUND(AVG(rt.rating)::numeric, 2) AS avg_rating,
        COUNT(rt.id) AS total_ratings
      FROM reports r
      LEFT JOIN ratings rt ON rt.report_id = r.id
      LEFT JOIN users u ON u.id = r.lecturer_id
      GROUP BY r.lecturer_id, u.full_name
      ORDER BY avg_rating DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch academic performance" });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const query = `
      -- Missing reports
      SELECT c.class_name, r.week_of_reporting
      FROM classes c
      LEFT JOIN reports r ON r.class_id = c.id
      WHERE r.id IS NULL
      UNION ALL
      -- Low attendance
      SELECT c.class_name, r.week_of_reporting
      FROM reports r
      JOIN classes c ON c.id = r.class_id
      LEFT JOIN student_enrollments se ON se.class_id = c.id
      LEFT JOIN student_attendance sa ON sa.report_id = r.id AND sa.student_id = se.student_id
      GROUP BY c.id, c.class_name, r.week_of_reporting
      HAVING (COUNT(sa.student_id) FILTER (WHERE sa.attended = true) * 100.0 / NULLIF(COUNT(se.student_id),0)) < 50;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};

export const getClasses = async (req, res) => {
  const { course } = req.query;

  try {
    let query = `
      SELECT 
        c.id,
        c.class_name,
        c.venue,
        c.scheduled_time,
        c.total_registered,
        co.course_name
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
    `;

    const params = [];
    if (course) {
      query += ` WHERE c.course_id = $1`;
      params.push(course);
    }

    query += ` ORDER BY c.class_name ASC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ message: "Error fetching classes" });
  }
};

export const getLecturerActivities = async (req, res) => {
  try {
    const { course, lecturer } = req.query;

    let query = `
      SELECT 
        u.id AS lecturer_id,
        u.full_name AS lecturer_name,
        c.course_name,
        cl.class_name,
        r.week_of_reporting,
        r.lecture_date,
        r.topic_taught
      FROM users u
      JOIN reports r ON r.lecturer_id = u.id
      LEFT JOIN courses c ON c.id = r.course_id
      LEFT JOIN classes cl ON cl.id = r.class_id
      WHERE u.role = 'lecturer'
    `;

    const params = [];
    if (course) {
      params.push(course);
      query += ` AND c.id = $${params.length}`;
    }
    if (lecturer) {
      params.push(lecturer);
      query += ` AND u.id = $${params.length}`;
    }

    query += ` ORDER BY r.week_of_reporting DESC, r.lecture_date DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching lecturer activities:", error);
    res.status(500).json({ message: "Error fetching lecturer activities" });
  }
};
export const getLecturerRatings = async (req, res) => {
  try {
    const { lecturer, course } = req.query;

    let query = `
      SELECT 
        r.id AS rating_id,
        u.id AS lecturer_id,
        u.full_name AS lecturer_name,
        c.course_name,
        rp.week_of_reporting,
        rp.lecture_date,
        r.rating,
        r.comment
      FROM ratings r
      JOIN reports rp ON rp.id = r.report_id
      JOIN users u ON u.id = rp.lecturer_id
      LEFT JOIN courses c ON c.id = rp.course_id
      WHERE u.role = 'lecturer'
    `;

    const params = [];
    if (lecturer) {
      params.push(lecturer);
      query += ` AND u.id = $${params.length}`;
    }
    if (course) {
      params.push(course);
      query += ` AND c.id = $${params.length}`;
    }

    query += ` ORDER BY rp.week_of_reporting DESC, rp.lecture_date DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching lecturer ratings:", error);
    res.status(500).json({ message: "Error fetching lecturer ratings" });
  }
};