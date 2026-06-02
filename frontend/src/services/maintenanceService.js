import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const maintenanceService = {
  getAllMaintenance: ()       => api.get('/maintenance').then(extract),
  getMaintenanceByCarId: (carId) => api.get(`/maintenance/car/${carId}`).then(extract),
  createMaintenance: (data)   => api.post('/maintenance', data).then(extractOne),
  updateMaintenance: (carId, maintenanceId, data) => api.put(`/maintenance/${carId}/${maintenanceId}`, data).then(extractOne),
  deleteMaintenance: (carId, maintenanceId) => api.delete(`/maintenance/${carId}/${maintenanceId}`).then(r => r.data),
};

export default maintenanceService;
