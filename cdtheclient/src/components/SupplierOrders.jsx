import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PurchaseOrderCard from '../components/PurchaseOrderCard';

const SupplierOrders = ({ external = false }) => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = external 
          ? '/api/supplier/orders' 
          : `/api/suppliers/${id}/orders`;
        const res = await axios.get(url);
        setOrders(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, external]);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {external ? 'Your Orders' : `Orders for Supplier ${id}`}
        </h2>
        {!external && (
          <Link 
            to={`/purchase-orders/new?supplier=${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Order
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <PurchaseOrderCard 
              key={order._id} 
              order={order} 
              showSupplier={!external}
            />
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;