
    const OrderList = ({orders}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order._id} className="p-2 border rounded">
              <p><strong>Service:</strong> {order.serviceType}</p>
              <p><strong>Price:</strong> ${order.price}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default OrderList