const QuizQuestion = ({ question, selectedAnswer, onSelectAnswer, questionNumber, total }) => {
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {total}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-6">
        {question.questionText}
      </h3>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelectAnswer(question.id, option.key)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === option.key
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium mr-2">{option.key}.</span>
            {option.text}
          </button>
        ))}
      </div>

      {question.hint && selectedAnswer && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Hint:</span> {question.hint}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
