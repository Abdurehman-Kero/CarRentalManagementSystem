import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const bookingService = {
  getAllBookings:      ()         => api.get('/bookings').then(extract),
  getBookingById:     (id)       => api.get(`/bookings/${id}`).then(extractOne),
  createBooking:      (data)     => api.post('/bookings', data).then(extractOne),
  updateBookingStatus:(id, status)=> api.put(`/bookings/${id}/status`, { Status: status }).then(extractOne),
  calculateCost:      (data)     => api.post('/bookings/calculate-cost', data).then(extractOne),
};

export default bookingService;
