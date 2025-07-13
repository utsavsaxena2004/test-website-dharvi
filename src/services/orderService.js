import api from './api';

class OrderService {
  // Create a new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get user's orders
  async getUserOrders(page = 1, limit = 10) {
    try {
      const response = await api.get('/orders', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Track order
  async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get order invoice
  async getOrderInvoice(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Request return/refund
  async requestReturn(orderId, returnData) {
    try {
      const response = await api.post(`/orders/${orderId}/return`, returnData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get return/refund status
  async getReturnStatus(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/return`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new OrderService(); 