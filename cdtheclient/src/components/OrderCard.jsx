import { Link } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const OrderCard = ({ order, onStatusUpdate, editable = false, currency = "₦" }) => {
  const statusIcons = {
    pending: <FiClock className="text-yellow-500" />,
    processing: <FiClock className="text-yellow-500" />,
    completed: <FiCheckCircle className="text-green-500" />,
    cancelled: <FiAlertCircle className="text-red-500" />
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow transition-shadow w-190 ml-20">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            {statusIcons[order.status] || statusIcons.pending}
            <Link 
              to={`${editable ? '/employee' : '/customer'}/orders/${order._id}`}
              className="font-medium hover:underline"
            >
              Order #{order.orderNumber}
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          {order.customer && (
            <p className="text-sm mt-1">
              Customer: {order.customer.name}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="font-medium">
            {currency}{(order.totalAmount || order.total || 0).toLocaleString()}
          </span>
          
          {editable ? (
            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order._id, e.target.value)}
              className={`px-3 py-1 text-sm rounded ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <span className={`px-3 py-1 text-sm rounded ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;