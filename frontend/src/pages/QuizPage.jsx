import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import QuizQuestion from "../components/QuizQuestion";
import Loading from "../components/Loading";

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [question, setQuestion] = useState(null); // the ONE question on screen
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // server reply after answering
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startedRef = useRef(false); // stops React dev mode starting two quizzes
  const questionStartRef = useRef(0); // time when the current question appeared

  // Start the quiz: the backend creates the attempt and sends question 1
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startQuiz = async () => {
      try {
        const res = await API.post("/quizzes/start", {
          topicId: parseInt(topicId),
        });
        setQuiz(res.data.quizAttempt);
        setQuestion(res.data.question);
        setTotalQuestions(res.data.totalQuestions);
        setDifficulty(res.data.difficulty);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to start quiz");
        navigate("/quiz/select");
      } finally {
        setLoading(false);
      }
    };
    startQuiz();
  }, [topicId, navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Selecting an option (locked once the answer has been checked)
  const handleSelectAnswer = (questionId, answer) => {
    if (feedback) return;
    setSelected(answer);
  };

  // Send this one answer; the backend replies with right/wrong + next question
  const handleCheckAnswer = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/quizzes/${quiz.id}/answer`, {
        questionId: question.id,
        selectedAnswer: selected,
        timeTaken: timeElapsed - questionStartRef.current,
      });
      setFeedback(res.data);
      if (res.data.isCorrect) setCorrectCount((prev) => prev + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save answer");
    } finally {
      setSubmitting(false);
    }
  };

  // Move on: either show the next question or go to the result page
  const handleContinue = () => {
    if (feedback.finished) {
      navigate(`/quiz/result/${quiz.id}`, {
        state: { result: feedback.result },
      });
      return;
    }
    setQuestion(feedback.nextQuestion);
    setQuestionNumber(feedback.currentQuestionNumber);
    setDifficulty(feedback.difficulty);
    setSelected(null);
    setFeedback(null);
    questionStartRef.current = timeElapsed;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loading text="Starting quiz..." />;

  if (!quiz || !question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">
          No questions available
        </h2>
        <p className="text-gray-500 mt-2">Please try a different topic.</p>
        <button
          onClick={() => navigate("/quiz/select")}
          className="btn-primary mt-4"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  const answeredCount = feedback ? questionNumber : questionNumber - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/quiz/select")}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Exit Quiz
        </button>
        <span className="text-sm text-gray-500">
          Time: {formatTime(timeElapsed)}
        </span>
      </div>

      {/* Progress bar: one segment per question */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full ${
              idx < answeredCount
                ? "bg-green-400"
                : idx === questionNumber - 1
                  ? "bg-primary-500"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <QuizQuestion
        question={question}
        selectedAnswer={selected}
        onSelectAnswer={handleSelectAnswer}
        questionNumber={questionNumber}
        total={totalQuestions}
      />

      {/* Feedback after the answer is checked */}
      {feedback && (
        <div
          className={`p-4 rounded-lg border ${
            feedback.isCorrect
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p
            className={`font-semibold ${
              feedback.isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {feedback.isCorrect ? "Correct!" : "Not quite."}
          </p>
          {!feedback.isCorrect && (
            <p className="text-sm text-gray-700 mt-1">
              Correct answer: {feedback.correctAnswer}.{" "}
              {question[`option${feedback.correctAnswer}`]}
            </p>
          )}
          {feedback.explanation && (
            <p className="text-sm text-gray-600 mt-2">{feedback.explanation}</p>
          )}
          {feedback.difficultyChanged && !feedback.finished && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              Difficulty changed to {feedback.difficulty} based on your last
              answers.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {correctCount} correct of {answeredCount} answered
        </span>

        {!feedback ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selected || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? "Checking..." : "Check Answer"}
          </button>
        ) : (
          <button onClick={handleContinue} className="btn-primary">
            {feedback.finished ? "See Result" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
