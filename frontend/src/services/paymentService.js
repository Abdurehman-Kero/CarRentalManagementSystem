import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const paymentService = {
  getAllPayments: ()       => api.get('/payments').then(extract),
  getPaymentsByBookingId: (bookingId) => api.get(`/payments/booking/${bookingId}`).then(extract),
  createPayment: (data)   => api.post('/payments', data).then(extractOne),
  deletePayment: (bookingId, paymentId) => api.delete(`/payments/${bookingId}/${paymentId}`).then(r => r.data),
  getRevenueStats: ()     => api.get('/payments/stats/revenue').then(extractOne),
};

export default paymentService;
