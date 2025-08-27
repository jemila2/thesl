import { useState } from 'react';

const InventoryItem = ({ item, onRestock, showActions = true }) => {
  const [restockQty, setRestockQty] = useState(10);

  return (
    <tr key={item._id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{item.product}</div>
        <div className="text-sm text-gray-500">{item.supplier?.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.quantity < item.threshold
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {item.quantity} {item.unit}
        </span>
        {item.quantity < item.threshold && (
          <span className="ml-2 text-xs text-red-500">(Low stock)</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ₦{item.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.lastRestocked).toLocaleDateString()}
      </td>
      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(parseInt(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
            <button
              onClick={() => onRestock(item._id, restockQty)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Order
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default InventoryItem;