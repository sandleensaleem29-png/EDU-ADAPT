import { useState, useEffect } from 'react';
import API from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const AdminTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '📚' });

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/topics');
      setTopics(res.data.topics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await API.put(`/topics/${editingTopic.id}`, formData);
      } else {
        await API.post('/topics', formData);
      }
      setShowModal(false);
      setEditingTopic(null);
      setFormData({ name: '', description: '', icon: '📚' });
      fetchTopics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save topic');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({ name: topic.name, description: topic.description || '', icon: topic.icon });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await API.delete(`/topics/${id}`);
      fetchTopics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  const columns = [
    { header: 'Icon', render: (row) => <span className="text-2xl">{row.icon}</span> },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', render: (row) => <span className="line-clamp-1 max-w-xs">{row.description || 'N/A'}</span> },
    {
      header: 'Questions',
      render: (row) => row.questions?.length || 0
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

  const icons = ['📚', '📘', '📦', '⚡', '🎨', '⚛️', '🖥️', '🗄️', '🔀', '💡', '🎯', '📝'];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Topics</h1>
          <p className="text-gray-500">Manage quiz topics.</p>
        </div>
        <button onClick={() => { setFormData({ name: '', description: '', icon: '📚' }); setEditingTopic(null); setShowModal(true); }} className="btn-primary">
          + Add Topic
        </button>
      </div>

      <div className="card">
        <Table columns={columns} data={topics} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTopic ? 'Edit Topic' : 'Add Topic'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`text-2xl p-2 rounded-lg border ${formData.icon === icon ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editingTopic ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTopics;
