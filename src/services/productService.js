import api from './api';

class ProductService {
  // Get all products
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/products/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get related products
  async getRelatedProducts(sku) {
    try {
      const response = await api.get(`/products/related/${sku}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get product variants
  async getProductVariants(productId) {
    try {
      const response = await api.get(`/products/productvariants/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    try {
      const queryParams = { category, ...params };
      const response = await api.get('/products', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get product filters (for category pages)
  async getProductFilters(category) {
    try {
      const response = await api.get(`/products/filters/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new ProductService(); 