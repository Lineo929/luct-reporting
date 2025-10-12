import pool from "../db/index.js";

// GET /lecturer/classes
export const getClasses = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    const query = `
      SELECT c.id, c.class_name AS "className", c.total_registered AS "totalRegistered",
             c.venue, c.scheduled_time AS "scheduledTime", co.course_name AS "courseName"
      FROM classes c
      JOIN courses co ON c.course_id = co.id
      WHERE c.id IN (
        SELECT class_id FROM reports WHERE lecturer_id=$1
      )
      ORDER BY c.class_name
    `;
    const { rows } = await pool.query(query, [lecturerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /lecturer/reports
export const submitReport = async (req, res) => {
  try {
    const {
      facultyName,
      className,
      week,
      date,
      courseName,
      courseCode,
      lecturerName,
      actualStudentsPresent,
      totalRegisteredStudents,
      venue,
      scheduledTime,
      topicTaught,
      learningOutcomes,
      recommendations,
    } = req.body;

    // Fetch course_id & class_id dynamically (recommended)
    const courseResult = await pool.query(
      "SELECT id FROM courses WHERE course_code = $1 LIMIT 1",
      [courseCode]
    );
    const courseId = courseResult.rows[0]?.id || null;

    const classResult = await pool.query(
      "SELECT id FROM classes WHERE class_name = $1 LIMIT 1",
      [className]
    );
    const classId = classResult.rows[0]?.id || null;

    // Insert report
    await pool.query(
      `INSERT INTO reports (
        lecturer_id,
        course_id,
        class_id,
        week_of_reporting,
        lecture_date,
        topic_taught,
        learning_outcomes,
        lecturer_recommendations,
        actual_students_present,
        total_registered_students
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        req.user.id, // lecturer from JWT
        courseId,
        classId,
        parseInt(week),
        date,
        topicTaught,
        learningOutcomes,
        recommendations,
        parseInt(actualStudentsPresent),
        parseInt(totalRegisteredStudents),
      ]
    );

    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

// GET /lecturer/monitoring
export const getMonitoring = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    const query = `
      SELECT r.id AS "reportId", r.week_of_reporting AS week, r.lecture_date AS "lectureDate",
             r.topic_taught AS "topicTaught", r.actual_students_present AS "actualStudentsPresent",
             r.total_registered_students AS "totalRegisteredStudents",
             c.class_name AS "className", co.course_name AS "courseName"
      FROM reports r
      JOIN classes c ON r.class_id = c.id
      JOIN courses co ON r.course_id = co.id
      WHERE r.lecturer_id = $1
      ORDER BY r.lecture_date DESC
    `;
    const { rows } = await pool.query(query, [lecturerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
