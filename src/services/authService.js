import api from './api';

class AuthService {
  // User registration
  async register(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // User login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Google login
  async googleLogin(googleToken) {
    try {
      const response = await api.post('/auth/google-login', { token: googleToken });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Resend verification email
  async resendVerification(email) {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, password: newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new AuthService(); 