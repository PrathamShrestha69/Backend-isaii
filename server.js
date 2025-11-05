import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";


import authRoutes from "./src/routes/auth.route.js";
import testRoutes from "./src/routes/test.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PrepDash API - Simplified",
    endpoints: {
      auth: "/api/auth",
      tests: "/api/tests",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
