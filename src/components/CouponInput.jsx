import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import couponService from '@/services/couponService';

const CouponInput = ({ cartTotal, onCouponApplied, appliedCoupon, onCouponRemoved }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await couponService.validateCoupon(couponCode.trim().toUpperCase(), cartTotal);
      
      if (result.valid) {
        onCouponApplied({
          id: result.coupon_id,
          code: couponCode.trim().toUpperCase(),
          discount: result.discount_amount
        });
        setCouponCode('');
        toast({
          title: "Success",
          description: result.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed from your order",
      variant: "default"
    });
  };

  if (appliedCoupon) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Applied Coupon</label>
        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-success" />
            <div>
              <p className="font-medium text-success">{appliedCoupon.code}</p>
              <p className="text-sm text-muted-foreground">
                Discount: ₹{appliedCoupon.discount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Coupon Code</label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
          disabled={isLoading}
        />
        <Button 
          onClick={handleApplyCoupon}
          disabled={isLoading || !couponCode.trim()}
          className="px-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;