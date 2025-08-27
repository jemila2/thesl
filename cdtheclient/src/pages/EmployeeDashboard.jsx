

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// import { taskApi, orderApi } from '../../services/api';
import { taskApi, orderApi } from '../../../services/api';
import { toast } from 'react-toastify';
import EmployeeSidebar from '../components/EmployeeSidebar';
import { Link } from 'react-router-dom';
import { FiPlus, FiRefreshCw, FiSearch, FiCheckCircle } from 'react-icons/fi';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState({
    pending: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState({
    tasks: true,
    orders: true,
    ordersList: true
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  // Handle task status change
  const handleTaskStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      const response = await taskApi.updateStatus(taskId, newStatus);
      
      if (!response?.success) {
        throw new Error(response?.error || 'Update failed');
      }

      toast.success(`Task status updated to ${newStatus}`);
  
      if (newStatus === 'completed') {
        const completedTask = updatedTasks.find(t => t._id === taskId);
        if (completedTask?.orderId) {
          
          const orderTasks = updatedTasks.filter(t => t.orderId === completedTask.orderId);
          const allTasksCompleted = orderTasks.every(t => t.status === 'completed');
          
          if (allTasksCompleted) {
         
            await handleOrderCompletion(completedTask.orderId);
          }
        }
      }
    } catch (err) {
      setTasks(originalTasks);
      toast.error('Failed to update task status');
    }
  };

  const handleOrderCompletion = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, 'completed');
      toast.success('Order marked as completed');
     
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: 'completed' } : order
      ));
    
      setOrdersSummary(prev => ({
        ...prev,
        pending: prev.pending - 1,
        completed: prev.completed + 1
      }));
    } catch (err) {
      toast.error('Failed to complete order');
    }
  };

  
  const refreshOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, ordersList: true }));
      const ordersResponse = await orderApi.getAllOrders();
 
      const ordersData = ordersResponse.data || [];
      const pending = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const completed = ordersData.filter(o => o.status === 'completed' || o.status === 'delivered').length;
      
      setOrdersSummary({
        pending,
        completed,
        total: ordersData.length
      });
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Refresh error:', err);
      toast.error('Failed to refresh orders');
    } finally {
      setLoading(prev => ({ ...prev, ordersList: false }));
    }
  };


  const refreshTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }));
      const tasksResponse = await taskApi.getMyTasks();
      setTasks(tasksResponse.data || []);
    } catch (err) {
      console.error('Refresh error:', err);
      toast.error('Failed to refresh tasks');
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const getOrderDetails = (orderId) => {
    return orders.find(order => order._id === orderId);
  };

  const getOrderNumber = (orderId) => {
    const order = getOrderDetails(orderId);
    return order?.orderNumber || order?._id?.slice(-6) || 'N/A';
  };

  useEffect(() => {
    if (user?.role === 'employee') {
      const fetchAllData = async () => {
        try {
          setLoading({ tasks: true, orders: true, ordersList: true });
          setError(null);
          
          // Fetch tasks and orders
          const [tasksResponse, ordersResponse] = await Promise.all([
            taskApi.getMyTasks(),
            orderApi.getAllOrders()
          ]);
          
          const tasksData = tasksResponse.data || [];
          const ordersData = ordersResponse.data || [];
          
          setTasks(tasksData);
          setOrders(ordersData);
          
          // Calculate order summary
          const pending = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length;
          const completed = ordersData.filter(o => o.status === 'completed' || o.status === 'delivered').length;
          
          setOrdersSummary({
            pending,
            completed,
            total: ordersData.length
          });
          
        } catch (err) {
          console.error('Fetch error:', err);
          setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        } finally {
          setLoading({ tasks: false, orders: false, ordersList: false });
        }
      };
      
      fetchAllData();
    }
  }, [user]);

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      (task.orderId && getOrderNumber(task.orderId).toLowerCase().includes(searchLower))
    );
  });

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.orderNumber && order.orderNumber.toString().includes(searchTerm)) ||
      (order._id && order._id.toLowerCase().includes(searchLower)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower)) ||
      (order.status && order.status.toLowerCase().includes(searchLower))
    );
  });

  if (user?.role !== 'employee') {
    return (
      <div className="flex">
        <EmployeeSidebar />
        <div className="p-4 text-red-500 ml-64">Access denied. Employees only.</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <EmployeeSidebar />
      
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-bold">
              {loading.tasks ? '...' : tasks.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Tasks In Progress</h3>
            <p className="text-2xl font-bold">
              {loading.tasks ? '...' : tasks.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Pending Orders</h3>
            <p className="text-2xl font-bold">
              {loading.orders ? '...' : ordersSummary.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Completed Orders</h3>
            <p className="text-2xl font-bold">
              {loading.orders ? '...' : ordersSummary.completed}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tasks')}
          >
            My Tasks
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            Recent Orders
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'tasks' ? 'tasks' : 'orders'}...`}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={activeTab === 'tasks' ? refreshTasks : refreshOrders}
              disabled={activeTab === 'tasks' ? loading.tasks : loading.ordersList}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${(activeTab === 'tasks' ? loading.tasks : loading.ordersList) ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to={activeTab === 'tasks' ? "/tasks" : "/orders/new"}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="mr-2" />
              {activeTab === 'tasks' ? "View All Tasks" : "Create New Order"}
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'tasks' ? (
            loading.tasks ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                          {task.orderId && (
                            <div className="text-xs text-blue-600 mt-1">
                              Order: {getOrderNumber(task.orderId)}
                              {getOrderDetails(task.orderId)?.customer?.name && 
                                ` - ${getOrderDetails(task.orderId).customer.name}`
                              }
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                            className={`border rounded px-3 py-1 text-sm ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.orderId && (
                            <Link 
                              to={`/orders/${task.orderId}`}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              View Order
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                {searchTerm ? 'No matching tasks found' : 'No tasks assigned to you yet'}
              </div>
            )
          ) : (
            loading.ordersList ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                            {order.orderNumber || order._id.slice(-6)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customer?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${order.total ? order.total.toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.status !== 'completed' && (
                            <button
                              onClick={() => handleOrderCompletion(order._id)}
                              className="flex items-center text-green-600 hover:text-green-900 text-sm"
                            >
                              <FiCheckCircle className="mr-1" /> Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                {orders.length === 0 ? 'No orders found' : 'No orders match your search'}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;