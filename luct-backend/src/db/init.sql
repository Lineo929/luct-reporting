CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'prl', 'pl')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    stream VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(150) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    total_registered INTEGER DEFAULT 0,
    venue VARCHAR(100),
    scheduled_time VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    lecturer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    week_of_reporting INTEGER NOT NULL,
    lecture_date DATE NOT NULL,
    topic_taught TEXT NOT NULL,
    learning_outcomes TEXT,
    lecturer_recommendations TEXT,
    actual_students_present INTEGER,
    total_registered_students INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_feedback (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    prl_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, class_id)
);

CREATE TABLE IF NOT EXISTS student_attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  attended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, report_id)
);
