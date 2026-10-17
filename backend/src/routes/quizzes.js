const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { auth, adminOnly } = require("../middleware/auth");

// Admin: every student's attempts (Admin → Quiz Attempts page)
router.get("/all", auth, adminOnly, quizController.getAllQuizzes);

// Student: own finished quizzes
router.get("/history", auth, quizController.getQuizHistory);

// Adaptive quiz flow: start returns the first question,
// each answer returns the next question (difficulty decided by the sliding window)
router.post("/start", auth, quizController.startQuiz);
router.post("/:id/answer", auth, quizController.answerQuestion);

// One attempt with all answers (result page)
router.get("/:id", auth, quizController.getQuizById);

module.exports = router;
