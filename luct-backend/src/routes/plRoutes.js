// routes/plRoutes.js
import express from "express";
import {
  getCourses,
  addCourse,
  assignLecturerToCourse,
  getLecturers,
  getReports,
  getAttendanceOverview,
  getAcademicPerformance,
  getAlerts,
  getClasses,
  getLecturerActivities,
  getLecturerRatings,
} from "../controllers/plController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Courses routes
router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.put("/courses/:id/assign", assignLecturerToCourse);

// Lecturers
router.get("/lecturers", getLecturers);

router.get("/reports", getReports);

router.get("/monitoring/attendance", getAttendanceOverview);
router.get("/monitoring/performance", getAcademicPerformance);
router.get("/monitoring/alerts", getAlerts);

router.get("/classes", getClasses);

router.get("/lectures", getLecturerActivities);

router.get("/ratings", getLecturerRatings);

export default router;
