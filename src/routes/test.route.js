import express from "express";
import {
  getQuestions,
  startTest,
  submitAnswer,
  completeTest,
  getTests,
} from "../controllers/test.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/questions", getQuestions);
router.get("/", getTests);
router.post("/start", startTest);
router.put("/:id/answer", submitAnswer);
router.put("/:id/complete", completeTest);

export default router;
