import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/Format';


const SupplierDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    inventoryRequests: [],
    performanceStats: null,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/supplier/dashboard');
        setDashboardData({
          recentOrders: res.data.recentOrders,
          inventoryRequests: res.data.inventoryRequests,
          performanceStats: res.data.performanceStats,
          loading: false
        });
      } catch (err) {
        toast.error('Failed to load dashboard data');
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  if (dashboardData.loading) {
    return <div className="p-4">Loading supplier dashboard...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Supplier Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-500">Pending Orders</h3>
          <p className="text-3xl font-bold">
            {dashboardData.performanceStats?.pendingOrders || 0}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-500">This Month's Deliveries</h3>
          <p className="text-3xl font-bold">
            {dashboardData.performanceStats?.monthlyDeliveries || 0}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-500">Satisfaction Rating</h3>
          <p className="text-3xl font-bold">
            {dashboardData.performanceStats?.satisfactionRating 
              ? `${dashboardData.performanceStats.satisfactionRating}%` 
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/supplier/orders" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {dashboardData.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link 
                        to={`/supplier/orders/${order._id}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      ₦{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleOrderAction(order._id, 'approve')}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Approve
                        </button>
                      )}
                      {order.status === 'approved' && (
                        <button
                          onClick={() => handleOrderAction(order._id, 'ship')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ship
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders found</p>
        )}
      </div>

      {/* Inventory Requests */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inventory Requests</h2>
          <Link to="/supplier/inventory" className="text-blue-600 hover:underline">
            Manage Inventory
          </Link>
        </div>
        
        {dashboardData.inventoryRequests.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.inventoryRequests.map(request => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{request.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Requested: {formatDate(request.requestDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{request.quantity} units</p>
                    <p className="text-sm text-gray-600">
                      {request.urgent ? (
                        <span className="text-red-500">Urgent</span>
                      ) : (
                        <span className="text-yellow-500">Standard</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleInventoryAction(request._id, 'fulfill')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
                  >
                    Mark as Fulfilled
                  </button>
                  <button
                    onClick={() => handleInventoryAction(request._id, 'decline')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No inventory requests</p>
        )}
      </div>
    </div>
  );

  async function handleOrderAction(orderId, action) {
    try {
      await axios.patch(`/api/supplier/orders/${orderId}`, { action });
      toast.success(`Order ${action}d successfully`);
      // Refresh data
      const res = await axios.get('/api/supplier/dashboard');
      setDashboardData({
        recentOrders: res.data.recentOrders,
        inventoryRequests: res.data.inventoryRequests,
        performanceStats: res.data.performanceStats,
        loading: false
      });
    } catch (err) {
      toast.error(`Failed to ${action} order`);
    }
  }

  async function handleInventoryAction(requestId, action) {
    try {
      await axios.patch(`/api/supplier/inventory/${requestId}`, { action });
      toast.success(`Request ${action}d successfully`);
      // Refresh data
      const res = await axios.get('/api/supplier/dashboard');
      setDashboardData({
        recentOrders: res.data.recentOrders,
        inventoryRequests: res.data.inventoryRequests,
        performanceStats: res.data.performanceStats,
        loading: false
      });
    } catch (err) {
      toast.error(`Failed to ${action} request`);
    }
  }
};

export default SupplierDashboard;