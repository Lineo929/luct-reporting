// routes/ratingRoutes.js
import express from "express";
import {
  createRating,
  getRatingsByLecturer,
  getAverageRatingByReport,
} from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// POST /api/ratings - Add a new rating
router.post("/", createRating);

// GET /api/ratings/lecturer - Get all ratings for a lecturer’s reports
router.get("/lecturer", getRatingsByLecturer);

// GET /api/ratings/:report_id/average - Get average rating for a report
router.get("/:report_id/average", getAverageRatingByReport);

export default router;
