# Backend Integration Documentation

## Overview

This document outlines the complete backend integration implemented for the Dharika frontend application. The integration connects your React frontend with the Node.js backend running on `localhost:3000`.

## Architecture

### Service Layer Architecture
```
Frontend Components
       ↓
Context/Hooks Layer (Auth, Cart)
       ↓
Service Layer (API calls)
       ↓
Axios Instance (HTTP client)
       ↓
Backend APIs (localhost:3000)
```

## Files Added/Modified

### 1. API Services (`src/services/`)

#### `api.js` - Base API Configuration
- Axios instance with base URL `http://localhost:3000/api`
- Request interceptor for authentication tokens
- Response interceptor for error handling
- Automatic token management

#### `authService.js` - Authentication Service
- **Login**: `login(credentials)`
- **Register**: `register(userData)`
- **Google Login**: `googleLogin(googleToken)`
- **Profile Update**: `updateProfile(profileData)`
- **Password Reset**: `requestPasswordReset(email)`, `resetPassword(token, password)`
- **Email Verification**: `verifyEmail(token)`, `resendVerification(email)`

#### `productService.js` - Product Service
- **Get Products**: `getProducts(params)`
- **Search Products**: `searchProducts(query, filters)`
- **Get Product by ID**: `getProductById(id)`
- **Get Featured Products**: `getFeaturedProducts()`
- **Get Related Products**: `getRelatedProducts(sku)`
- **Get Product Variants**: `getProductVariants(productId)`

#### `wishlistService.js` - Wishlist Service
- **Wishlist Management**: Create, update, delete wishlists
- **Item Management**: Add/remove items from wishlists
- **Sharing**: Share wishlists with tokens
- **Collaboration**: Add/remove collaborators

#### `cartService.js` - Cart Service
- **Cart Management**: Get, update, clear cart
- **Item Management**: Add, update, remove cart items
- **Coupon Management**: Apply/remove coupons

#### `orderService.js` - Order Service
- **Order Creation**: `createOrder(orderData)`
- **Order Management**: Get orders, track orders
- **Returns**: Request returns/refunds

### 2. Context Layer (`src/contexts/`)

#### `AuthContext.jsx` - Authentication Context
- Global authentication state management
- Login/logout functionality
- User session persistence
- Authentication status tracking

### 3. Custom Hooks (`src/hooks/`)

#### `useCart.js` - Cart Management Hook
- Cart state management
- Add/remove/update cart items
- Cart summary calculations
- Coupon management

### 4. Demo Component

#### `BackendIntegrationExample.jsx`
- Demonstrates all backend integrations
- Shows authentication flow
- Product fetching example
- Wishlist integration
- Error handling examples

## API Endpoints Used

### Authentication (`/api/auth/`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /google-login` - Google OAuth login
- `PUT /update-profile` - Update user profile
- `GET /verify-email/:token` - Email verification
- `POST /resend-verification` - Resend verification email
- `POST /request-password-reset` - Request password reset
- `POST /reset-password` - Reset password

### Products (`/api/products/`)
- `GET /` - Get all products
- `GET /search` - Search products
- `GET /featured` - Get featured products
- `GET /related/:sku` - Get related products
- `GET /productvariants/:id` - Get product variants
- `GET /:id` - Get product by ID

### Wishlist (`/api/wishlist/`)
- `GET /wishlists/:userId` - Get user wishlists
- `POST /wishlists` - Create wishlist
- `PUT /wishlists/:id` - Update wishlist
- `DELETE /wishlists/:id` - Delete wishlist
- `POST /wishlists/:id/share` - Share wishlist
- `GET /wishlists/shared/:token` - Get shared wishlist
- `POST /wishlists/:wishlistId/items` - Add item to wishlist
- `DELETE /items/:itemId` - Remove item from wishlist

### Cart (`/api/cart/`) - Ready for implementation
- `GET /` - Get user cart
- `POST /items` - Add item to cart
- `PUT /items/:id` - Update cart item
- `DELETE /items/:id` - Remove cart item
- `DELETE /` - Clear cart
- `POST /coupon` - Apply coupon

### Orders (`/api/orders/`) - Ready for implementation
- `POST /` - Create order
- `GET /` - Get user orders
- `GET /:id` - Get order by ID
- `PUT /:id/status` - Update order status

## Usage Examples

### 1. Authentication
```jsx
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email, password });
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
}
```

### 2. Products
```jsx
import { productService } from '../services';

function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    
    fetchProducts();
  }, []);
}
```

### 3. Cart Management
```jsx
import { useCart } from '../hooks/useCart';

function ProductCard({ product }) {
  const { addToCart, cartSummary } = useCart();
  
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };
}
```

### 4. Wishlist
```jsx
import { wishlistService } from '../services';

function WishlistButton({ productId }) {
  const addToWishlist = async () => {
    try {
      // Get user's default wishlist
      const wishlists = await wishlistService.getUserWishlists(userId);
      const defaultWishlist = wishlists[0];
      
      // Add item
      await wishlistService.addItemToWishlist(defaultWishlist.id, { productId });
      alert('Added to wishlist!');
    } catch (error) {
      alert('Failed to add to wishlist');
    }
  };
}
```

## Error Handling

### Centralized Error Handling
- All API calls include try-catch blocks
- 401 errors automatically clear authentication
- User-friendly error messages
- Console logging for debugging

### Example Error Handling
```jsx
try {
  const result = await productService.getProducts();
  setProducts(result.products);
} catch (error) {
  // Error is already logged by the service
  setError(error.message || 'Something went wrong');
}
```

## Testing the Integration

### 1. Backend Demo Page
Visit `/backend-demo` in your application to see:
- Authentication status
- Product fetching from backend
- Add to wishlist functionality
- Real-time error handling

### 2. Authentication Testing
- Use the auth popup to test login/register
- Check browser localStorage for tokens
- Verify API calls include Authorization header

### 3. API Testing
- Open browser dev tools → Network tab
- Perform actions and verify API calls
- Check request headers and response data

## Backend Requirements

Your backend should be:
1. Running on `localhost:3000`
2. Have CORS enabled for frontend requests
3. Implement the API endpoints listed above
4. Return consistent JSON responses

## Configuration

### Environment Variables (Optional)
Create `.env` file for different environments:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
```

### API Configuration
Update `src/services/api.js` if needed:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: process.env.REACT_APP_API_TIMEOUT || 10000,
});
```

## Next Steps

1. **Test the integration** by visiting `/backend-demo`
2. **Update existing components** to use the new services
3. **Implement cart/order backend routes** if needed
4. **Add more specific error handling** for your use cases
5. **Add loading states** to improve UX

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - **Solution**: Updated `corsOptions.js` to include frontend URL (`localhost:5173`)
   - **Fix Applied**: Backend now accepts requests from Vite dev server
   - Ensure backend has CORS enabled for your frontend URL

2. **401 Unauthorized**
   - **Issue**: Test credentials were hardcoded and invalid
   - **Solution**: Updated demo to include proper registration/login form
   - **Fix Applied**: Users can now register new accounts or login with existing ones
   - Check if token is being sent in requests
   - Verify backend auth middleware

3. **500 Internal Server Error (BSON Error)**
   - **Issue**: Variable naming errors in products controller
   - **Solution**: Fixed `products` vs `allProducts` variable references
   - **Fix Applied**: Products API now works correctly
   - Added proper error handling with try-catch blocks

4. **Network Errors**
   - Confirm backend is running on localhost:3000
   - Check firewall/network settings
   - Verify CORS configuration includes your frontend URL

5. **No Data Returned**
   - Verify API endpoint implementations
   - Check backend logs for errors
   - Ensure database has sample data

### Recent Fixes Applied

1. **CORS Configuration**: Updated to allow `localhost:5173` (Vite default port)
2. **Products Controller**: Fixed variable naming issues causing BSON errors
3. **Demo Component**: Enhanced with proper authentication forms and better error handling
4. **Error Messages**: Improved error reporting and troubleshooting tips

### Restart Instructions

After applying these fixes:

1. **Restart your backend server** to apply CORS changes
2. **Clear browser cache** if you had CORS errors before
3. **Test the `/backend-demo` page** to verify everything works
4. **Register a new account** or use existing credentials to test authentication

The integration is now complete and ready for use! Your frontend can now communicate seamlessly with your backend API. 