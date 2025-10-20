// src/routes/courseRoutes.js
import express from "express";
import { getCourses } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses); // GET /api/courses

export default router;
