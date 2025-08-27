import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', 
    role: 'staff', 
    salary: '',
    position: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Block non-admin access
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded">
        <h2 className="text-xl font-bold text-red-800">Access Denied</h2>
        <p className="mt-2 text-red-600">
          You must be an administrator to access this page.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Name, email and password are required');
      }

      // Send request with admin auth token
      const response = await axios.post(
        'http://localhost:5000/api/employees',
        {
          ...formData,
          createdBy: user._id // Track which admin created this employee
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSuccess('Employee added successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'staff',
        salary: '',
        position: ''
      });

      // Optional: Redirect after delay
      setTimeout(() => navigate('/admin/employees'), 1500);
    } catch (err) {
      console.error('Employee creation error:', err.response?.data || err.message);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to add employee. Please try again.'
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Employee</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-gray-700 mb-1">Full Name</div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Email</div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Temporary Password</div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            minLength="6"
          />
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Phone</div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Role</div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
           
          </select>
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Salary (₦)</div>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <div className="block text-gray-700 mb-1">Position</div>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;