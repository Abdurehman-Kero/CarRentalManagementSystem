import api from './api';

export const customerService = {
  // Get all customers
  getAllCustomers: () => api.get('/customers'),
  
  // Get customer by ID
  getCustomerById: (id) => api.get(`/customers/${id}`),
  
  // Create customer
  createCustomer: (customerData) => api.post('/customers', customerData),
  
  // Update customer
  updateCustomer: (id, customerData) => api.put(`/customers/${id}`, customerData),
  
  // Delete customer
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

export default customerService;
