import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import api from "../../../services/api";

const Reports = () => {
  const [form, setForm] = useState({
    facultyName: "",
    className: "",
    week: "",
    date: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    actualStudentsPresent: "",
    totalRegisteredStudents: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    recommendations: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/lecturer/reports", form);
      alert("Report submitted successfully!");
      setForm({ ...form, actualStudentsPresent: "", topicTaught: "", learningOutcomes: "", recommendations: "" }); // reset some fields
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("Failed to submit report.");
    }
  };

  return (
    <DashboardLayout>
      <h2>Add Lecture Report</h2>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Faculty Name</label>
            <input type="text" name="facultyName" className="form-control" onChange={handleChange} value={form.facultyName} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Class Name</label>
            <input type="text" name="className" className="form-control" onChange={handleChange} value={form.className} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Week of Reporting</label>
            <input type="text" name="week" className="form-control" onChange={handleChange} value={form.week} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Date of Lecture</label>
            <input type="date" name="date" className="form-control" onChange={handleChange} value={form.date} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Course Name</label>
            <input type="text" name="courseName" className="form-control" onChange={handleChange} value={form.courseName} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Course Code</label>
            <input type="text" name="courseCode" className="form-control" onChange={handleChange} value={form.courseCode} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Lecturer Name</label>
            <input type="text" name="lecturerName" className="form-control" onChange={handleChange} value={form.lecturerName} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Actual Students Present</label>
            <input type="number" name="actualStudentsPresent" className="form-control" onChange={handleChange} value={form.actualStudentsPresent} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Total Registered Students</label>
            <input type="number" name="totalRegisteredStudents" className="form-control" onChange={handleChange} value={form.totalRegisteredStudents} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Venue</label>
            <input type="text" name="venue" className="form-control" onChange={handleChange} value={form.venue} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Scheduled Time</label>
            <input type="time" name="scheduledTime" className="form-control" onChange={handleChange} value={form.scheduledTime} required />
          </div>
        </div>

        <div className="mb-3">
          <label>Topic Taught</label>
          <input type="text" name="topicTaught" className="form-control" onChange={handleChange} value={form.topicTaught} required />
        </div>

        <div className="mb-3">
          <label>Learning Outcomes</label>
          <textarea name="learningOutcomes" className="form-control" onChange={handleChange} value={form.learningOutcomes} required />
        </div>

        <div className="mb-3">
          <label>Lecturer Recommendations</label>
          <textarea name="recommendations" className="form-control" onChange={handleChange} value={form.recommendations} />
        </div>

        <button type="submit" className="btn btn-primary">Submit Report</button>
      </form>
    </DashboardLayout>
  );
};

export default Reports;
