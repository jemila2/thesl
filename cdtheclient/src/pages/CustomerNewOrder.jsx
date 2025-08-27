                                                    
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerNewOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    items: [],
    notes: '',
    pickupAddress: user?.address || '',
    deliveryAddress: user?.address || '',
    pickupDate: '',
    deliveryDate: '',
    deliveryOption: 'delivery' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Laundry services with Naira prices
  const laundryServices = [
    { id: 1, name: 'Wash & Fold (Regular)', price: 1500, type: 'laundry' },
    { id: 2, name: 'Wash & Fold (Delicate)', price: 2000, type: 'laundry' },
    { id: 3, name: 'Wash & Iron (Regular)', price: 2500, type: 'laundry' },
    { id: 4, name: 'Wash & Iron (Delicate)', price: 3000, type: 'laundry' },
    { id: 5, name: 'Dry Cleaning (Shirt)', price: 1200, type: 'drycleaning' },
    { id: 6, name: 'Dry Cleaning (Trouser)', price: 1500, type: 'drycleaning' },
    { id: 7, name: 'Dry Cleaning (Suit)', price: 5000, type: 'drycleaning' },
    { id: 8, name: 'Dry Cleaning (Dress)', price: 3500, type: 'drycleaning' },
    { id: 9, name: 'Ironing Only', price: 500, type: 'ironing' },
    { id: 10, name: 'Stain Removal', price: 1000, type: 'special' },
    { id: 11, name: 'Bedding (Single)', price: 2500, type: 'special' },
    { id: 12, name: 'Bedding (Double)', price: 3500, type: 'special' },
    { id: 13, name: 'Curtains (Light)', price: 4000, type: 'special' },
    { id: 14, name: 'Curtains (Heavy)', price: 6000, type: 'special' }
  ];

  const serviceCategories = [
    { id: 'all', name: 'All Services' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'drycleaning', name: 'Dry Cleaning' },
    { id: 'ironing', name: 'Ironing' },
    { id: 'special', name: 'Special Items' }
  ];

  const filteredServices = activeCategory === 'all' 
    ? laundryServices 
    : laundryServices.filter(service => service.type === activeCategory);

  const validateForm = () => {
    const errors = {};
    
    if (formData.items.length === 0) {
      errors.items = 'Please add at least one service';
    }
    
    if (formData.deliveryOption === 'delivery') {
      if (!formData.deliveryAddress.trim()) {
        errors.deliveryAddress = 'Delivery address is required';
      }
    }
    
    if (!formData.pickupAddress.trim()) {
      errors.pickupAddress = 'Pickup address is required';
    }
    
    if (!formData.pickupDate) {
      errors.pickupDate = 'Pickup date is required';
    } else {
      const pickupDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (pickupDate <= today) {
        errors.pickupDate = 'Pickup date must be in the future';
      }
    }
    
    if (formData.deliveryOption === 'delivery') {
      if (!formData.deliveryDate) {
        errors.deliveryDate = 'Delivery date is required';
      } else {
        const deliveryDate = new Date(formData.deliveryDate);
        const pickupDate = new Date(formData.pickupDate);
        
        if (deliveryDate <= pickupDate) {
          errors.deliveryDate = 'Delivery date must be after pickup date';
        }
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleAddItem = (service) => {
    const existingItemIndex = formData.items.findIndex(item => item.serviceId === service.id);
    
    if (existingItemIndex >= 0) {
      // If item already exists, increase quantity
      const newItems = [...formData.items];
      newItems[existingItemIndex].quantity += 1;
      setFormData({ ...formData, items: newItems });
    } else {
      // Add new item
      setFormData({
        ...formData,
        items: [...formData.items, {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
          type: service.type
        }]
      });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...formData.items];
    newItems[index].quantity = quantity > 0 ? quantity : 1;
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleDeliveryOptionChange = (option) => {
    setFormData({
      ...formData,
      deliveryOption: option,
    
      ...(option === 'pickup' && { deliveryDate: '' })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create dates with proper timezone handling
      const pickupDate = new Date(formData.pickupDate);
      pickupDate.setHours(12, 0, 0, 0);

      let deliveryDate = null;
      if (formData.deliveryOption === 'delivery' && formData.deliveryDate) {
        deliveryDate = new Date(formData.deliveryDate);
        deliveryDate.setHours(12, 0, 0, 0);
      }

      const orderData = {
        customerId: user?.id,
        items: formData.items,
        notes: formData.notes,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryOption === 'delivery' ? formData.deliveryAddress : '',
        pickupDate: pickupDate.toISOString(),
        deliveryDate: deliveryDate ? deliveryDate.toISOString() : null,
        deliveryOption: formData.deliveryOption,
        total: totalAmount,
        status: 'pending'
      };

      console.log('Submitting order:', orderData);
      
      const response = await axios.post('http://localhost:3001/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Order submitted successfully:', response.data);
      
      setOrderDetails(response.data);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Order submission error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to place order');
      } else {
        setError('There was an error placing your order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  const handleNewOrder = () => {
    setShowSuccessModal(false);
    // Reset form for a new order
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultPickupDate = formatDate(tomorrow);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    const defaultDeliveryDate = formatDate(dayAfterTomorrow);
    
    setFormData({
      items: [],
      notes: '',
      pickupAddress: user?.address || '',
      deliveryAddress: user?.address || '',
      pickupDate: defaultPickupDate,
      deliveryDate: defaultDeliveryDate,
      deliveryOption: 'delivery'
    });
  };

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultPickupDate = formatDate(tomorrow);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    const defaultDeliveryDate = formatDate(dayAfterTomorrow);
    
    setFormData(prev => ({
      ...prev,
      pickupDate: defaultPickupDate,
      deliveryDate: defaultDeliveryDate
    }));
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Success Modal Component
  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            
            <p className="text-gray-600 mb-6">
              Your laundry order has been received.
              {formData.deliveryOption === 'pickup' 
                ? ' You will pick up your order from our location.' 
                : ' Your order will be delivered to you.'}
            </p>
            
            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-gray-700 mb-2">Order Summary:</h3>
                <p className="text-sm text-gray-600">
                  <strong>Order ID:</strong> #{orderDetails._id?.substring(18) || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Amount:</strong> ₦{orderDetails.total?.toLocaleString() || totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pickup Date:</strong> {new Date(orderDetails.pickupDate || formData.pickupDate).toLocaleDateString()}
                </p>
                {formData.deliveryOption === 'delivery' && (
                  <p className="text-sm text-gray-600">
                    <strong>Delivery Date:</strong> {new Date(orderDetails.deliveryDate || formData.deliveryDate).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <strong>Service Type:</strong> {formData.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={handleNewOrder}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Place Another Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Order</h1>
        <p className="text-gray-600">Select services, schedule pickup and choose delivery option</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Services</h2>
            
            {/* Service Categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map(service => (
                <div key={service.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{service.name}</h3>
                      <p className="text-blue-600 font-semibold mt-1">₦{service.price.toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(service)}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      title={`Add ${service.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Details</h2>
            <form onSubmit={handleSubmit}>
              {/* Delivery Option Selection */}
              <div className="mb-5">
                <div className="block text-gray-700 mb-2 font-medium">Delivery Option</div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleDeliveryOptionChange('delivery')}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                      formData.deliveryOption === 'delivery'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">Delivery to Me</span>
                    <p className="text-sm mt-1">We deliver to your location</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeliveryOptionChange('pickup')}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                      formData.deliveryOption === 'pickup'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">I'll Pick Up</span>
                    <p className="text-sm mt-1">Pick up from our location</p>
                  </button>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="block text-gray-700 mb-2 font-medium">Pickup Address</div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  required
                  rows="2"
                  placeholder="Enter your pickup address"
                />
              </div>
              
              {formData.deliveryOption === 'delivery' && (
                <div className="mb-5">
                  <div className="block text-gray-700 mb-2 font-medium">Delivery Address</div>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                    required={formData.deliveryOption === 'delivery'}
                    rows="2"
                    placeholder="Enter your delivery address"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="block text-gray-700 mb-2 font-medium">Pickup Date</div>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                {formData.deliveryOption === 'delivery' && (
                  <div>
                    <div className="block text-gray-700 mb-2 font-medium">Delivery Date</div>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                        required={formData.deliveryOption === 'delivery'}
                        min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-5">
                <div className="block text-gray-700 mb-2 font-medium">Special Instructions</div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special handling instructions..."
                  rows="2"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Selected Services</h3>
                {formData.items.length === 0 ? (
                  <div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"></path>
                    </svg>
                    <p className="text-gray-500">No services added yet</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {formData.items.map((item, index) => (
                      <li key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">₦{item.price.toLocaleString()} per item</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors"
                            title="Remove service"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="flex items-center mt-3">
                          <div className="mr-3 text-sm font-medium text-gray-700">Quantity:</div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300"
                              disabled={item.quantity <= 1}
                            >
                              &minus;
                            </button>
                            <input
                              type="number"
                              min="1"
                              className="w-12 h-8 text-center border-t border-b border-gray-300"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-r-md border border-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <span className="ml-4 text-blue-600 font-semibold">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="border-t border-gray-300 pt-5">
                <div className="flex justify-between items-center font-semibold text-lg mb-5">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-blue-600">₦{totalAmount.toLocaleString()}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={formData.items.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </span>
                  ) : (
                    'Place Laundry Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal />
    </div>
  );
};

export default CustomerNewOrder;