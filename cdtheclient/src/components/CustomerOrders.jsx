

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../../services/api';
import { toast } from 'react-toastify';
import EmployeeSidebar from '../components/EmployeeSidebar';

const CustomerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the orderApi from your services
      const response = await orderApi.getAllOrders();
      
      // Handle different response structures
      const ordersData = response.data?.data || response.data?.orders || response.data || [];
      
      if (!Array.isArray(ordersData)) {
        throw new Error('Invalid orders data format received from API');
      }
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Order fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'employee') {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderNumber?.toString().includes(searchTerm) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower)) ||
      (order.status && order.status.toLowerCase().includes(searchLower))
    );
  });

  if (user?.role !== 'employee') {
    return (
      <div className="flex">
        <EmployeeSidebar />
        <div className="p-4 text-red-500 ml-54">Access denied. Employees only.</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <EmployeeSidebar />
      
      <div className="ml-54 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Manage Orders </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Orders ({filteredOrders.length})</h2>
            <input
              type="text"
              placeholder="Search orders..."
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.customer?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${order.total ? order.total.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              {orders.length === 0 ? 'No orders available' : 'No orders match your search'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;