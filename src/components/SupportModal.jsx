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
      
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: Shield,
          content: (
            <div className="space-y-6 text-sm leading-relaxed">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="font-semibold text-foreground mb-2">Effective Date: 10 July 2025</p>
                <p className="text-foreground/80">
                  This Privacy Policy governs the manner in which Dharika collects, uses, stores, shares, and protects your information in accordance with applicable Indian laws, including the Digital Personal Data Protection Act, 2023.
                </p>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="font-semibold text-foreground mb-2">1. Applicability</h4>
                  <p className="text-foreground/80">
                    This Privacy Policy applies to all Users of our website, mobile site, and associated services. It shall govern all information collected online and shall form an integral part of the general terms and conditions of usage of our Platform.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">2. Collection of Personal Information</h4>
                  <p className="text-foreground/80 mb-3">
                    We may collect personal information that you voluntarily provide while using the Platform, including but not limited to:
                  </p>
                  <ul className="space-y-1 text-foreground/80 ml-4">
                    <li>• Your full name, contact number, email address, and shipping/billing address</li>
                    <li>• Transaction-related details such as order history and payment status</li>
                    <li>• Communication data including emails, queries, feedback, or chat interactions</li>
                    <li>• Data submitted during promotional campaigns, contests, or form submissions</li>
                  </ul>
                  <p className="text-foreground/80 mt-3">
                    Additionally, technical data may be collected automatically when you access or interact with the Platform, including your IP address, browser type, operating system, device type, browsing behavior, and cookies.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">3. Purpose of Collection and Lawful Basis</h4>
                  <p className="text-foreground/80 mb-3">
                    The information collected shall be used solely for lawful and legitimate business purposes, which may include:
                  </p>
                  <ul className="space-y-1 text-foreground/80 ml-4">
                    <li>• Processing, confirming, fulfilling, and tracking your orders and transactions</li>
                    <li>• Responding to service-related queries, exchange or return requests</li>
                    <li>• Sending you notifications regarding your purchases, account activity, or promotional offers</li>
                    <li>• Improving the Platform's design, content, and functionality through analytics</li>
                    <li>• Detecting and preventing fraud, security breaches, and other unlawful activity</li>
                    <li>• Complying with statutory obligations where applicable</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">4. Disclosure of Information</h4>
                  <p className="text-foreground/80 mb-3">
                    Your personal information shall not be disclosed to any third party without your consent, except as provided under this Policy or as required by applicable law. Disclosure may occur in the following circumstances:
                  </p>
                  <ul className="space-y-1 text-foreground/80 ml-4">
                    <li>• To payment gateways for the purpose of processing your transactions securely</li>
                    <li>• To logistics and courier partners for delivery and return operations</li>
                    <li>• To technology vendors and cloud storage providers under strict confidentiality agreements</li>
                    <li>• To regulatory authorities or legal enforcement agencies, if required under applicable laws</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">5. Use of Cookies and Tracking Technologies</h4>
                  <p className="text-foreground/80">
                    The Platform may use cookies, pixels, and similar technologies to enhance your browsing experience. By using the Platform, you consent to our use of such technologies. You may disable cookies in your browser settings; however, doing so may affect certain functionalities of the Platform.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">6. Data Security Measures</h4>
                  <p className="text-foreground/80">
                    We undertake reasonable and appropriate security measures including SSL encryption for all data transmission, secure server infrastructure with access controls, periodic vulnerability scans and audits, and protection against unauthorized alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">7. User Rights and Grievance Redressal</h4>
                  <p className="text-foreground/80 mb-3">
                    As a user, you are entitled under Indian law to exercise the following rights:
                  </p>
                  <ul className="space-y-1 text-foreground/80 ml-4">
                    <li>• The right to access and review your personal data</li>
                    <li>• The right to correct or update inaccurate or incomplete data</li>
                    <li>• The right to withdraw your consent at any time</li>
                    <li>• The right to request erasure of your data under applicable grounds</li>
                    <li>• The right to lodge a grievance with the designated officer</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      For any requests or grievances, contact us at: <strong>Support@dharika.co.in</strong>
                    </p>
                    <p className="text-blue-700 text-xs mt-1">We shall respond within seven (7) business days of receipt.</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">8. Children's Privacy</h4>
                  <p className="text-foreground/80">
                    The Platform is not intended for use by children under the age of eighteen (18). If you are underage, you may use the Platform only under the supervision and consent of a parent or legal guardian.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">9. Amendments and Modifications</h4>
                  <p className="text-foreground/80">
                    We reserve the right to amend this Privacy Policy at any time without prior notice. All changes shall be effective upon publication on this page. Continued use of the Platform following any changes shall constitute your deemed acceptance of the updated Policy.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">10. Contact Information</h4>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <p className="text-foreground font-medium mb-2">Grievance Officer – Dharika</p>
                    <p className="text-foreground/80">📧 Email: privacy@dharika.co.in</p>
                    <p className="text-foreground/80">📍 Address: [Insert Legal Address]</p>
                  </div>
                </section>
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white sticky top-0 z-10">
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
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
              {content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;