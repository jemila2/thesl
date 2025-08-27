import React, { useState, useEffect } from 'react';
import { FiPackage, FiUserCheck, FiTruck, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const OrderStatusWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(oldProgress + 1, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: "Order Received",
      description: "Your order has been received and is being processed.",
      icon: <FiPackage className="text-blue-500" />,
      status: "completed",
      time: "2 minutes ago"
    },
    {
      title: "Order Confirmed",
      description: "We've verified your order details and payment.",
      icon: <FiUserCheck className="text-blue-500" />,
      status: "completed",
      time: "1 minute ago"
    },
    {
      title: "Processing",
      description: "Our team is preparing your order for dispatch.",
      icon: <FiClock className="text-yellow-500" />,
      status: "active",
      time: "In progress"
    },
    {
      title: "Shipped",
      description: "Your order has been shipped and is on its way.",
      icon: <FiTruck className="text-gray-400" />,
      status: "pending",
      time: "Estimated: Tomorrow"
    },
    {
      title: "Delivered",
      description: "Your order has been delivered successfully.",
      icon: <FiCheckCircle className="text-gray-400" />,
      status: "pending",
      time: "Estimated: 2 days"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-2xl font-bold mb-2">Your Order Status</h1>
          <p className="opacity-90">Order #ORD-782931 | Placed on October 15, 2023</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border-b">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-700">1</div>
            <p className="text-blue-600">Total Orders</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-700">1</div>
            <p className="text-yellow-600">Pending Orders</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-700">0</div>
            <p className="text-green-600">Completed Orders</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-blue-600">Order Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">What happens next?</h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex">
                {/* Timeline connector and icon */}
                <div className="flex flex-col items-center mr-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    step.status === 'completed' ? 'bg-blue-100 border-blue-500' : 
                    step.status === 'active' ? 'bg-yellow-100 border-yellow-500' : 
                    'bg-gray-100 border-gray-300'
                  }`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-1 h-16 ${
                      steps[index+1].status === 'completed' ? 'bg-blue-500' : 
                      steps[index+1].status === 'active' ? 'bg-blue-300' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
                
                {/* Step content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-medium ${
                        step.status === 'completed' ? 'text-blue-700' : 
                        step.status === 'active' ? 'text-yellow-700' : 
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      step.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      step.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.time}
                    </span>
                  </div>
                  
                  {step.status === 'active' && (
                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex">
                        <FiAlertCircle className="text-yellow-500 mr-2 mt-1" />
                        <p className="text-yellow-700">
                          Our team is currently working on your order. You'll receive a notification when it's shipped.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Need help with your order?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center">
              <FiClock className="mr-2" /> Track Order
            </button>
            <button className="flex-1 bg-indigo-600 rounded-lg py-3 px-4 text-white hover:bg-indigo-700 transition flex items-center justify-center">
              <FiAlertCircle className="mr-2" /> Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusWorkflow;