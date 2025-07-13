import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService, wishlistService } from '../services';

const BackendIntegrationExample = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auth form state
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Example: Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.message && err.message.includes('HTML')) {
        setError('Backend server error - check console for details');
      } else {
        setError('Failed to load products: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Example: Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      // First get user's wishlists
      const wishlists = await wishlistService.getUserWishlists(user.id);
      let defaultWishlist = wishlists.find(w => w.isDefault);
      
      // Create default wishlist if none exists
      if (!defaultWishlist) {
        defaultWishlist = await wishlistService.createWishlist({
          name: 'My Wishlist',
          isDefault: true
        });
      }

      // Add item to wishlist
      await wishlistService.addItemToWishlist(defaultWishlist.id, {
        productId
      });
      
      alert('Product added to wishlist!');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Failed to add to wishlist: ' + (err.message || 'Unknown error'));
    }
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        await login({
          email: authForm.email,
          password: authForm.password
        });
        setShowAuthForm(false);
        setAuthForm({ email: '', password: '', name: '' });
      } else {
        await register({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password
        });
        setAuthError('Registration successful! Please check your email for verification, then login.');
        setAuthMode('login');
        setAuthForm({ ...authForm, name: '', password: '' });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setAuthError(err.message || err.error || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Backend Integration Demo</h2>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <span className="text-green-600">✓ Logged in as: {user?.name || user?.email}</span>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-red-600">✗ Not logged in</span>
              <button 
                onClick={() => setShowAuthForm(!showAuthForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showAuthForm ? 'Hide Auth' : 'Login / Register'}
              </button>
            </div>
            
            {showAuthForm && (
              <div className="mt-4 p-4 bg-white rounded border">
                <div className="flex mb-4">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`px-4 py-2 mr-2 rounded ${
                      authMode === 'login' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`px-4 py-2 rounded ${
                      authMode === 'register' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Register
                  </button>
                </div>
                
                <form onSubmit={handleAuth} className="space-y-3">
                  {authMode === 'register' && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {authLoading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Register')}
                  </button>
                </form>
                
                {authError && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {authError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Products from Backend</h3>
          <button 
            onClick={fetchProducts}
            disabled={loading}
            className="px-4 py-2 bg-gold text-white rounded hover:bg-gold/80 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Products'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <strong>Error:</strong> {error}
            <details className="mt-2">
              <summary className="cursor-pointer">Troubleshooting Tips</summary>
              <ul className="mt-2 text-sm list-disc list-inside">
                <li>Make sure your backend server is running on localhost:3000</li>
                <li>Check if CORS is properly configured</li>
                <li>Verify API endpoints are implemented</li>
                <li>Check browser console for more details</li>
              </ul>
            </details>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <div key={product.id || product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gold">
                    ₹{product.price || product.basePrice || product.salePrice || 'N/A'}
                  </span>
                  <button 
                    onClick={() => addToWishlist(product.id || product._id)}
                    disabled={!isAuthenticated}
                    className="px-3 py-1 bg-pink text-white text-sm rounded hover:bg-pink/80 disabled:opacity-50"
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No products found. Make sure your backend is running and has products in the database.</p>
          </div>
        )}
      </div>

      {/* API Connection Status */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Configuration</h3>
        <p className="text-gray-700">
          Backend URL: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000/api</code>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          This demo shows integration with your Dharika backend. Make sure your backend server is running on port 3000.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Note:</strong> If you see CORS errors, make sure the backend CORS settings include your frontend URL.
        </p>
      </div>
    </div>
  );
};

export default BackendIntegrationExample; 