import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const customerService = {
  getAllCustomers:  ()         => api.get('/customers').then(extract),
  getCustomerById: (id)       => api.get(`/customers/${id}`).then(extractOne),
  createCustomer:  (data)     => api.post('/customers', data).then(extractOne),
  updateCustomer:  (id, data) => api.put(`/customers/${id}`, data).then(extractOne),
  deleteCustomer:  (id)       => api.delete(`/customers/${id}`).then(r => r.data),
};

export default customerService;
