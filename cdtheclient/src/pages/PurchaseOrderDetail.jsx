import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/Format';

const PurchaseOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/purchase-orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        toast.error('Failed to load purchase order');
        navigate('/purchase-orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await axios.patch(`/api/purchase-orders/${orderId}/status`, { status: newStatus });
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await axios.delete(`/api/purchase-orders/${orderId}`);
        toast.success('Purchase order deleted');
        navigate('/purchase-orders');
      } catch (err) {
        toast.error('Failed to delete order');
      }
    }
  };

  if (loading) return <div className="p-4">Loading order details...</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Order #{order.orderNumber}</h1>
        <div className="flex space-x-2">
          <Link
            to={`/purchase-orders/edit/${order._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Order
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={updating}
          >
            Delete Order
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Supplier Information</h2>
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {order.supplier?.name || 'N/A'}</p>
              <p><span className="font-medium">Contact:</span> {order.supplier?.contactPerson || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.supplier?.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.supplier?.phone || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Order Details</h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </p>
              <p><span className="font-medium">Created:</span> {formatDate(order.createdAt)}</p>
              <p><span className="font-medium">Created By:</span> {order.createdBy?.name || 'System'}</p>
              <p><span className="font-medium">Delivery Date:</span> {formatDate(order.deliveryDate)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">{item.productName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">₦{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-right font-medium">Grand Total:</td>
                  <td className="px-4 py-2 font-bold">₦{order.totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {order.notes && (
          <div>
            <h2 className="text-lg font-medium mb-2">Notes</h2>
            <p className="bg-gray-50 p-3 rounded">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Order Actions</h2>
        <div className="flex flex-wrap gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate('approved')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={updating}
            >
              Approve Order
            </button>
          )}
          {order.status === 'approved' && (
            <button
              onClick={() => handleStatusUpdate('shipped')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={updating}
            >
              Mark as Shipped
            </button>
          )}
          {order.status === 'shipped' && (
            <button
              onClick={() => handleStatusUpdate('delivered')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={updating}
            >
              Mark as Delivered
            </button>
          )}
          {order.status !== 'cancelled' && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={updating}
            >
              Cancel Order
            </button>
          )}
          <Link
            to="/purchase-orders"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;