import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

const QuizSelect = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await API.get('/topics');
        setTopics(res.data.topics);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleStartQuiz = (topicId) => {
    navigate(`/quiz/start/${topicId}`);
  };

  if (loading) return <Loading text="Loading topics..." />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Select a Topic</h1>
        <p className="text-gray-500">Choose a topic to start your quiz. The difficulty will adapt to your level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleStartQuiz(topic.id)}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{topic.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{topic.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {topic.questions?.length || 0} questions
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="w-full btn-primary text-sm py-2">
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSelect;
