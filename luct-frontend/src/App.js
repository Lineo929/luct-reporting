import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Student Dashboards
import StudentDashboard from "./components/dashboards/StudentDashboard";
import Monitoring from "./components/dashboards/student/Monitoring";
import Rating from "./components/dashboards/student/Rating";
import Enrollments from "./components/dashboards/student/Enrollments"; // ✅ added

// Lecturer Dashboards
import LecturerDashboard from "./components/dashboards/LecturerDashboard";
import Classes from "./components/dashboards/lecturer/Classes";
import Reports from "./components/dashboards/lecturer/Reports";
import LecturerMonitoring from "./components/dashboards/lecturer/Monitoring";
import LecturerRating from "./components/dashboards/lecturer/Rating";

// Program Leader / PRL Dashboards
import PLDashboard from "./components/dashboards/PLDashboard";
import PRLDashboard from "./components/dashboards/PRLDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
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
          path="/student/enrollments" // ✅ new route
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Enrollments />
            </ProtectedRoute>
          }
        />

        {/* Lecturer Routes */}
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

        {/* Program Leader Routes */}
        <Route
          path="/pl"
          element={
            <ProtectedRoute allowedRoles={["pl"]}>
              <PLDashboard />
            </ProtectedRoute>
          }
        />

        {/* PRL Routes */}
        <Route
          path="/prl"
          element={
            <ProtectedRoute allowedRoles={["prl"]}>
              <PRLDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
