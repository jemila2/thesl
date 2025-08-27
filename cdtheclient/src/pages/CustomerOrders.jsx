
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
// import { orderApi } from '../../services/api';
import { orderApi } from '../../../services/api';
import { 
  FiAlertCircle, 
  FiFilter, 
  FiSearch, 
  FiPlusCircle,
  FiRefreshCw,
  FiEye,
  FiList,
  FiUser
} from 'react-icons/fi';
const formatNaira = (amount) => {
  return `₦${amount?.toLocaleString('en-NG') || '0'}`;
};

const CustomerOrders = ({ isEmployeeView = false }) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isEmployeeView) {
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        response = await orderApi.getAllOrders(params);
      } else {
        response = await orderApi.getCustomerOrders(user._id);
      }
      
      console.log('API Response:', response.data); 
      const processedOrders = (response.data || []).map(order => ({
        ...order,
        totalAmount: order.totalAmount || order.total || 0,
        items: (order.items || []).map(item => ({
          ...item,
          price: item.price || 0,
          subtotal: item.subtotal || (item.price || 0) * (item.quantity || 1)
        }))
      }));
      
      setOrders(processedOrders);
    } catch (err) {
      console.error('Order fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id || isEmployeeView) {
      fetchOrders();
    }
  }, [user?._id, isEmployeeView, statusFilter, searchTerm]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      console.log(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getCustomerName = (order) => {
    console.log('Order customer data:', order.customer); 
    
    if (order.customer) {
      
      if (typeof order.customer === 'string') {
        return order.customer; 
      }
      if (order.customer.name) {
        return order.customer.name;
      }
      if (order.customer.firstName || order.customer.lastName) {
        return `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
      }
      if (order.customer.username) {
        return order.customer.username;
      }
      if (order.customer.email) {
        return order.customer.email;
      }
    }
    
    // For non-employee view, show user's own name
    if (!isEmployeeView && user) {
      return user.name || user.username || user.email;
    }
    
    return 'Unknown Customer';
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const customerName = getCustomerName(order).toLowerCase();
    const matchesSearch = searchTerm === '' || 
      order.orderNumber?.toString().includes(searchTerm) ||
      customerName.includes(searchTerm.toLowerCase()) ||
      (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.items && order.items.some(item => 
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    return matchesStatus && matchesSearch;
  });

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pl-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEmployeeView ? 'Manage Orders' : 'Your Orders'}
        </h1>
        
        <div className="flex items-center space-x-4">
          {!isEmployeeView && (
            <Link
              to="/customer/orders/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlusCircle className="mr-2" />
              New Order
            </Link>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, number, customer name, service type..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in-transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <FiFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {isEmployeeView ? 'No orders found' : 'You have no orders yet'}
            {!isEmployeeView && (
              <div className="mt-4">
                <Link
                  to="/customer/orders/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlusCircle className="mr-2" />
                  Place Your First Order
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
            
            {filteredOrders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Order #{order.orderNumber || order._id?.substring(0, 8).toUpperCase() || 'N/A'}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}
                    </p>
                    {/* Always show customer name, not just in employee view */}
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <FiUser className="mr-1" />
                      {getCustomerName(order)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'in-transit' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                    </span>
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="View order details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold">{formatNaira(order.totalAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Items</p>
                      <p className="font-medium">{order.items?.length || 0} services</p>
                    </div>
                  </div>
                  
                  {expandedOrderId === order._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-medium mb-3 flex items-center">
                        <FiList className="mr-2" />
                        Order Details
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-mono text-sm">{order._id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium flex items-center">
                            <FiUser className="mr-1" />
                            {getCustomerName(order)}
                          </p>
                        </div>
                      </div>
                      
                      <h5 className="font-medium mb-2">Services</h5>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="font-medium">{item.name || 'Unnamed Service'}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatNaira(item.price)} each</p>
                              <p className="text-sm text-gray-600">Subtotal: {formatNaira(item.subtotal)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">{formatNaira(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {isEmployeeView && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
                    <select
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      value={order.status || 'pending'}
                      className="text-sm border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;