# Razorpay Payment Integration

## Overview

This document outlines the complete Razorpay payment integration implemented for the Dharika Fashion e-commerce application. The integration provides a seamless checkout experience with support for multiple payment methods including UPI, cards, net banking, and wallets.

## Features Implemented

### 1. Payment Gateway Integration
- **Razorpay Checkout**: Integrated Razorpay's hosted checkout solution
- **Multiple Payment Methods**: UPI, Debit/Credit Cards, Net Banking, Wallets
- **Secure Processing**: All payments are processed securely through Razorpay
- **Mobile Responsive**: Works seamlessly on all devices

### 2. Checkout Flow
- **3-Step Process**: Shipping → Payment → Success
- **Form Validation**: Comprehensive validation for shipping information
- **Order Summary**: Real-time order summary with item details
- **Progress Indicators**: Visual progress tracking through checkout steps

### 3. Order Management
- **Database Integration**: Orders stored in Supabase with complete details
- **Status Tracking**: Order and payment status management
- **Order History**: Users can view their order history
- **Cart Management**: Cart is cleared after successful payment

## Files Created/Modified

### 1. Core Payment Service
**File:** `src/services/razorpayService.js`
- Razorpay script loading
- Payment processing logic
- Order completion handling
- Amount formatting utilities

### 2. Checkout Page
**File:** `src/pages/Checkout.jsx`
- Complete checkout interface
- Shipping form with validation
- Payment method selection
- Order summary display
- Success confirmation

### 3. Orders Page
**File:** `src/pages/Orders.jsx`
- Order history display
- Order status tracking
- Payment status indicators
- Order details view

### 4. Updated Components
**File:** `src/pages/Cart.jsx`
- Added checkout navigation
- Updated purchase button

**File:** `src/App.jsx`
- Added checkout and orders routes
- Integrated Toaster for notifications

## Configuration

### Razorpay Credentials
```javascript
// Test Credentials (Replace with live credentials for production)
Key ID: rzp_test_TadG5QWoYmIZo6
Key Secret: o6JKWT31nQMeck5P6JxiS0Wn
```

### Payment Configuration
```javascript
// Razorpay Options
{
  key: 'rzp_test_TadG5QWoYmIZo6',
  currency: 'INR',
  name: 'Dharika Fashion',
  description: 'Purchase from Dharika Fashion',
  theme: {
    color: '#6f0e06'
  }
}
```

## Database Schema

### Orders Table
The integration uses the existing `orders` table with the following key fields:
- `payment_method`: 'razorpay'
- `payment_status`: 'pending' | 'completed' | 'failed'
- `status`: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
- `notes`: JSON string containing payment details

### Order Items Table
Links orders to products with quantity and pricing information.

## User Flow

### 1. Cart to Checkout
1. User adds items to cart
2. Clicks "Complete Purchase" in cart
3. Redirected to `/checkout`

### 2. Checkout Process
1. **Step 1 - Shipping Information**
   - User fills shipping form
   - Form validation occurs
   - Proceeds to payment step

2. **Step 2 - Payment**
   - Razorpay payment method displayed
   - User clicks "Pay" button
   - Razorpay checkout modal opens
   - User completes payment

3. **Step 3 - Success**
   - Payment confirmation displayed
   - Order details shown
   - Cart is cleared
   - User can continue shopping or view orders

### 3. Order Management
1. User can view orders at `/orders`
2. Order status and payment status displayed
3. Complete order details available

## Testing

### Test Payment Details
Use these test credentials with Razorpay:

**Test Cards:**
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI:**
- UPI ID: success@razorpay

**Test Net Banking:**
- Select any bank and use success credentials

### Test Scenarios
1. **Successful Payment**: Complete checkout with test credentials
2. **Payment Failure**: Use failure test credentials
3. **User Cancellation**: Close payment modal
4. **Form Validation**: Submit incomplete shipping form
5. **Order History**: View orders after successful payment

## Production Deployment

### 1. Update Razorpay Keys
Replace test keys with live keys in `razorpayService.js`:
```javascript
this.keyId = 'rzp_live_YOUR_KEY_ID';
this.keySecret = 'YOUR_KEY_SECRET'; // Keep this secure on backend
```

### 2. Backend Integration
For production, implement:
- Server-side order creation
- Payment verification webhooks
- Secure key storage
- Order status updates

### 3. Security Enhancements
- Implement payment signature verification
- Add webhook endpoints for payment status
- Use environment variables for keys
- Add rate limiting for payment attempts

## API Endpoints Used

### Supabase Integration
- `createOrder()`: Create order in database
- `updateOrderStatus()`: Update order status
- `getUserOrders()`: Fetch user orders
- `clearCart()`: Clear user cart

### Razorpay Integration
- Razorpay Checkout Script: `https://checkout.razorpay.com/v1/checkout.js`
- Payment processing through Razorpay's hosted solution

## Troubleshooting

### Common Issues

1. **Razorpay Script Not Loading**
   - Check internet connection
   - Verify script URL is accessible
   - Check for ad blockers

2. **Payment Modal Not Opening**
   - Ensure Razorpay script is loaded
   - Check browser console for errors
   - Verify payment data is correct

3. **Order Not Created**
   - Check user authentication
   - Verify cart has items
   - Check database permissions

4. **Cart Not Clearing**
   - Verify user ID is correct
   - Check cart service implementation
   - Ensure payment was successful

## Status: ✅ COMPLETED

The Razorpay payment integration is fully functional with:
- Complete checkout flow
- Order management
- Payment processing
- Error handling
- User-friendly interface

Users can now successfully make purchases using various payment methods through the integrated Razorpay gateway. 