import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { StatCard } from '../components/Card';
import Loading from '../components/Loading';
import Error from '../components/Error';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, historyRes, topicsRes] = await Promise.all([
        API.get('/users/stats/student'),
        API.get('/quizzes/history?limit=5'),
        API.get('/topics')
      ]);
      setStats(statsRes.data);
      setRecentAttempts(historyRes.data.attempts);
      setTopics(topicsRes.data.topics);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
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
        <p className="text-gray-500">Welcome back! Track your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Quizzes" value={stats?.totalAttempts || 0} icon="📝" color="primary" />
        <StatCard title="Average Score" value={`${stats?.avgScore || 0}%`} icon="📊" color="blue" />
        <StatCard title="Accuracy" value={`${stats?.accuracy || 0}%`} icon="🎯" color="green" />
        <StatCard title="Questions Answered" value={stats?.totalAnswered || 0} icon="✅" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Start Quiz</h2>
            <Link to="/quiz/select" className="text-primary-600 text-sm hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topics.slice(0, 4).map((topic) => (
              <Link
                key={topic.id}
                to={`/quiz/start/${topic.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <span className="text-2xl mb-2 block">{topic.icon}</span>
                <p className="font-medium text-gray-800 text-sm">{topic.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {topic.questions?.length || 0} questions
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/history" className="text-primary-600 text-sm hover:text-primary-700">
              View All →
            </Link>
          </div>
          {recentAttempts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No quizzes taken yet. Start your first quiz!
            </p>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{attempt.topic?.name}</p>
                    <p className="text-xs text-gray-500">{attempt.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
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
