import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeForm = ({ employee }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(employee || {
    name: '',
    email: '',
    password: '',
    role: '',
    salary: '',
    contact: '',
    address: '',
    hireDate: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    } else if (!['washer', 'ironer', 'delivery', 'manager'].includes(formData.role)) {
      newErrors.role = 'Please select a valid role';
    }
    if (!formData.password && !employee?._id) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.salary || isNaN(formData.salary)) newErrors.salary = 'Valid salary is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        salary: Number(formData.salary),
        contact: formData.contact,
        address: formData.address,
        hireDate: formData.hireDate
      };

      if (!employee?._id) {
        payload.password = formData.password;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      if (employee?._id) {
        await axios.put(
          `http://localhost:3001/api/employees/${employee._id}`,
          payload,
          config
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/employees',
          payload,
          config
        );
      }
      
      navigate('/employees');
    } catch (err) {
      console.error('API Error:', err.response?.data);
      setApiError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        `Failed to ${employee?._id ? 'update' : 'create'} employee`
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {employee?._id ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Full Name*</div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Email*</div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {!employee?._id && (
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">Password*</div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
        )}

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Role*</div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a role</option>
            <option value="washer">Washer</option>
            <option value="ironer">Ironer</option>
            <option value="delivery">Delivery</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Salary (₦)*</div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₦</span>
            </div>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`block w-full pl-7 pr-12 py-2 border rounded-md ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="50000"
              aria-describedby="salary-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="salary-currency">
                NGN
              </span>
            </div>
          </div>
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</div>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.contact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+2348012345678"
          />
          {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Address</div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="123 Main St, Lagos"
          />
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Hire Date</div>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {employee?._id ? 'Update' : 'Create'} Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;