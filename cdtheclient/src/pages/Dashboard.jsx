

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [customersRes, ordersRes, suppliersRes] = await Promise.all([
          fetch('http://localhost:5000/api/customers', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/suppliers', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Check for failed responses
        if (!customersRes.ok || !ordersRes.ok || !suppliersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [customers, orders, suppliers] = await Promise.all([
          customersRes.json(),
          ordersRes.json(),
          suppliersRes.json()
        ]);

        setStats({
          customers: customers.length || 0,
          orders: orders.length || 0,
          pendingOrders: orders.filter(o => o.status === 'pending').length || 0,
          suppliers: suppliers.length || 0
        });

        setRecentData({
          customers: customers.slice(0, 5) || [],
          orders: orders.slice(0, 5) || [],
          suppliers: suppliers.slice(0, 5) || []
        });
        
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('Authentication required');
      setLoading(false);
    }
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">{error}</div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  if (!stats || !recentData) return (
    <div className="text-center py-8">No data available</div>
  );

  return (
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Customers</h3>
          <p className="text-3xl font-bold">{stats.customers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Pending Orders</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Suppliers</h3>
          <p className="text-3xl font-bold">{stats.suppliers}</p>
        </div>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Customers</h3>
          <ul className="space-y-2">
            {recentData.customers.map(customer => (
              <li key={customer._id} className="border-b pb-2">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
          <ul className="space-y-2">
            {recentData.orders.map(order => (
              <li key={order._id} className="border-b pb-2">
                <p className="font-medium">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">Status: {order.status}</p>
                <p className="text-sm">Total: ${order.totalAmount}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Suppliers</h3>
          <ul className="space-y-2">
            {recentData.suppliers.map(supplier => (
              <li key={supplier._id} className="border-b pb-2">
                <p className="font-medium">{supplier.name}</p>
                <p className="text-sm text-gray-500">{supplier.contactPerson}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
