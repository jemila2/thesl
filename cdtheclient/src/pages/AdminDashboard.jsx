
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// import { taskApi, orderApi, userApi } from '../../services/api';
import { taskApi, orderApi, userApi } from '../../../services/api';
import AssignTaskForm from '../components/AssignTaskForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { 
  FiRefreshCw, FiPlus, FiSearch, FiCheckCircle, FiClock, 
  FiUser, FiTrash2, FiEdit, FiUsers, FiTruck, 
  FiDollarSign, FiSettings, FiX, FiPackage, FiAlertCircle,
  FiCheck, FiXCircle, FiMail
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employeeRequests, setEmployeeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [debugMode, setDebugMode] = useState(false);
  
  const [dashboardMetrics, setDashboardMetrics] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    pendingRequests: 0
  });

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerName = (order) => {
    
    if (order.customer && typeof order.customer === 'object') {
      if (order.customer.name) return order.customer.name;
      if (order.customer.fullName) return order.customer.fullName;
      if (order.customer.firstName || order.customer.lastName) {
        return `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
      }
      if (order.customer.username) return order.customer.username;
      if (order.customer.email) return order.customer.email;
    }
    
    const customerId = order.customer || order.customerId;
    if (typeof customerId === 'string') {
      const customerUser = users.find(user => user._id === customerId);
      if (customerUser) {
        if (customerUser.name) return customerUser.name;
        if (customerUser.email) return customerUser.email;
        if (customerUser.username) return customerUser.username;
      }
      return `Customer ID: ${customerId}`;
    }
  
    if (order.customerName) return order.customerName;
    if (order.customerEmail) return order.customerEmail;
   
    if (order.user) {
      if (order.user.name) return order.user.name;
      if (order.user.email) return order.user.email;
      if (order.user.username) return order.user.username;
    }
    
    if (order.userId) {
      const customerUser = users.find(user => user._id === order.userId);
      if (customerUser) {
        if (customerUser.name) return customerUser.name;
        if (customerUser.email) return customerUser.email;
        if (customerUser.username) return customerUser.username;
      }
      return `User ID: ${order.userId}`;
    }
    
    if (order.contactName) return order.contactName;
    if (order.contactEmail) return order.contactEmail;
    if (order.email) return order.email;
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      if (firstItem.customerName) return firstItem.customerName;
      if (firstItem.customerEmail) return firstItem.customerEmail;
    }
    
    return 'Unknown Customer';
  };

const handleEmployeeRequest = async (requestId, status) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    const response = await fetch(`${API_BASE_URL}/employee-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    
    if (response.ok) {
      toast.success(`Employee request ${status}`);
      fetchEmployeeRequests(); 
      fetchData(); 
    } else {
      throw new Error(`Failed to ${status} request`);
    }
  } catch (error) {
    console.error('Error processing employee request:', error);
    toast.error(`Failed to ${status} employee request`);
  }
};

  const fetchEmployeeRequests = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_BASE_URL}/employee-requests`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setEmployeeRequests(data.requests || data.data || []);
      
      // Update metrics
      const pendingRequests = (data.requests || data.data || []).filter(
        request => request.status === 'pending'
      ).length;
      
      setDashboardMetrics(prev => ({
        ...prev,
        pendingRequests
      }));
    }
  } catch (error) {
    console.error('Error fetching employee requests:', error);
  }
};

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [usersResponse, tasksResponse, ordersResponse] = await Promise.all([
        getAllUsers(),
        taskApi.getAll(true),
        orderApi.getAll({ limit: 1000 })
      ]);
      
      setUsers(usersResponse.data || []);
      setTasks(tasksResponse.data || []);
      
      let ordersData = ordersResponse.data?.data || ordersResponse.data || [];
      
      // Enhanced customer data handling
      if (ordersData.length > 0) {
        const ordersWithCustomers = ordersData.map(order => {
          const customerId = order.customer || order.customerId;
          if (typeof customerId === 'string') {
            const customerUser = usersResponse.data.find(user => user._id === customerId);
            if (customerUser) {
              return { ...order, customer: customerUser };
            }
          }
          
          // If customer is undefined but userId exists, try that
          if (!customerId && order.userId) {
            const customerUser = usersResponse.data.find(user => user._id === order.userId);
            if (customerUser) {
              return { ...order, customer: customerUser };
            }
          }
          
          // Check if customer info is directly in the order
          if (order.customerName || order.customerEmail) {
            // Create a customer object from the direct fields
            return {
              ...order,
              customer: {
                name: order.customerName,
                email: order.customerEmail,
              }
            };
          }
          
          return order;
        });
        ordersData = ordersWithCustomers;
      }
      
      setOrders(ordersData);
      
      const pending = ordersData.filter(
        o => o.status === 'pending' || o.status === 'processing'
      ).length;
      
      const completed = ordersData.filter(
        o => o.status === 'completed' || o.status === 'delivered'
      ).length;
      
      // Use the order total directly (already in Naira)
      const totalSpent = ordersData.reduce(
        (sum, order) => sum + (order.total || 0), 0
      );
      
      // Fetch employee requests
      await fetchEmployeeRequests();
      
      setDashboardMetrics({
        pendingOrders: pending,
        completedOrders: completed,
        totalSpent: totalSpent,
        pendingRequests: dashboardMetrics.pendingRequests // This will be updated by fetchEmployeeRequests
      });
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncOrderStatus = async () => {
      try {
        for (const order of orders) {
          const orderTasks = tasks.filter(task => task.orderId === order._id);
        
          if (orderTasks.length === 0) continue;
          
          const allTasksCompleted = orderTasks.every(task => task.status === 'completed');
        
          if (allTasksCompleted && order.status !== 'completed') {
            await orderApi.updateStatus(order._id, 'completed');
           
            setOrders(prev => prev.map(o => 
              o._id === order._id ? {...o, status: 'completed'} : o
            ));
            
            setDashboardMetrics(prev => ({
              ...prev,
              pendingOrders: prev.pendingOrders - 1,
              completedOrders: prev.completedOrders + 1
            }));
          }
          
          if (!allTasksCompleted && order.status === 'completed') {
            await orderApi.updateStatus(order._id, 'processing');
           
            setOrders(prev => prev.map(o => 
              o._id === order._id ? {...o, status: 'processing'} : o
            ));
            
            
            setDashboardMetrics(prev => ({
              ...prev,
              pendingOrders: prev.pendingOrders + 1,
              completedOrders: prev.completedOrders - 1
            }));
          }
        }
      } catch (err) {
        console.error('Error syncing order status:', err);
      }
    };

    if (tasks.length > 0 && orders.length > 0) {
      syncOrderStatus();
    }
  }, [tasks, orders]);

  // Refresh data when tasks are updated
  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user, refresh]);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
    toast.success('Task created successfully!');
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateStatus(taskId, newStatus);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? {...task, status: newStatus, updatedAt: new Date()} : task
      ));
      toast.success(`Task marked as ${newStatus}`);
      
      setRefresh(prev => !prev);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskApi.delete(taskId);
        setTasks(prev => prev.filter(t => t._id !== taskId));
        toast.success('Task deleted');

        setRefresh(prev => !prev);
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      
      await userApi.updateRole(userId, newRole);
      
     
      setUsers(prev => prev.map(u => 
        u._id === userId ? {...u, role: newRole} : u
      ));
      
      toast.success(`User role changed to ${newRole}`);
      
      
      if (newRole === 'employee' || users.find(u => u._id === userId)?.role === 'employee') {
        setRefresh(prev => !prev);
      }
    } catch (err) {
      console.error('Role change error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config
      });
      toast.error(err.response?.data?.message || 'Failed to change user role');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? {...order, status: newStatus} : order
      ));
      
      // Update metrics
      if (newStatus === 'completed') {
        setDashboardMetrics(prev => ({
          ...prev,
          pendingOrders: prev.pendingOrders - 1,
          completedOrders: prev.completedOrders + 1
        }));
      } else {
        setDashboardMetrics(prev => ({
          ...prev,
          pendingOrders: prev.pendingOrders + 1,
          completedOrders: prev.completedOrders - 1
        }));
      }
      
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const checkOrderTaskStatus = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    const orderTasks = tasks.filter(t => t.orderId === orderId);
    const allCompleted = orderTasks.every(t => t.status === 'completed');
    
    const debugInfo = {
      orderStatus: order?.status,
      tasksCount: orderTasks.length,
      allTasksCompleted: allCompleted,
      tasks: orderTasks.map(t => ({ id: t._id, title: t.title, status: t.status }))
    };
    
    console.log(`Order ${orderId}:`, debugInfo);
    
   
    toast.info(
      `Order #${orderId.slice(-6)}: ${orderTasks.length} tasks, ${allCompleted ? 'ALL COMPLETED' : 'INCOMPLETE'}`,
      {
        autoClose: 3000,
        onClick: () => {
        
          alert(`Order Debug Info:\n
Order ID: ${orderId}\n
Order Status: ${order?.status}\n
Tasks Count: ${orderTasks.length}\n
All Tasks Completed: ${allCompleted}\n
Tasks:\n${orderTasks.map(t => `- ${t.title}: ${t.status}`).join('\n')}
          `);
        }
      }
    );
  };

  const employees = users.filter(u => u.role === 'employee');
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task => {
    if (showCompleted && task.status !== 'completed') return false;
    return (
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.orderId?.includes(searchTerm)
    );
  });

  const filteredOrders = orders.filter(order => 
    order._id.includes(searchTerm) ||
    getCustomerName(order).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.items && order.items.some(item => 
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const filteredRequests = employeeRequests.filter(request => 
    request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="p-6 bg-white rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-2xl font-bold mb-2">Access Denied</div>
          <p className="text-gray-600">This dashboard is for administrators only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="p-6 bg-white rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-xl font-bold mb-2">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-64 p-6">
        {/* Header and Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardMetrics.pendingOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardMetrics.completedOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatNaira(dashboardMetrics.totalSpent)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 font-bold text-xl">₦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardMetrics.pendingRequests}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FiMail className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
        
        
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['orders', 'tasks', 'users', 'requests'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'orders' ? 'Order Tracking' : 
                 tab === 'tasks' ? 'Task Management' : 
                 tab === 'users' ? 'User Management' : 'Employee Requests'}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {activeTab === 'tasks' && (
            <>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  showCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showCompleted ? 'Show All Tasks' : 'Show Completed Only'}
              </button>
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                disabled={employees.length === 0}
              >
                <FiPlus /> Assign Task
              </button>
            </>
          )}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Assign New Task {showOrderDetails ? `for Order #${showOrderDetails._id?.slice(-6)}` : ''}
                </h3>
                <button onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-gray-500">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              {employees.length > 0 ? (
                <AssignTaskForm 
                  users={employees} 
                  orders={orders.filter(o => o.status !== 'completed')}
                  onTaskCreated={handleTaskCreated} 
                  onCancel={() => setShowTaskForm(false)}
                />
              ) : (
                <div className="text-center p-4 text-red-500">
                  <p>No employees available for task assignment.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Order #{showOrderDetails._id?.slice(-6) || 'N/A'}
                </h3>
                <button onClick={() => setShowOrderDetails(null)} className="text-gray-400 hover:text-gray-500">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              {/* Order details content here */}
              <div className="mb-4">
                <h4 className="font-semibold">Customer Information</h4>
                <p>{getCustomerName(showOrderDetails)}</p>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <select
                  value={showOrderDetails.status}
                  onChange={(e) => handleOrderStatusChange(showOrderDetails._id, e.target.value)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => {
                    setShowTaskForm(true);
                    setShowOrderDetails(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <FiPlus className="inline mr-1" /> Add Task
                </button>
                {debugMode && (
                  <button
                    onClick={() => checkOrderTaskStatus(showOrderDetails._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                  >
                    <FiAlertCircle className="inline mr-1" /> Debug
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {activeTab === 'orders' && (
          <OrderTable 
            orders={filteredOrders} 
            onViewDetails={setShowOrderDetails} 
            debugMode={debugMode}
            onDebug={checkOrderTaskStatus}
            getCustomerName={getCustomerName}
          />
        )}
        
        {activeTab === 'tasks' && (
          <TaskTable 
            tasks={filteredTasks}
            onStatusChange={handleTaskStatusChange}
            onDelete={handleDeleteTask}
            onCreate={() => setShowTaskForm(true)}
          />
        )}
        
        {activeTab === 'users' && (
          <UserTable 
            users={filteredUsers} 
            onRoleChange={handleRoleChange}
          />
        )}

        {activeTab === 'requests' && (
          <EmployeeRequestTable 
            requests={filteredRequests}
            onApprove={(id) => handleEmployeeRequest(id, 'approved')}
            onReject={(id) => handleEmployeeRequest(id, 'rejected')}
          />
        )}
      </div>
    </div>
  );
};

// OrderTable component (unchanged)
const OrderTable = ({ orders, onViewDetails, debugMode, onDebug, getCustomerName }) => (
  <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Orders ({orders.length})</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (₦)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            {debugMode && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debug</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order._id?.slice(-6) || 'N/A'}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate" title={getCustomerName(order)}>
                  {getCustomerName(order)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status || 'unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(order.total || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onViewDetails(order)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </button>
              </td>
              {debugMode && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onDebug(order._id)}
                    className="text-yellow-600 hover:text-yellow-900 flex items-center"
                    title="Check task status synchronization"
                  >
                    <FiAlertCircle />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// TaskTable Component
const TaskTable = ({ tasks, onStatusChange, onDelete, onCreate }) => (
  <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Tasks ({tasks.length})</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map(task => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {task.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.assignee?.name || 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.orderId ? `#${task.orderId.slice(-6)}` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => onStatusChange(task._id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                      title="Mark as completed"
                    >
                      <FiCheckCircle />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete task"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// UserTable Component
const UserTable = ({ users, onRoleChange }) => (
  <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Users ({users.length})</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => onRoleChange(user._id, user.role === 'employee' ? 'customer' : 'employee')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      user.role === 'employee' 
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    Make {user.role === 'employee' ? 'Customer' : 'Employee'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// EmployeeRequestTable Component
const EmployeeRequestTable = ({ requests, onApprove, onReject }) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No employee requests</h3>
        <p className="mt-1 text-sm text-gray-500">No pending employee requests at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Employee Requests ({requests.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(request => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.userEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.experience} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(request.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onApprove(request._id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                        title="Approve request"
                      >
                        <FiCheck className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => onReject(request._id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Reject request"
                      >
                        <FiX className="mr-1" /> Reject
                      </button>
                    </div>
                  )}
                  {request.status !== 'pending' && (
                    <span className="text-gray-400">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDashboard;