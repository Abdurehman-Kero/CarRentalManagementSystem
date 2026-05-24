import api from './api';

export const rentalService = {
  // Get all rentals
  getAllRentals: () => api.get('/rentals'),
  
  // Get rental by ID
  getRentalById: (id) => api.get(`/rentals/${id}`),
  
  // Create rental (checkout)
  createRental: (rentalData) => api.post('/rentals', rentalData),
  
  // Return car
  returnCar: (id, actualReturnDate) => api.put(`/rentals/${id}/return`, { ActualReturnDate: actualReturnDate }),
};

export default rentalService;
