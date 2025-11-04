import Test from "../models/test.model.js";
import Question from "../models/question.model.js";

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const questions = await Question.aggregate([
      { $sample: { size: parseInt(limit) } },
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      data: { questions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Start test
export const startTest = async (req, res) => {
  try {
    const { title, totalQuestions = 20 } = req.body;

    // Get random questions
    const questions = await Question.aggregate([
      { $sample: { size: totalQuestions } },
    ]);

    const totalScore = questions.reduce((sum, q) => sum + q.points, 0);

    // Create test
    const test = await Test.create({
      user: req.user.id,
      title: title || "Practice Test",
      totalScore,
      questions: questions.map((q) => ({
        questionId: q._id,
        userAnswer: null,
        isCorrect: false,
      })),
    });

    await test.populate("questions.questionId");

    res.status(201).json({
      success: true,
      message: "Test started",
      data: { test },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Submit answer
export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("questions.questionId");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const question = test.questions[questionIndex];
    question.userAnswer = answer;
    question.isCorrect = question.questionId.correctAnswer === answer;

    await test.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted",
      data: { isCorrect: question.isCorrect },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete test
export const completeTest = async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("questions.questionId");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Calculate score
    let score = 0;
    test.questions.forEach((q) => {
      if (q.isCorrect) {
        score += q.questionId.points;
      }
    });

    test.score = score;
    test.percentage = Math.round((score / test.totalScore) * 100);
    test.status = "completed";
    test.completedAt = Date.now();

    await test.save();

    res.status(200).json({
      success: true,
      message: "Test completed",
      data: {
        score: test.score,
        totalScore: test.totalScore,
        percentage: test.percentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user tests
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-questions");

    res.status(200).json({
      success: true,
      count: tests.length,
      data: { tests },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
