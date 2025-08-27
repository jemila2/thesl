import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerAddOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    items: [],
    notes: '',
    pickupAddress: user.address || '',
    deliveryAddress: user.address || '',
    pickupDate: '',
    deliveryDate: ''
  });
  const [error, setError] = useState('');

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
    { id: 10, name: 'Stain Removal', price: 1000, type: 'special' }
  ];

  const handleAddItem = (service) => {
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

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // Validate form data first
    if (!formData.pickupDate || !formData.deliveryDate) {
      throw new Error('Please select pickup and delivery dates');
    }

    if (formData.items.length === 0) {
      throw new Error('Please add at least one service');
    }

    // 1. FIRST define orderData
    const orderData = {
      customerId: user._id,
      items: formData.items.map(item => ({
        serviceId: item.serviceId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
      })),
      notes: formData.notes,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      pickupDate: new Date(formData.pickupDate).toISOString(),
      deliveryDate: new Date(formData.deliveryDate).toISOString(),
      total: formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
    };

    // 2. THEN use it
    console.log('Order data:', orderData); // ✅ Now it's defined

    const response = await axios.post(
      'http://localhost:5000/api/orders',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      navigate('/customer/orders');
    } else {
      setError(response.data.message || 'Failed to create order');
    }
  } catch (error) {
    console.error('Full error:', error);
    setError(
      error.response?.data?.message || 
      error.message || 
      'Failed to create order. Please try again.'
    );
  }
};

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
   <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Laundry Order</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Select Services</h2>
            
            {/* Laundry Services */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-blue-600">Laundry Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {laundryServices.filter(s => s.type === 'laundry').map(service => (
                  <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-gray-600">₦{service.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleAddItem(service)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Add Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dry Cleaning Services */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-green-600">Dry Cleaning Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {laundryServices.filter(s => s.type === 'drycleaning').map(service => (
                  <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-gray-600">₦{service.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleAddItem(service)}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Add Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Other Services */}
            <div>
              <h3 className="font-medium mb-3 text-purple-600">Other Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {laundryServices.filter(s => s.type !== 'laundry' && s.type !== 'drycleaning').map(service => (
                  <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-gray-600">₦{service.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleAddItem(service)}
                      className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Add Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="block text-gray-700 mb-2">Pickup Address</div>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <div className="block text-gray-700 mb-2">Delivery Address</div>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="block text-gray-700 mb-2">Pickup Date</div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <div className="block text-gray-700 mb-2">Delivery Date</div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                    required
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="block text-gray-700 mb-2">Special Instructions</div>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special handling instructions..."
                />
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Selected Services</h3>
                {formData.items.length === 0 ? (
                  <p className="text-gray-500">No services added yet</p>
                ) : (
                  <ul className="divide-y">
                    {formData.items.map((item, index) => (
                      <li key={index} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">₦{item.price.toLocaleString()} per item</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="mr-2 text-sm">Quantity:</div>
                          <input
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 border rounded"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          />
                          <span className="ml-2 text-sm">
                            = ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
                  disabled={formData.items.length === 0}
                >
                  Place Laundry Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAddOrder;                                                      
