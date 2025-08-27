
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [services, setServices] = useState([
    { type: 'Wash & Fold', quantity: 1, price: 15.00 }
  ]);
  const [pickupDate, setPickupDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'customer') {
      setSelectedCustomer(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchCustomers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/customers');
          setCustomers(response.data);
        } catch (err) {
          setError('Failed to fetch customers');
        }
      };
      fetchCustomers();
    }
  }, [user]);

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { type: 'Wash & Fold', quantity: 1, price: 15.00 }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index);
      setServices(newServices);
    }
  };
  
const submitOrder = async () => {
  const orderData = {
    customer: formData.customerId,  
    services: formData.items.map(item => ({
      type: item.type === 'laundry' ? 'Wash & Fold' : item.type,
      quantity: item.quantity,
      price: item.price,
      description: item.name
    })),
    pickupDate: formData.pickupDate,
    deliveryDate: formData.deliveryDate,
    specialInstructions: formData.notes,
    pickupAddress: formData.pickupAddress,
    deliveryAddress: formData.deliveryAddress,
    totalAmount: formData.total,
    status: formData.status
  };

  try {
    const response = await axios.post('/api/orders', orderData);
    console.log('Order created:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

  const calculateTotal = () => {
    return services.reduce((total, service) => total + (service.quantity * service.price), 0);
  };

const handleSubmit = async (formData) => {
  try {
    const response = await axios.post('/api/orders', formData);
    console.log('Order created:', response.data);
  } catch (error) {
    console.error('Full error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};
  const serviceTypes = [
    { value: 'Wash & Fold', label: 'Wash & Fold ($15/bag)' },
    { value: 'Dry Clean', label: 'Dry Clean ($5/item)' },
    { value: 'Ironing', label: 'Ironing ($10/bag)' }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {user?.role === 'admin' ? 'Create New Order' : 'Place Laundry Order'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Selection (Admin Only) */}
        {user?.role === 'admin' ? (
          <div className="mb-6">
            <div className="block text-gray-700 mb-2">Customer *</div>
            <select
              className="w-full px-3 py-2 border rounded"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} ({customer.phone})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-blue-50 rounded">
            <p className="font-medium">Order for: {user?.name}</p>
          </div>
        )}

        {/* Laundry Services */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Laundry Services</h3>
            <button
              type="button"
              onClick={addService}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add Service
            </button>
          </div>

          {services.map((service, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="block text-gray-700 mb-1">Service Type *</div>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={service.type}
                    onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                    required
                  >
                    {serviceTypes.map(st => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="block text-gray-700 mb-1">Quantity *</div>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="block text-gray-700 mb-1">Price *</div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeService(index)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
                disabled={services.length <= 1}
              >
                Remove Service
              </button>
            </div>
          ))}
        </div>

        {/* Pickup/Delivery Information */}
        <div className="mb-6">
          <div className="block text-gray-700 mb-2">Pickup Date *</div>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="mb-6">
          <div className="block text-gray-700 mb-2">Special Instructions</div>
          <textarea
            className="w-full px-3 py-2 border rounded"
            rows="3"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Fragile items, allergies, etc."
          />
        </div>

        {/* Order Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {user?.role === 'admin' ? 'Create Order' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;