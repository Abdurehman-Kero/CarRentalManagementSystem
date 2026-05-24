import api from './api';

export const bookingService = {
  // Get all bookings
  getAllBookings: () => api.get('/bookings'),
  
  // Calculate cost
  calculateCost: (data) => api.post('/bookings/calculate-cost', data),
  
  // Create booking
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  // Update booking status
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { Status: status }),
};

export default bookingService;
