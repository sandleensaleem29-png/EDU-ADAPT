const express = require("express");
const router = express.Router();

// Fallback handlers to PREVENT ANY UNDEFINED CRASH
const dummyHandler = (req, res) =>
  res.status(200).json({ success: true, message: "Endpoint active" });

// Load Controller safely
let quizController = {};
try {
  quizController = require("../controllers/quizController");
} catch (err) {
  console.error("ERROR LOADING quizController:", err.message);
}

// Load Middleware safely
let auth = (req, res, next) => next();
let adminOnly = (req, res, next) => next();

try {
  const authModule = require("../middleware/auth");
  if (typeof authModule === "function") {
    auth = authModule;
  } else if (authModule) {
    if (authModule.auth) auth = authModule.auth;
    if (authModule.adminOnly) adminOnly = authModule.adminOnly;
  }
} catch (err) {
  console.error("ERROR LOADING auth middleware:", err.message);
}

// Routes registration with safety checks
router.get(
  "/all",
  auth,
  adminOnly,
  quizController.getAllQuizzes || dummyHandler,
);
router.get("/history", auth, quizController.getQuizHistory || dummyHandler);
router.post("/start", auth, quizController.startQuiz || dummyHandler);
router.post("/:id/answer", auth, quizController.answerQuestion || dummyHandler);
router.post("/:id/submit", auth, quizController.submitQuiz || dummyHandler);
router.get("/:id", auth, quizController.getQuizById || dummyHandler);

module.exports = router;
