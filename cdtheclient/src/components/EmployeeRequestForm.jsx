
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EmployeeRequestForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    position: '',
    experience: '',
    skills: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const apiRequest = async (endpoint, options = {}) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    
    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the request data
      const requestData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        ...formData,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      // Save employee request to database
      await apiRequest('/employee-requests', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      toast.success('Employee request submitted! An admin will review your application.');
      setHasRequested(true);
    } catch (error) {
      console.error('Request error:', error);
      if (error.message.includes('404')) {
        toast.error('Server endpoint not found. Please contact support.');
      } else {
        toast.error('Failed to submit employee request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasRequested) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-bold text-green-600 mb-2">Request Submitted!</h3>
        <p className="text-gray-600">
          Your employee request has been sent for admin approval. 
          You'll be notified once it's reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Request Employee Status</h3>
      <p className="text-gray-600 mb-4">
        Fill out this form to request becoming an employee. An admin will review your request.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-700">Desired Position</div>
          <select
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select a position</option>
            <option value="Laundry Attendant">Laundry Attendant</option>
            <option value="Dry Cleaning Specialist">Dry Cleaning Specialist</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Delivery Driver">Delivery Driver</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Experience (years)
          </div>
          <input
            type="number"
            min="0"
            required
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Relevant Skills
          </div>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="3"
            placeholder="List any relevant skills or qualifications..."
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Why do you want to become an employee?
          </div>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="3"
            placeholder="Explain why you want to work with us..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRequestForm;