


import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SERVICE_OPTIONS = [
  { id: 'wash_fold', name: 'Wash & Fold', basePrice: 1000 },    
  { id: 'dry_clean', name: 'Dry Cleaning', basePrice: 2500 },   
  { id: 'ironing', name: 'Ironing', basePrice: 1500 },          
  { id: 'special', name: 'Special Care', basePrice: 5000 }     
];

const NewOrderPage = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICE_OPTIONS[0].id);
  const [price, setPrice] = useState(SERVICE_OPTIONS[0].basePrice.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createOrder } = useAuth();
  const navigate = useNavigate();

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);
    const service = SERVICE_OPTIONS.find(s => s.id === serviceId);
    setPrice(service.basePrice.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) {
      setError('Please enter a valid price');
      return;
    }
    
    if (priceValue <= 0) {
      setError('Price must be greater than ₦0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        services: [selectedServiceId],
        total: priceValue
      };
      
      await createOrder(orderData);
      navigate('/orders');
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Server is not responding. Please try again later.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Laundry Order</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block mb-2 font-medium">Service Type</div>
          <select
            value={selectedServiceId}
            onChange={handleServiceChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SERVICE_OPTIONS.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} ({formatNaira(service.basePrice)})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="block mb-2 font-medium">Price (₦)</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="100"
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Suggested price: {formatNaira(SERVICE_OPTIONS.find(s => s.id === selectedServiceId).basePrice)}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Order...
            </>
          ) : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default NewOrderPage;