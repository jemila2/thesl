






import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await axios.get('http://localhost:3001/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Invalid response');
      }

      const normalizedOrders = (response.data.orders || []).map(order => ({
        _id: order._id,
        services: Array.isArray(order.services) ? order.services : [],
        total: typeof order.total === 'number' ? order.total : 0,
        status: order.status?.toLowerCase() || 'pending', 
        createdAt: order.createdAt || new Date()
      }));

      setOrders(normalizedOrders);
    } catch (err) {
      console.error('Order fetch error:', {
        message: err.message,
        response: err.response?.data
      });
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user]);


  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const statusCounts = {
    all: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold ">My Orders</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => navigate('/new-order')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FiPlus /> New Order
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 text-sm">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full ${statusFilter === 'all' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100'}`}
          >
            All ({statusCounts.all})
          </button>
          <button 
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-full ${statusFilter === 'completed' ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100'}`}
          >
            Completed ({statusCounts.completed})
          </button>
          <button 
            onClick={() => setStatusFilter('processing')}
            className={`px-3 py-1 rounded-full ${statusFilter === 'processing' ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-gray-100'}`}
          >
            Processing ({statusCounts.processing})
          </button>
          <button 
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-full ${statusFilter === 'pending' ? 'bg-gray-200 text-gray-800 font-medium' : 'bg-gray-100'}`}
          >
            Pending ({statusCounts.pending})
          </button>
          {statusCounts.cancelled > 0 && (
            <button 
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1 rounded-full ${statusFilter === 'cancelled' ? 'bg-red-100 text-red-800 font-medium' : 'bg-gray-100'}`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {statusFilter === 'all' 
              ? 'No orders found' 
              : `No ${statusFilter} orders found`}
          </div>
          <button
            onClick={() => navigate('/new-order')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create your first order →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    {order.services.length > 0 
                      ? order.services.join(', ') 
                      : 'No services specified'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNaira(order.total)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;