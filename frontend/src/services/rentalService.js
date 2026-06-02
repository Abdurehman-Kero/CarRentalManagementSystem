import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const rentalService = {
  getAllRentals:  ()         => api.get('/rentals').then(extract),
  getRentalById: (id)       => api.get(`/rentals/${id}`).then(extractOne),
  createRental:  (data)     => api.post('/rentals', data).then(extractOne),
  returnCar:     (id, date) => api.put(`/rentals/${id}/return`, { ActualReturnDate: date }).then(extractOne),
};

export default rentalService;
