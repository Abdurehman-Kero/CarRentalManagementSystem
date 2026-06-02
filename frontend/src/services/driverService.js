import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const driverService = {
  getAllDrivers: ()       => api.get('/drivers').then(extract),
  getDriverById:  (id)     => api.get(`/drivers/${id}`).then(extractOne),
  createDriver:   (data)   => api.post('/drivers', data).then(extractOne),
  updateDriver:   (id, data) => api.put(`/drivers/${id}`, data).then(extractOne),
  deleteDriver:   (id)     => api.delete(`/drivers/${id}`).then(r => r.data),
};

export default driverService;
