import api from './api';

// Helper: extract data array from { success, data } response
const extract = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const carService = {
  getAllCars:      ()         => api.get('/cars').then(extract),
  getCarById:      (id)      => api.get(`/cars/${id}`).then(extractOne),
  createCar:       (data)    => api.post('/cars', data).then(extractOne),
  updateCar:       (id, data)=> api.put(`/cars/${id}`, data).then(extractOne),
  updateCarStatus: (id, status) => api.put(`/cars/${id}/status`, { status }).then(extractOne),
  deleteCar:       (id)      => api.delete(`/cars/${id}`).then(r => r.data),
};

export default carService;