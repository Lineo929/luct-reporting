import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState({
    course_name: "",
    course_code: "",
    faculty_name: "",
    stream_id: "",
  });
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch courses & lecturers
  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/pl/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await api.get("/pl/lecturers");
      setLecturers(res.data);
    } catch (err) {
      console.error("Error fetching lecturers:", err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pl/courses", form);
      setForm({ course_name: "", course_code: "", faculty_name: "", stream_id: "" });
      fetchCourses();
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const handleAssignLecturer = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/pl/courses/${selectedCourse}/assign`, {
        lecturer_id: selectedLecturer,
      });
      setSelectedLecturer("");
      setSelectedCourse("");
      fetchCourses();
    } catch (err) {
      console.error("Error assigning lecturer:", err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="mb-4">Courses Management</h2>

      {/* Add Course Form */}
      <div className="card p-3 mb-4">
        <h5>Add New Course</h5>
        <form onSubmit={handleAddCourse} className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Course Name"
              className="form-control"
              value={form.course_name}
              onChange={(e) => setForm({ ...form, course_name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Course Code"
              className="form-control"
              value={form.course_code}
              onChange={(e) => setForm({ ...form, course_code: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Faculty Name"
              className="form-control"
              value={form.faculty_name}
              onChange={(e) => setForm({ ...form, faculty_name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              placeholder="Stream ID"
              className="form-control"
              value={form.stream_id}
              onChange={(e) => setForm({ ...form, stream_id: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Assign Lecturer */}
      <div className="card p-3 mb-4">
        <h5>Assign Lecturer to Course</h5>
        <form onSubmit={handleAssignLecturer} className="row g-2">
          <div className="col-md-5">
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
              required
            >
              <option value="">Select Lecturer</option>
              {lecturers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">
              Assign
            </button>
          </div>
        </form>
      </div>

      {/* Display Courses */}
      <div className="card p-3">
        <h5>Existing Courses</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Code</th>
              <th>Faculty</th>
              <th>Stream ID</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.course_name}</td>
                <td>{course.course_code}</td>
                <td>{course.faculty_name}</td>
                <td>{course.stream_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
