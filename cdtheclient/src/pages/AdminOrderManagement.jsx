import React, { useState, useEffect } from 'react';
import { FiUsers, FiPackage, FiCheckCircle, FiClock, FiSearch, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      items: 'Website Design Package',
      total: 1200,
      status: 'pending',
      date: '2023-10-15',
      assignedTo: null
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      items: 'E-commerce Development',
      total: 3500,
      status: 'in-progress',
      date: '2023-10-14',
      assignedTo: 'EMP-001'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      items: 'SEO Optimization',
      total: 800,
      status: 'completed',
      date: '2023-10-12',
      assignedTo: 'EMP-002'
    }
  ]);

  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Alice Johnson', role: 'Developer', activeTasks: 3 },
    { id: 'EMP-002', name: 'Bob Smith', role: 'Designer', activeTasks: 1 },
    { id: 'EMP-003', name: 'Carol Williams', role: 'Marketer', activeTasks: 2 }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const assignOrderToEmployee = (orderId, employeeId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, assignedTo: employeeId, status: 'in-progress' } : order
    ));
    setShowAssignModal(false);
  };

  const markOrderCompleted = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unassigned';
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage customer orders and assign them to your team members</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{orders.length}</h3>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <FiPackage className="text-blue-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'pending').length}
                </h3>
                <p className="text-gray-600">Pending Orders</p>
              </div>
              <FiClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'in-progress').length}
                </h3>
                <p className="text-gray-600">In Progress</p>
              </div>
              <FiUsers className="text-blue-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'completed').length}
                </h3>
                <p className="text-gray-600">Completed</p>
              </div>
              <FiCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              Create New Order
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.assignedTo ? getEmployeeName(order.assignedTo) : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {order.status !== 'completed' && (
                        <>
                          {order.assignedTo ? (
                            <button
                              onClick={() => markOrderCompleted(order.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Mark Complete
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAssignModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Assign
                            </button>
                          )}
                        </>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        <FiEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Order Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Assign Order to Employee</h3>
            <p className="text-gray-600 mb-6">Assign order {selectedOrder?.id} to a team member</p>
            
            <div className="space-y-4">
              {employees.map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{employee.name}</h4>
                    <p className="text-sm text-gray-500">{employee.role} • {employee.activeTasks} active tasks</p>
                  </div>
                  <button
                    onClick={() => assignOrderToEmployee(selectedOrder.id, employee.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;