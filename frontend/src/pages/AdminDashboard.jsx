import { useState, useEffect } from 'react';
import API from '../utils/api';
import { StatCard } from '../components/Card';
import Loading from '../components/Loading';
import Error from '../components/Error';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/stats/dashboard');
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading text="Loading admin dashboard..." />;
  if (error) return <Error message={error} onRetry={fetchStats} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of the EduAdapt system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="👥" color="primary" />
        <StatCard title="Total Quizzes" value={stats?.totalQuizzes || 0} icon="📝" color="blue" />
        <StatCard title="Total Questions" value={stats?.totalQuestions || 0} icon="❓" color="green" />
        <StatCard title="Average Score" value={`${stats?.avgScore || 0}%`} icon="📊" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Topics</span>
              <span className="font-bold">{stats?.totalTopics || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Students</span>
              <span className="font-bold">{stats?.totalStudents || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Completed Quizzes</span>
              <span className="font-bold">{stats?.totalQuizzes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Question Bank Size</span>
              <span className="font-bold">{stats?.totalQuestions || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Quiz Attempts</h2>
          {stats?.recentAttempts?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent attempts</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentAttempts?.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{attempt.user?.name}</p>
                    <p className="text-xs text-gray-500">{attempt.topic?.name}</p>
                  </div>
                  <span className={`font-bold ${
                    attempt.score >= 80 ? 'text-green-600' :
                    attempt.score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {attempt.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
