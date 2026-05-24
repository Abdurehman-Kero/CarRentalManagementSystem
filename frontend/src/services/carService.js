import api from './api';

export const carService = {
  // Get all cars with optional filtering
  async getAllCars(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const url = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        success: true,
        data: response.data.cars || response.data,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      console.error('Error fetching cars:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch cars'
      };
    }
  },

  // Get car by ID
  async getCarById(carId) {
    try {
      const response = await api.get(`/cars/${carId}`);
      return {
        success: true,
        data: response.data.car || response.data
      };
    } catch (error) {
      console.error('Error fetching car:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch car details'
      };
    }
  },

  // Create new car
  async createCar(carData) {
    try {
      const response = await api.post('/cars', carData);
      return {
        success: true,
        data: response.data.car || response.data,
        message: 'Car created successfully'
      };
    } catch (error) {
      console.error('Error creating car:', error);
      return {
        success: false,
        error: error.message || 'Failed to create car'
      };
    }
  },

  // Update existing car
  async updateCar(carId, carData) {
    try {
      const response = await api.put(`/cars/${carId}`, carData);
      return {
        success: true,
        data: response.data.car || response.data,
        message: 'Car updated successfully'
      };
    } catch (error) {
      console.error('Error updating car:', error);
      return {
        success: false,
        error: error.message || 'Failed to update car'
      };
    }
  },

  // Delete car
  async deleteCar(carId) {
    try {
      const response = await api.delete(`/cars/${carId}`);
      return {
        success: true,
        message: 'Car deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting car:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete car'
      };
    }
  },

  // Update car status (Available, In Use, Maintenance)
  async updateCarStatus(carId, status) {
    try {
      const response = await api.put(`/cars/${carId}/status`, { status });
      return {
        success: true,
        data: response.data.car || response.data,
        message: `Car status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating car status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update car status'
      };
    }
  },

  // Get available cars for booking
  async getAvailableCars(startDate, endDate, category = null) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate);
      if (category) queryParams.append('category', category);
      
      const response = await api.get(`/cars/available?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data.cars || response.data
      };
    } catch (error) {
      console.error('Error fetching available cars:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch available cars'
      };
    }
  },

  // Get car categories
  async getCarCategories() {
    try {
      const response = await api.get('/cars/categories');
      return {
        success: true,
        data: response.data.categories || response.data
      };
    } catch (error) {
      console.error('Error fetching car categories:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch car categories'
      };
    }
  },

  // Get car brands
  async getCarBrands() {
    try {
      const response = await api.get('/cars/brands');
      return {
        success: true,
        data: response.data.brands || response.data
      };
    } catch (error) {
      console.error('Error fetching car brands:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch car brands'
      };
    }
  },

  // Upload car image
  async uploadCarImage(carId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/cars/${carId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Car image uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading car image:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload car image'
      };
    }
  },

  // Get car rental history
  async getCarRentalHistory(carId) {
    try {
      const response = await api.get(`/cars/${carId}/rentals`);
      return {
        success: true,
        data: response.data.rentals || response.data
      };
    } catch (error) {
      console.error('Error fetching car rental history:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch car rental history'
      };
    }
  }
};

export default carService;