import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const paymentMethodService = {
  getAllPaymentMethods: ()       => api.get('/payment-methods').then(extract),
  getPaymentMethodById:  (id)     => api.get(`/payment-methods/${id}`).then(extractOne),
  createPaymentMethod:   (data)   => api.post('/payment-methods', data).then(extractOne),
  updatePaymentMethod:   (id, data) => api.put(`/payment-methods/${id}`, data).then(extractOne),
  deletePaymentMethod:   (id)     => api.delete(`/payment-methods/${id}`).then(r => r.data),
};

export default paymentMethodService;
