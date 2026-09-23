import { useState, useEffect } from 'react';
import API from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    topicId: '',
    title: '',
    description: '',
    url: '',
    type: 'article',
    difficulty: 'medium'
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await API.get('/resources');
      setResources(res.data.resources);
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
    fetchResources();
    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await API.put(`/resources/${editingResource.id}`, formData);
      } else {
        await API.post('/resources', formData);
      }
      setShowModal(false);
      setEditingResource(null);
      setFormData({ topicId: '', title: '', description: '', url: '', type: 'article', difficulty: 'medium' });
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      topicId: resource.topicId,
      title: resource.title,
      description: resource.description || '',
      url: resource.url,
      type: resource.type,
      difficulty: resource.difficulty
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await API.delete(`/resources/${id}`);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Topic', render: (row) => row.topic?.name || 'N/A' },
    { header: 'Type', accessor: 'type' },
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

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
          <p className="text-gray-500">Manage learning resources.</p>
        </div>
        <button onClick={() => { setFormData({ topicId: '', title: '', description: '', url: '', type: 'article', difficulty: 'medium' }); setEditingResource(null); setShowModal(true); }} className="btn-primary">
          + Add Resource
        </button>
      </div>

      <div className="card">
        <Table columns={columns} data={resources} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingResource ? 'Edit Resource' : 'Add Resource'}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="input-field" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="documentation">Documentation</option>
                <option value="tutorial">Tutorial</option>
                <option value="other">Other</option>
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

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editingResource ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminResources;
