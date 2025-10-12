import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getClasses, submitReport, getMonitoring } from "../controllers/lecturerController.js";

const router = express.Router();
router.use(protect);

router.get("/classes", getClasses);
router.post("/reports", submitReport);
router.get("/monitoring", getMonitoring);

export default router;
