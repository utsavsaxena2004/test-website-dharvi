import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormAutoSave } from '../hooks/useRouteState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Save, Trash2, CheckCircle } from 'lucide-react';

const StatePersistenceDemo = () => {
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    message: '',
    preferences: ''
  });

  const { clearSavedData, saveNow } = useFormAutoSave('demo_form', demoForm, setDemoForm, {
    autoSaveDelay: 1500,
    excludeFields: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDemoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearForm = () => {
    setDemoForm({
      name: '',
      email: '',
      message: '',
      preferences: ''
    });
    clearSavedData();
  };

  const handleSaveNow = () => {
    saveNow();
    // Show visual feedback
    const button = document.getElementById('save-now-btn');
    if (button) {
      button.classList.add('bg-green-500');
      setTimeout(() => {
        button.classList.remove('bg-green-500');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            State Persistence Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This demo shows how the website now maintains your data across page refreshes. 
            Try filling out the form, then refresh the page - your data will be preserved!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white rounded-t-lg">
                <CardTitle className="font-serif">Demo Form</CardTitle>
                <CardDescription className="text-white/90">
                  Fill out this form and try refreshing the page
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    name="name"
                    value={demoForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={demoForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={demoForm.message}
                    onChange={handleInputChange}
                    placeholder="Write your message..."
                    className="border-rose-200 focus:border-[#ba1a5d] h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferences
                  </label>
                  <Input
                    name="preferences"
                    value={demoForm.preferences}
                    onChange={handleInputChange}
                    placeholder="Any special preferences?"
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    id="save-now-btn"
                    onClick={handleSaveNow}
                    className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Now
                  </Button>
                  <Button
                    onClick={handleClearForm}
                    variant="outline"
                    className="border-rose-200 hover:bg-rose-50 flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="border-green-200 bg-green-50/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  State Persistence Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white mt-0.5">✓</Badge>
                    <div>
                      <h4 className="font-medium text-green-800">Form Auto-Save</h4>
                      <p className="text-sm text-green-700">
                        Form data is automatically saved as you type with a smart debounce system
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white mt-0.5">✓</Badge>
                    <div>
                      <h4 className="font-medium text-green-800">Page State Preservation</h4>
                      <p className="text-sm text-green-700">
                        Current page, admin panel tabs, and navigation state are preserved
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white mt-0.5">✓</Badge>
                    <div>
                      <h4 className="font-medium text-green-800">Smart Data Expiration</h4>
                      <p className="text-sm text-green-700">
                        Saved data automatically expires based on sensitivity and usage patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white mt-0.5">✓</Badge>
                    <div>
                      <h4 className="font-medium text-green-800">Security Conscious</h4>
                      <p className="text-sm text-green-700">
                        Sensitive data like passwords are never saved to localStorage
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white mt-0.5">✓</Badge>
                    <div>
                      <h4 className="font-medium text-green-800">Automatic Cleanup</h4>
                      <p className="text-sm text-green-700">
                        Old and expired data is automatically cleaned up to prevent storage bloat
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-blue-800 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  How to Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>Fill out some fields in the demo form</li>
                  <li>Refresh this page (Ctrl+R or F5)</li>
                  <li>Notice your data is still there!</li>
                  <li>Try navigating to other pages and coming back</li>
                  <li>Visit the admin panel and notice tab persistence</li>
                  <li>Try the checkout or custom design forms</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-amber-800">
                  Implementation Across the Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-amber-700 space-y-2">
                  <p><strong>Checkout:</strong> Shipping details and current step preserved</p>
                  <p><strong>Custom Design:</strong> Form data, upload progress, and current step saved</p>
                  <p><strong>Admin Panel:</strong> Active tab, form data, and settings preserved</p>
                  <p><strong>Category Pages:</strong> Sort and filter preferences remembered</p>
                  <p><strong>Auth Forms:</strong> Email remembered (but not password for security)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-rose-200">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">
              🎉 Enhanced User Experience
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Your Dharika Fashion website now provides a seamless experience where users never lose their progress. 
              Whether they're filling out a custom design request, going through checkout, or managing the admin panel, 
              their data is safely preserved across page refreshes and navigation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatePersistenceDemo; 