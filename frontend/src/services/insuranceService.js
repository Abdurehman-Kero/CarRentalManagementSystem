import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const insuranceService = {
  getAllInsurances: ()       => api.get('/insurances').then(extract),
  getInsuranceById:  (id)     => api.get(`/insurances/${id}`).then(extractOne),
  createInsurance:   (data)   => api.post('/insurances', data).then(extractOne),
  updateInsurance:   (id, data) => api.put(`/insurances/${id}`, data).then(extractOne),
  deleteInsurance:   (id)     => api.delete(`/insurances/${id}`).then(r => r.data),
};

export default insuranceService;
