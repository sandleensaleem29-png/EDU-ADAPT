import { useState, useEffect } from 'react';
import API from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    topicId: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    difficulty: 'medium',
    hint: '',
    explanation: ''
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/questions?page=${page}&limit=10`);
      setQuestions(res.data.questions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await API.get('/topics');
      setTopics(res.data.topics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTopics();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await API.put(`/questions/${editingQuestion.id}`, formData);
      } else {
        await API.post('/questions', formData);
      }
      setShowModal(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      topicId: question.topicId,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      hint: question.hint || '',
      explanation: question.explanation || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await API.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      topicId: '',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      difficulty: 'medium',
      hint: '',
      explanation: ''
    });
  };

  const columns = [
    {
      header: 'Topic',
      render: (row) => row.topic?.name || 'N/A'
    },
    {
      header: 'Question',
      render: (row) => <span className="line-clamp-1 max-w-xs">{row.questionText}</span>
    },
    {
      header: 'Difficulty',
      render: (row) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          row.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          row.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.difficulty}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          row.status === 'approved' ? 'bg-green-100 text-green-700' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="text-primary-600 hover:text-primary-700 text-sm">
            Edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-red-600 hover:text-red-700 text-sm">
            Delete
          </button>
        </div>
      )
    }
  ];

  if (loading && questions.length === 0) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
          <p className="text-gray-500">Manage the question bank.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingQuestion(null); setShowModal(true); }}
          className="btn-primary"
        >
          + Add Question
        </button>
      </div>

      <div className="card">
        <Table columns={columns} data={questions} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingQuestion ? 'Edit Question' : 'Add Question'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select value={formData.topicId} onChange={(e) => setFormData({ ...formData, topicId: e.target.value })} className="input-field" required>
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <textarea value={formData.questionText} onChange={(e) => setFormData({ ...formData, questionText: e.target.value })} className="input-field" rows={3} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
              <input value={formData.optionA} onChange={(e) => setFormData({ ...formData, optionA: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
              <input value={formData.optionB} onChange={(e) => setFormData({ ...formData, optionB: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Option C</label>
              <input value={formData.optionC} onChange={(e) => setFormData({ ...formData, optionC: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Option D</label>
              <input value={formData.optionD} onChange={(e) => setFormData({ ...formData, optionD: e.target.value })} className="input-field" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <select value={formData.correctAnswer} onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })} className="input-field">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="input-field">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hint</label>
            <input value={formData.hint} onChange={(e) => setFormData({ ...formData, hint: e.target.value })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
            <textarea value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} className="input-field" rows={2} />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingQuestion ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminQuestions;
