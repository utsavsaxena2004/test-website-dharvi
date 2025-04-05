import React from 'react';
import { Link } from 'react-router-dom';

const SimpleCartPage = () => {
  console.log('SimpleCartPage rendering');
  
  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart (Simple Version)</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center">This is a simplified cart page for testing</p>
          <Link to="/" className="block mt-4 text-center text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleCartPage; 