import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import API from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Performance = () => {
  const [performance, setPerformance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [perfRes, histRes] = await Promise.all([
        API.get('/recommendations/performance'),
        API.get('/quizzes/history?limit=20')
      ]);
      setPerformance(perfRes.data);
      setHistory(histRes.data.attempts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading text="Loading performance..." />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  const topicData = performance?.topicPerformance?.map((t) => ({
    name: t.topicName,
    accuracy: t.accuracy,
    attempts: t.totalAttempts
  })) || [];

  const scoreData = history.map((h) => ({
    date: new Date(h.completedAt).toLocaleDateString(),
    score: h.score,
    topic: h.topic?.name
  })).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Performance & Progress</h1>
        <p className="text-gray-500">Track your learning journey and identify areas for improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Recent Accuracy</p>
          <p className="text-3xl font-bold text-primary-600">{performance?.recentAccuracy || 0}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total Quizzes</p>
          <p className="text-3xl font-bold text-primary-600">{performance?.topicPerformance?.reduce((s, t) => s + t.totalAttempts, 0) || 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Topics Practiced</p>
          <p className="text-3xl font-bold text-primary-600">{performance?.topicPerformance?.length || 0}</p>
        </div>
      </div>

      {topicData.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Topic Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {scoreData.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Score Progression</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Weak Areas</h2>
          {performance?.weakTopics?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No weak areas identified yet. Keep practicing!</p>
          ) : (
            <div className="space-y-3">
              {performance?.weakTopics?.map((topic) => (
                <div key={topic.topicId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">{topic.topicName}</span>
                  <span className="text-red-600 font-bold">{topic.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Strong Areas</h2>
          {performance?.strongTopics?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Keep practicing to build strong areas!</p>
          ) : (
            <div className="space-y-3">
              {performance?.strongTopics?.map((topic) => (
                <div key={topic.topicId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">{topic.topicName}</span>
                  <span className="text-green-600 font-bold">{topic.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
