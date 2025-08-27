
import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiCheckCircle, FiClock, FiSearch } from 'react-icons/fi';

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'processing'
  );

  const filteredOrders = pendingOrders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.orderNumber && order.orderNumber.toString().includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Orders ({pendingOrders.length})</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      <div className="relative w-64 mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.orderNumber || order._id.slice(-6)}</h3>
                <p className="text-sm text-gray-500">
                  {order.customer?.name || 'Unknown Customer'}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Items:</strong> {order.items?.length || 0}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => updateOrderStatus(order._id, 'processing')}
                className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={order.status === 'processing'}
              >
                <FiClock className="mr-2" />
                Mark as Processing
              </button>
              
              <button
                onClick={() => updateOrderStatus(order._id, 'completed')}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FiCheckCircle className="mr-2" />
                Mark as Completed
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {pendingOrders.length === 0 ? 'No pending orders' : 'No orders match your search'}
        </div>
      )}
    </div>
  );
};

export default EmployeeOrders;