import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const categoryService = {
  getAllCategories: ()       => api.get('/categories').then(extract),
  getCategoryById:  (id)     => api.get(`/categories/${id}`).then(extractOne),
  createCategory:   (data)   => api.post('/categories', data).then(extractOne),
  updateCategory:   (id, data) => api.put(`/categories/${id}`, data).then(extractOne),
  deleteCategory:   (id)     => api.delete(`/categories/${id}`).then(r => r.data),
};

export default categoryService;
