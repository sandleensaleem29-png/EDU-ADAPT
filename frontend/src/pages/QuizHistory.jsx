import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Loading from '../components/Loading';

const QuizHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/quizzes/history?page=${page}&limit=10`);
        setAttempts(res.data.attempts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  if (loading) return <Loading text="Loading history..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quiz History</h1>
        <p className="text-gray-500">View all your past quiz attempts.</p>
      </div>

      <div className="card">
        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No quiz history yet.</p>
            <Link to="/quiz/select" className="btn-primary">
              Take Your First Quiz
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Topic</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Difficulty</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Questions</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <span className="font-medium">{attempt.topic?.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          attempt.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          attempt.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attempt.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          attempt.score >= 80 ? 'text-green-600' :
                          attempt.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {attempt.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/quiz/start/${attempt.topicId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          Retake
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
