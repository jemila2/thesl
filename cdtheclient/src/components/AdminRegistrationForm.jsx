
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminRegistrationForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });
  const [loading, setLoading] = useState(false);

  const apiRequest = async (endpoint, options = {}) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate secret key
    if (formData.secretKey !== 'ADMIN_SETUP_2024') {
      toast.error('Invalid admin secret key');
      setLoading(false);
      return;
    }

    try {
      // CORRECTED ENDPOINT: Use /admin/register-admin instead of /auth/register-admin
      const response = await apiRequest('/admin/register-admin', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          secretKey: formData.secretKey
        })
      });

      toast.success('Admin account created successfully!');
      
      // Log in the new admin
      if (response.token) {
        localStorage.setItem('token', response.token);
        login(response.user);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secretKey: ''
      });

      // Notify parent component
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Admin Registration</h3>
      <p className="text-gray-600 mb-4 text-center text-sm">
        Create the first admin account for your application
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter your email address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Create a strong password"
            minLength="6"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Confirm your password"
            minLength="6"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Secret Key</label>
          <input
            type="password"
            name="secretKey"
            required
            value={formData.secretKey}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter the admin setup key"
          />
          <p className="text-xs text-gray-500 mt-1">Hint: ADMIN_SETUP_2024</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
        </button>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;