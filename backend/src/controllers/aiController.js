const Question = require('../models/Question');
const Topic = require('../models/Topic');

// POST /api/ai/generate-questions (admin)
exports.generateQuestions = async (req, res) => {
  try {
    const { topicId, difficulty, count = 5 } = req.body;

    if (!process.env.AI_API_KEY) {
      return res.status(400).json({ 
        message: 'AI API key not configured. Please add your OpenAI/Claude API key to the .env file.',
        fallback: 'You can manually create questions from the Questions management page.'
      });
    }

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Dynamic import for OpenAI (optional dependency)
    let OpenAI;
    try {
      OpenAI = (await import('openai')).default;
    } catch {
      return res.status(400).json({ 
        message: 'OpenAI package not installed. Run: npm install openai',
        fallback: 'You can manually create questions from the Questions management page.'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.AI_API_KEY });

    const prompt = `Generate ${count} multiple choice questions about "${topic.name}" at ${difficulty || 'medium'} difficulty level.

Return ONLY a JSON array with this exact format:
[
  {
    "questionText": "Question here?",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D",
    "correctAnswer": "A",
    "hint": "Helpful hint",
    "explanation": "Why the correct answer is right"
  }
]

Make questions educational, clear, and appropriate for the difficulty level.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    
    // Parse and validate the generated questions
    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(content);
    } catch {
      return res.status(500).json({ message: 'Failed to parse AI response. Please try again.' });
    }

    // Save questions as pending (admin must approve)
    const savedQuestions = [];
    for (const q of generatedQuestions) {
      if (!q.questionText || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer) {
        continue;
      }

      const question = await Question.create({
        topicId,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        difficulty: difficulty || 'medium',
        hint: q.hint || null,
        explanation: q.explanation || null,
        isAIGenerated: true,
        createdBy: req.user.id,
        status: 'pending'
      });

      savedQuestions.push(question);
    }

    res.status(201).json({
      message: `Generated ${savedQuestions.length} questions. They are pending admin approval.`,
      questions: savedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};
