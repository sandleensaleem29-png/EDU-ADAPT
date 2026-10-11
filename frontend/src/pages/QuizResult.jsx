import { useLocation, Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">No result data</h2>
        <Link to="/dashboard" className="btn-primary mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const { score, correctAnswers, totalQuestions, responses } = result;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const pieData = [
    { name: 'Correct', value: correctAnswers },
    { name: 'Incorrect', value: incorrectAnswers }
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Excellent! Outstanding performance!';
    if (score >= 80) return 'Great job! Keep it up!';
    if (score >= 70) return 'Good work! Room for improvement.';
    if (score >= 60) return 'Not bad! Practice more to improve.';
    return 'Keep practicing! You will get better.';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Complete!</h1>
        <p className="text-gray-500">{getScoreMessage()}</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {score}%
            </div>
            <p className="text-gray-500 mt-2">
              {correctAnswers} of {totalQuestions} correct
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
        <div className="space-y-4">
          {responses?.map((response, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                response.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-lg ${response.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {response.isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{response.questionText}</p>
                  <div className="mt-2 text-sm space-y-1">
                    <p>
                      Your answer: <span className={response.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {response.selectedAnswer}. {response[`option${response.selectedAnswer}`]}
                      </span>
                    </p>
                    {!response.isCorrect && (
                      <p>
                        Correct answer: <span className="text-green-600">
                          {response.correctAnswer}. {response[`option${response.correctAnswer}`]}
                        </span>
                      </p>
                    )}
                    {response.explanation && (
                      <p className="mt-2 text-gray-600 italic">{response.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/dashboard" className="btn-secondary flex-1 text-center">
          Dashboard
        </Link>
        <Link to="/performance" className="btn-secondary flex-1 text-center">
          View Performance
        </Link>
        <Link to="/quiz/select" className="btn-primary flex-1 text-center">
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
