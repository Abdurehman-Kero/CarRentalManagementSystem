import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const bookingService = {
  getAllBookings:      ()         => api.get('/bookings').then(extract),
  getBookingById:     (id)       => api.get(`/bookings/${id}`).then(extractOne),
  createBooking:      (data)     => api.post('/bookings', data).then(extractOne),
  updateBookingStatus:(id, status)=> api.put(`/bookings/${id}/status`, { Status: status }).then(extractOne),
  calculateCost:      (data)     => api.post('/bookings/calculate-cost', data).then(extractOne),
  addDriver:          (id, driverId) => api.post(`/bookings/${id}/drivers`, { DriverID: driverId }).then(extractOne),
  removeDriver:       (id, driverId) => api.delete(`/bookings/${id}/drivers/${driverId}`).then(extractOne),
  addInsurance:       (id, insuranceId) => api.post(`/bookings/${id}/insurances`, { InsuranceID: insuranceId }).then(extractOne),
  removeInsurance:    (id, insuranceId) => api.delete(`/bookings/${id}/insurances/${insuranceId}`).then(extractOne),
};

export default bookingService;
