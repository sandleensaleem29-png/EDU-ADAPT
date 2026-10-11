import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recommendations');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading text="Loading recommendations..." />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Recommendations</h1>
        <p className="text-gray-500">Personalized suggestions based on your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Recent Accuracy</p>
          <p className="text-3xl font-bold text-primary-600">{data?.recentAccuracy || 0}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Suggested Difficulty</p>
          <p className="text-3xl font-bold text-primary-600 capitalize">{data?.nextDifficulty || 'medium'}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Weak Topics</p>
          <p className="text-3xl font-bold text-red-500">{data?.weakTopics?.length || 0}</p>
        </div>
      </div>

      {data?.recommendations?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Your Recommendations</h2>
          <div className="space-y-3">
            {data.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {rec.type === 'practice' ? '📝' : rec.type === 'difficulty' ? '🎯' : '📚'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{rec.message}</p>
                    {rec.topicName && (
                      <Link
                        to={`/quiz/start/${rec.topicId}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Start Quiz →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.weakTopics?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Topics to Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.weakTopics.map((topic) => (
              <Link
                key={topic.topicId}
                to={`/quiz/start/${topic.topicId}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{topic.topicName}</span>
                  <span className="text-red-500 font-bold">{topic.accuracy}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.recommendedResources?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recommended Resources</h2>
          <div className="space-y-3">
            {data.recommendedResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {resource.type === 'video' ? '🎬' : resource.type === 'article' ? '📄' : '📚'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{resource.title}</p>
                    <p className="text-sm text-gray-500">{resource.topic?.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
