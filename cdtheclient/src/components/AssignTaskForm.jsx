

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignTaskForm = ({ orders = [], users = [], onTaskCreated, onCancel }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    orderId: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersList, setUsersList] = useState(users);

  // Fetch users if not provided
  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        setUsersLoading(true);
        try {
          const response = await api.get('/users');
          setUsersList(response.data);
        } catch (err) {
          toast.error('Failed to load users');
          console.error('Users fetch error:', err);
        } finally {
          setUsersLoading(false);
        }
      } else {
        setUsersList(users);
      }
    };

    fetchUsers();
  }, [users, api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.assignee) {
      toast.error('Please select an assignee');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };
      
      if (!formData.orderId) {
        delete payload.orderId;
      }
      
      const response = await api.post('/tasks', payload);
      
      toast.success('Task created successfully!');
      onTaskCreated(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task');
      console.error('Task creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSelect = (order) => {
    setFormData(prev => ({ 
      ...prev, 
      orderId: order._id,
      title: prev.title || `Order #${order.orderNumber || order._id}`,
      description: prev.description || `Task for order #${order.orderNumber || order._id} - ${order.customerName || 'Customer'}`
    }));
    setShowOrderDropdown(false);
    setOrderSearch('');
  };

  const clearOrderSelection = () => {
    setFormData(prev => ({ ...prev, orderId: '' }));
  };

  // Filter orders based on search input with safe property access
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const orderNumber = order.orderNumber || '';
    const customerName = order.customerName || '';
    
    return (
      orderNumber.toString().toLowerCase().includes(orderSearch.toLowerCase()) ||
      customerName.toString().toLowerCase().includes(orderSearch.toLowerCase())
    );
  });

  // Find selected order for display
  const selectedOrder = orders.find(order => order && order._id === formData.orderId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showOrderDropdown && !e.target.closest('.order-dropdown-container')) {
        setShowOrderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOrderDropdown]);

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Assign New Task</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-2xl"
          type="button"
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Selection */}
        <div className="relative order-dropdown-container">
          <div className="block text-sm font-medium text-gray-700 mb-1">Related Order (Optional)</div>
          {selectedOrder ? (
            <div className="border rounded-md p-3 bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{selectedOrder.orderNumber || selectedOrder._id}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerName || 'Customer'}</p>
              </div>
              <button
                type="button"
                onClick={clearOrderSelection}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search orders or click to view all..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                onFocus={() => setShowOrderDropdown(true)}
                className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showOrderDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredOrders.length > 0 ? (
                    <>
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-xs text-gray-500">
                          {orderSearch ? 'Search results' : 'All orders'} ({filteredOrders.length})
                        </p>
                      </div>
                      {filteredOrders.map(order => (
                        <div
                          key={order._id}
                          onClick={() => handleOrderSelect(order)}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b"
                        >
                          <p className="font-medium">Order #{order.orderNumber || order._id}</p>
                          <p className="text-sm text-gray-600">{order.customerName || 'Customer'}</p>
                          <p className="text-xs text-gray-500">{order.status || 'No status'}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-3 text-gray-500">No orders found</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700">Title *</div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">Description</div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="block text-sm font-medium text-gray-700">Assign To *</div>
            {usersLoading ? (
              <div className="mt-1 block w-full border rounded-md p-2 bg-gray-100">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : (
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {usersList.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <div className="block text-sm font-medium text-gray-700">Due Date *</div>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="block text-sm font-medium text-gray-700">Priority</div>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <div className="block text-sm font-medium text-gray-700">Status</div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || usersLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              loading || usersLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignTaskForm;