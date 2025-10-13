import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPRLCourses,
  getPRLReportFeedback,
  submitPRLFeedback,
  getPRLClasses,
  getPRLClassReports,
  getAllPRLReports,
  getPRLMonitoring,
} from "../controllers/prlController.js";

const router = express.Router();

router.get("/courses", protect, getPRLCourses);
router.get("/classes", protect, getPRLClasses);
router.get("/reports", protect, getAllPRLReports);
router.get("/reports/:reportId/feedback", protect, getPRLReportFeedback);
router.post("/reports/:reportId/feedback", protect, submitPRLFeedback);
router.get("/classes/:classId/reports", protect, getPRLClassReports);
router.get("/monitoring", protect, getPRLMonitoring);

export default router;
