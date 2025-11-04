import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";

// Routes
import authRoutes from "./src/routes/auth.route.js";
import resumeRoutes from "./src/routes/resume.route.js";
import testRoutes from "./src/routes/test.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PrepDash API - Simplified",
    endpoints: {
      auth: "/api/auth",
      resume: "/api/resume",
      tests: "/api/tests",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/tests", testRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
