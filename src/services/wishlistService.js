import api from './api';

class WishlistService {
  // Get all wishlists for current user
  async getUserWishlists(userId) {
    try {
      const response = await api.get(`/wishlist/wishlists/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create a new wishlist
  async createWishlist(wishlistData) {
    try {
      const response = await api.post('/wishlist/wishlists', wishlistData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update a wishlist
  async updateWishlist(wishlistId, updates) {
    try {
      const response = await api.put(`/wishlist/wishlists/${wishlistId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete a wishlist
  async deleteWishlist(wishlistId) {
    try {
      const response = await api.delete(`/wishlist/wishlists/${wishlistId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Share a wishlist
  async shareWishlist(wishlistId, shareData) {
    try {
      const response = await api.post(`/wishlist/wishlists/${wishlistId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get shared wishlist by token
  async getSharedWishlist(token) {
    try {
      const response = await api.get(`/wishlist/wishlists/shared/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get all items in a wishlist
  async getWishlistItems(wishlistId) {
    try {
      const response = await api.get(`/wishlist/wishlists/${wishlistId}/items`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Add item to wishlist
  async addItemToWishlist(wishlistId, itemData) {
    try {
      const response = await api.post(`/wishlist/wishlists/${wishlistId}/items`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Remove item from wishlist
  async removeItemFromWishlist(itemId) {
    try {
      const response = await api.delete(`/wishlist/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Add collaborator to wishlist
  async addCollaborator(wishlistId, collaboratorData) {
    try {
      const response = await api.post(`/wishlist/wishlists/${wishlistId}/collaborators`, collaboratorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Remove collaborator from wishlist
  async removeCollaborator(collaboratorId) {
    try {
      const response = await api.delete(`/wishlist/collaborators/${collaboratorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update collaborator permissions
  async updateCollaboratorPermissions(collaboratorId, permissions) {
    try {
      const response = await api.put(`/wishlist/collaborators/${collaboratorId}/permissions`, permissions);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new WishlistService(); 