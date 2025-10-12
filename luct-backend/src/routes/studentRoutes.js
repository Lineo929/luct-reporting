import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMonitoring,
  getCoursesForRating,
  submitRating,
  getAvailableClasses,
  getMyEnrollments,
  enrollInClass,
  unenrollFromClass,
  markAttendance, // <-- new import
} from "../controllers/studentController.js";

const router = express.Router();

// ✅ Protect all routes
router.use(protect);

// ✅ Student Monitoring & Rating
router.get("/monitoring", getMonitoring);
router.get("/courses", getCoursesForRating);
router.post("/rating", submitRating);

// ✅ Enrollment-related routes
router.get("/classes/available", getAvailableClasses); 
router.get("/classes/enrollments", getMyEnrollments);
router.post("/classes/enroll", enrollInClass);
router.delete("/classes/enroll/:classId", unenrollFromClass);

// ✅ Attendance marking (student optional)
router.patch("/attendance", markAttendance);

export default router;
