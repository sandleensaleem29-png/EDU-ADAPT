import { useState, useEffect } from 'react';
import API from '../utils/api';
import Table from '../components/Table';
import Loading from '../components/Loading';

const AdminAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/quizzes/all?page=${page}&limit=10`);
      setAttempts(res.data.attempts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [page]);

  const columns = [
    { header: 'Student', render: (row) => row.user?.name || 'N/A' },
    { header: 'Topic', render: (row) => row.topic?.name || 'N/A' },
    { header: 'Difficulty', render: (row) => (
      <span className={`text-xs px-2 py-1 rounded-full ${
        row.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
        row.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {row.difficulty}
      </span>
    )},
    { header: 'Score', render: (row) => (
      <span className={`font-bold ${
        row.score >= 80 ? 'text-green-600' :
        row.score >= 60 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {row.score}%
      </span>
    )},
    { header: 'Questions', render: (row) => `${row.correctAnswers}/${row.totalQuestions}` },
    { header: 'Status', render: (row) => (
      <span className={`text-xs px-2 py-1 rounded-full ${
        row.status === 'completed' ? 'bg-green-100 text-green-700' :
        row.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
  ];

  if (loading && attempts.length === 0) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quiz Attempts</h1>
        <p className="text-gray-500">View all quiz attempts by students.</p>
      </div>

      <div className="card">
        <Table columns={columns} data={attempts} />

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
    </div>
  );
};

export default AdminAttempts;
