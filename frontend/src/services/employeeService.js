import api from './api';

const extract    = (res) => res.data?.data ?? res.data ?? [];
const extractOne = (res) => res.data?.data ?? res.data ?? null;

const employeeService = {
  getAllEmployees: (branchId) => {
    const url = branchId ? `/employees?branchId=${branchId}` : '/employees';
    return api.get(url).then(extract);
  },
  getEmployeeById:  (id)     => api.get(`/employees/${id}`).then(extractOne),
  createEmployee:   (data)   => api.post('/employees', data).then(extractOne),
  updateEmployee:   (id, data) => api.put(`/employees/${id}`, data).then(extractOne),
  deleteEmployee:   (id)     => api.delete(`/employees/${id}`).then(r => r.data),
};

export default employeeService;
