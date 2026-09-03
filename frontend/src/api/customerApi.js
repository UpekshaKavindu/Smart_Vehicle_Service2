const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const customerApi = {
  getAll: async (search = '') => {
    const url = search ? `${API_BASE}/Customer?search=${encodeURIComponent(search)}` : `${API_BASE}/Customer`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/Customer/${id}`);
    if (!res.ok) throw new Error('Customer not found');
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/Customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Creation failed');
    }
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/Customer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Update failed');
    }
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/Customer/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },
  getAiSummary: async (id, options = {}) => {
    const { includeServiceHistory = true, includeBookings = true, includeMaintenance = true, specificQuestion = null } = options;
    const res = await fetch(`${API_BASE}/Customer/${id}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ includeServiceHistory, includeBookings, includeMaintenance, specificQuestion }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'AI summary failed');
    }
    const data = await res.json();
    return data.summary;
  },
  askAi: async (id, question, maxIterations = 5) => {
    const res = await fetch(`${API_BASE}/Customer/${id}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, maxIterations }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'AI question failed');
    }
    const data = await res.json();
    return data.answer;
  }
};