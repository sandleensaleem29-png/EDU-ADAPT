import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  BarChart3,
  Target,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  History,
  PlayCircle,
} from "lucide-react";
import API from "../utils/api";
import Loading from "../components/Loading";
import Error from "../components/Error";

// Local stat tile: same height for all four cards, label never wraps
const StatTile = ({ label, value, icon: Icon }) => (
  <div className="card flex items-center gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
      <Icon size={22} />
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm text-gray-500" title={label}>
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const scoreColor = (score) =>
  score >= 80
    ? "text-green-600"
    : score >= 60
      ? "text-yellow-600"
      : "text-red-600";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, historyRes, topicsRes] = await Promise.all([
        API.get("/users/stats/student"),
        API.get("/quizzes/history?limit=5"),
        API.get("/topics"),
      ]);
      setStats(statsRes.data);
      setRecentAttempts(historyRes.data.attempts || []);
      setTopics(topicsRes.data.topics || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Track your learning progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Quizzes"
          value={stats?.totalAttempts || 0}
          icon={ClipboardList}
        />
        <StatTile
          label="Average Score"
          value={`${stats?.avgScore || 0}%`}
          icon={BarChart3}
        />
        <StatTile
          label="Accuracy"
          value={`${stats?.accuracy || 0}%`}
          icon={Target}
        />
        <StatTile
          label="Questions Answered"
          value={stats?.totalAnswered || 0}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick start */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Quick Start Quiz
            </h2>
            <Link
              to="/quiz/select"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          {topics.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <BookOpen size={22} />
              </div>
              <p className="font-medium text-gray-700">
                No topics available yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Topics will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.slice(0, 4).map((topic) => (
                <Link
                  key={topic.id}
                  to={`/quiz/start/${topic.id}`}
                  className="group rounded-xl border border-gray-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-white">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {topic.name}
                  </p>
                  {Array.isArray(topic.questions) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {topic.questions.length} questions
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <History size={22} />
              </div>
              <p className="font-medium text-gray-700">No quizzes taken yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Your results will show up here.
              </p>
              <Link
                to="/quiz/select"
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                <PlayCircle size={16} />
                Start your first quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {attempt.topic?.name}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs capitalize text-gray-500 border border-gray-200">
                      {attempt.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${scoreColor(attempt.score)}`}>
                      {attempt.score}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
