import { useState, useEffect } from 'react';
import API from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, topicsRes] = await Promise.all([
          API.get('/resources'),
          API.get('/topics')
        ]);
        setResources(resRes.data.resources);
        setTopics(topicsRes.data.topics);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResources = selectedTopic
    ? resources.filter((r) => r.topicId === parseInt(selectedTopic))
    : resources;

  if (loading) return <Loading text="Loading resources..." />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Learning Resources</h1>
        <p className="text-gray-500">Curated materials to help you learn and improve.</p>
      </div>

      <div className="flex gap-4">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">
                {resource.type === 'video' ? '🎬' : resource.type === 'article' ? '📄' : resource.type === 'tutorial' ? '📝' : '📚'}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {resource.topic?.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    resource.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    resource.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {resource.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found.</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
