import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import QuizQuestion from '../components/QuizQuestion';
import Loading from '../components/Loading';

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await API.post('/quizzes/start', { topicId: parseInt(topicId) });
        setQuiz(res.data.quizAttempt);
        setQuestions(res.data.questions);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to start quiz');
        navigate('/quiz/select');
      } finally {
        setLoading(false);
      }
    };
    startQuiz();
  }, [topicId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const answersArray = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || 'A',
        timeTaken: 0
      }));

      const res = await API.post(`/quizzes/${quiz.id}/submit`, {
        answers: answersArray,
        timeTaken: timeElapsed
      });

      navigate(`/quiz/result/${quiz.id}`, { state: { result: res.data.result } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <Loading text="Starting quiz..." />;

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">No questions available</h2>
        <p className="text-gray-500 mt-2">Please try a different topic or difficulty.</p>
        <button onClick={() => navigate('/quiz/select')} className="btn-primary mt-4">
          Back to Topics
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/quiz/select')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Exit Quiz
        </button>
        <div className="text-sm text-gray-500">
          Time: {formatTime(timeElapsed)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`h-2 flex-1 rounded-full ${
              idx === currentIndex
                ? 'bg-primary-500'
                : answers[q.id]
                ? 'bg-green-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id]}
        onSelectAnswer={handleSelectAnswer}
        questionNumber={currentIndex + 1}
        total={questions.length}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          {answeredCount}/{questions.length} answered
        </span>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
