import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuth(); 
  const navigate = useNavigate();

 
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);


  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Access Denied</h2>
        <p>You must be an admin to add customers.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.phone || !formData.address) {
      setError('All fields are required');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add customer');
      }

      navigate('/customers');
    } catch (err) {
      console.error('Add customer error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Customer</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="block text-gray-700 mb-2" htmlFor="name">
            Name *
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="block text-gray-700 mb-2" htmlFor="phone">
            Phone *
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 block w-full px-3 py-2 border rounded"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="block text-gray-700 mb-2" htmlFor="address">
            Address *
            <textarea
              id="address"
              name="address"
              className="mt-1 block w-full px-3 py-2 border rounded"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Adding...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;