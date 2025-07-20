import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    // Auto-redirect to orders page after 15 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderDetails && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Order Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Order ID:</span>
                  <p className="font-medium">{orderDetails.id?.slice(0, 8) || 'Processing...'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">₹{orderDetails.total_amount?.toLocaleString('en-IN') || '0'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment:</span>
                  <p className="font-medium text-green-600">Completed</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium text-green-600">Confirmed</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Order confirmed</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Processing your order</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Will be shipped soon</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              You will receive an order confirmation email shortly.
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={handleViewOrders} 
                className="w-full"
              >
                View My Orders
              </Button>
              <Button 
                onClick={handleContinueShopping} 
                variant="outline" 
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Redirecting to orders page in 15 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;