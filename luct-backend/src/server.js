import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import plRoutes from "./routes/plRoutes.js";
import prlRoutes from "./routes/prlRoutes.js";
import ratingsRoutes from "./routes/ratingRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lecturer", lecturerRoutes);
app.use("/api/pl", plRoutes);
app.use("/api/prl", prlRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/courses", courseRoutes);

// Test route
app.get("/", (req, res) => res.send("LUCT Reporting API is running 🚀"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
