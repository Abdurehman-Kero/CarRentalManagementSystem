import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const fuelPolicyService = {
  getAllFuelPolicies: ()       => api.get('/fuel-policies').then(extract),
  getFuelPolicyById:  (id)     => api.get(`/fuel-policies/${id}`).then(extractOne),
  createFuelPolicy:   (data)   => api.post('/fuel-policies', data).then(extractOne),
  updateFuelPolicy:   (id, data) => api.put(`/fuel-policies/${id}`, data).then(extractOne),
  deleteFuelPolicy:   (id)     => api.delete(`/fuel-policies/${id}`).then(r => r.data),
};

export default fuelPolicyService;
