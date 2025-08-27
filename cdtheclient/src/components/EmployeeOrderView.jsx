import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmployeeOrderView = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await orderApi.getOrdersByStatus('pending');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      await orderApi.completeOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Order marked as completed!');
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customer?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Items: {order.items.length}
                  </p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                  Pending
                </span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="font-medium">
                  ₦{order.total?.toLocaleString()}
                </p>
                <button
                  onClick={() => handleCompleteOrder(order._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeOrderView;