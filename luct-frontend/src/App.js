import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// 🧑‍🎓 Student Dashboards
import StudentDashboard from "./components/dashboards/StudentDashboard";
import Monitoring from "./components/dashboards/student/Monitoring";
import Rating from "./components/dashboards/student/Rating";
import Enrollments from "./components/dashboards/student/Enrollments";

// 👩‍🏫 Lecturer Dashboards
import LecturerDashboard from "./components/dashboards/LecturerDashboard";
import Classes from "./components/dashboards/lecturer/Classes";
import Reports from "./components/dashboards/lecturer/Reports";
import LecturerMonitoring from "./components/dashboards/lecturer/Monitoring";
import LecturerRating from "./components/dashboards/lecturer/Rating";

// 👨‍💼 Program Leader (PL) Dashboards
import PLDashboard from "./components/dashboards/PLDashboard";
import PLCourses from "./components/dashboards/pl/Courses";
import PLReports from "./components/dashboards/pl/Reports";
import PLMonitoring from "./components/dashboards/pl/Monitoring";
import PLLectures from "./components/dashboards/pl/Lectures";
import PLClasses from "./components/dashboards/pl/Classes";
import PLRating from "./components/dashboards/pl/Rating";

// 🧾 Program Review Leader (PRL) Dashboards
import PRLDashboard from "./components/dashboards/PRLDashboard";
import PRLCourses from "./components/dashboards/prl/Courses";
import PRLReports from "./components/dashboards/prl/Reports";
import PRLMonitoring from "./components/dashboards/prl/Monitoring";
import PRLRating from "./components/dashboards/prl/Rating";
import PRLClasses from "./components/dashboards/prl/Classes";
import PRLClassReports from "./components/dashboards/prl/ClassReports";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🧑‍🎓 Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/monitoring"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Monitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/rating"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Rating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/enrollments"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Enrollments />
            </ProtectedRoute>
          }
        />

        {/* 👩‍🏫 Lecturer Routes */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/classes"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <Classes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/reports"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/monitoring"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/rating"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerRating />
            </ProtectedRoute>
          }
        />

        {/* 👨‍💼 Program Leader (PL) Routes */}
        <Route
          path="/pl"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/courses"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/reports"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/monitoring"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/lectures"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLLectures />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/classes"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/rating"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLRating />
            </ProtectedRoute>
          }
        />

        {/* 🧾 Program Review Leader (PRL) Routes */}
        <Route
          path="/prl"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/courses"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/reports"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/monitoring"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/rating"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLRating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/classes"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/classes/:classId/reports"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLClassReports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
