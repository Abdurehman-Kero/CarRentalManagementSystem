import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const reviewService = {
  getAllReviews: ()       => api.get('/reviews').then(extract),
  getReviewsByCarId: (carId) => api.get(`/reviews/car/${carId}`).then(extract),
  getReviewsByCustomerId: (custId) => api.get(`/reviews/customer/${custId}`).then(extract),
  createReview: (data)   => api.post('/reviews', data).then(extractOne),
  deleteReview: (id)     => api.delete(`/reviews/${id}`).then(r => r.data),
};

export default reviewService;
