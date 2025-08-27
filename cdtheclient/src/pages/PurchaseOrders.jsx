import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/purchase-orders', { params: filters });
       
        setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        toast.error('Failed to load purchase orders');
        setOrders([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      supplier: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Safely check for orders.length after loading is complete
  const hasOrders = Array.isArray(orders) && orders.length > 0;
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Link
          to="/purchase-orders/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Order
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select
              name="supplier"
              value={filters.supplier}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Suppliers</option>
              {/* Populate with suppliers from API if needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {hasOrders ? (
          orders.map(order => (
            <div key={order._id} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    <Link to={`/purchase-orders/${order._id}`} className="hover:underline">
                      {order.orderNumber || 'N/A'}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Supplier: {order.supplier?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`capitalize ${
                      order.status === 'approved' ? 'text-green-600' :
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'cancelled' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {order.status || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ₦{order.totalAmount?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No purchase orders found</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters to see all orders
              </button>
            )}
            <div className="mt-4">
              <Link
                to="/purchase-orders/new"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Your First Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;