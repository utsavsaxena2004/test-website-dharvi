import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Shield, RefreshCw, Heart } from 'lucide-react';

const SupportModal = ({ isOpen, onClose, modalType }) => {
  const getModalContent = () => {
    switch (modalType) {
      case 'care':
        return {
          title: 'Care Instructions',
          icon: Heart,
          content: (
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                To preserve the quality and longevity of your pure cotton garment, we recommend the following care:
              </p>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Hand wash separately in cold water or use a gentle machine cycle</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Use mild detergents only</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Do not bleach</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Dry in shade to avoid fading</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Iron on low to medium heat, preferably on reverse side</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Avoid tumble drying for best results</span>
                </li>
              </ul>
            </div>
          )
        };
      
      case 'shipping':
        return {
          title: 'Shipping & Delivery',
          icon: Truck,
          content: (
            <div className="space-y-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Delivery Timeline</h4>
                </div>
                <p className="text-foreground/80 mb-2">
                  <strong>Estimated delivery:</strong> 7–15 business days
                </p>
                <p className="text-sm text-foreground/70">
                  Timelines may vary slightly based on your PIN code and local logistics conditions
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Free Shipping All Over India</h4>
                </div>
                <p className="text-green-700 mt-2">
                  We currently ship across all serviceable locations in India
                </p>
              </div>
            </div>
          )
        };
      
      case 'returns':
        return {
          title: 'Exchange & Return Policy',
          icon: RefreshCw,
          content: (
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                We strive to ensure you receive your order in perfect condition. Kindly note the following:
              </p>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Returns
                </h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Accepted only in the case of a damaged or defective article</li>
                  <li>• A clear unboxing video must be provided at the time of complaint submission</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Exchanges (for size issues only)
                </h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>• Can be requested within 7 days of receiving the product</li>
                  <li>• Applicable for one-time exchange per product</li>
                  <li>• Exchange requests can be made through our website's exchange portal</li>
                  <li>• Product must be unused, with tags intact and original packaging preserved</li>
                  <li>• A parcel opening video and visual proof of sizing issue is mandatory for eligibility</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm font-medium">
                  <strong>Note:</strong> Products returned without a valid reason or required proof will not be eligible for replacement or refund.
                </p>
              </div>
            </div>
          )
        };
      
      default:
        return {
          title: 'Information',
          icon: Shield,
          content: <p>No information available.</p>
        };
    }
  };

  const { title, icon: Icon, content } = getModalContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;