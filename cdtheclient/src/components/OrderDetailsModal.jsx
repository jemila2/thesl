

import React from 'react';
import { FiX, FiPlus, FiUser } from 'react-icons/fi';

const OrderDetailsModal = ({ 
  order, 
  tasks, 
  onClose, 
  onStatusChange, 
  onTaskStatusChange, 
  onDeleteTask,
  onCreateTask
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Order #{order._id.slice(-6)}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{order.customer?.name}</p>
              <p className="text-gray-600">{order.customer?.phone}</p>
              <p className="text-gray-600">{order.customer?.email}</p>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Created:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Items</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.service}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Associated Tasks</h4>
          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task._id} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">Assigned to: {task.assignee?.name || 'Unassigned'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => onTaskStatusChange(task._id, e.target.value)}
                      className={`block pl-2 pr-8 py-1 text-sm border focus:outline-none focus:ring-1 rounded-md ${
                        task.status === 'completed' ? 'border-green-300 bg-green-50 text-green-700' :
                        task.status === 'in-progress' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                        'border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks assigned to this order yet.</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={onCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiPlus className="inline mr-1" /> Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;