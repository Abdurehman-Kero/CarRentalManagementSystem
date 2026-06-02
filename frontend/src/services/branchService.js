import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const branchService = {
  getAllBranches: ()       => api.get('/branches').then(extract),
  getBranchById:  (id)     => api.get(`/branches/${id}`).then(extractOne),
  createBranch:   (data)   => api.post('/branches', data).then(extractOne),
  updateBranch:   (id, data) => api.put(`/branches/${id}`, data).then(extractOne),
  deleteBranch:   (id)     => api.delete(`/branches/${id}`).then(r => r.data),
};

export default branchService;
