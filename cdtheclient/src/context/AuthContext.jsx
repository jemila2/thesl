

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true
  });

  // Enhanced interceptors
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const response = await api.post('/auth/refresh');
          const newToken = response.data.token;
          
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );


    // 1. First define all helper functions
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      if (!response.data?.user) {
        throw new Error('Invalid user data');
      }

      const userData = {
        ...response.data.user,
        id: response.data.user._id || response.data.user.id,
        role: (response.data.user.role || 'customer').toLowerCase()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      localStorage.setItem('token', response.data.token);
      return { success: true, token: response.data.token };
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      throw new Error(err.response?.data?.message || 'Token refresh failed');
    }
  };

  // 2. Then define your main methods
  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { user: userData, token } = response.data;
      
      const normalizedUser = {
        id: userData._id || userData.id,
        employeeId: userData.employeeId,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase()
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      
      return { 
        success: true,
        user: normalizedUser 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOrders([]);
    setSuppliers([]);
    setCustomers([]);
    setUsers([]);
    return { success: true };
  };

 
  useEffect(() => {
    loadUser();
  }, []);


  const register = async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const user = {
          ...response.data.user,
          id: response.data.user._id || response.data.user.id,
          role: (response.data.user.role || 'user').toLowerCase()
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { 
        success: true,
        user: response.data.user 
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   setUser(null);
  //   setOrders([]);
  //   setSuppliers([]);
  //   setCustomers([]);
  //   setUsers([]);
  //   navigate('/login');
  //   return { success: true };
  // };

  // User management
  const getAllUsers = async (params = {}) => {
    try {
      setUsersLoading(true);
      const response = await api.get('/users', { params });
      
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || response.data?.users || [];
      
      setUsers(usersData);
      return { success: true, data: usersData };
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      throw err.response?.data || err;
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await api.put('/auth/update', userData);
      const updatedUser = {
        ...response.data.user,
        role: response.data.user.role.toLowerCase()
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Update error:', err);
      throw new Error(err.response?.data?.message || 'Update failed');
    }
  };

  // Order management
  const createOrder = async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, order: response.data.order };
    } catch (err) {
      console.error('Order creation error:', err);
      throw new Error(err.response?.data?.message || 'Order creation failed');
    }
  };

  const getOrders = async (options = {}) => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders', { params: options });
      
      const ordersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || response.data?.orders || [];
      
      setOrders(ordersData);
      return { success: true, data: ordersData };
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
      throw err.response?.data || err;
    } finally {
      setOrdersLoading(false);
    }
  };

  // Supplier management
  const getSuppliers = async (params = {}) => {
    try {
      setSuppliersLoading(true);
      const response = await api.get('/suppliers', { params });
      
      const suppliersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || response.data?.suppliers || [];
      
      setSuppliers(suppliersData);
      return { success: true, data: suppliersData };
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setSuppliers([]);
      throw err.response?.data || err;
    } finally {
      setSuppliersLoading(false);
    }
  };

  const createSupplier = async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      setSuppliers(prev => [...prev, response.data.supplier]);
      return { success: true, supplier: response.data.supplier };
    } catch (err) {
      console.error('Supplier creation error:', err);
      throw new Error(err.response?.data?.message || 'Supplier creation failed');
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier._id === id ? response.data.supplier : supplier
        )
      );
      return { success: true, supplier: response.data.supplier };
    } catch (err) {
      console.error('Supplier update error:', err);
      throw new Error(err.response?.data?.message || 'Supplier update failed');
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(prev => prev.filter(supplier => supplier._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Supplier deletion error:', err);
      throw new Error(err.response?.data?.message || 'Supplier deletion failed');
    }
  };

  // Customer management
  const getCustomers = async (params = {}) => {
    try {
      setCustomersLoading(true);
      const response = await api.get('/customers', { params });
      
      const customersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || response.data?.customers || [];
      
      setCustomers(customersData);
      return { success: true, data: customersData };
    } catch (err) {
      console.error('Error fetching customers:', err);
      setCustomers([]);
      throw err.response?.data || err;
    } finally {
      setCustomersLoading(false);
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      setCustomers(prev => [...prev, response.data.customer]);
      return { success: true, customer: response.data.customer };
    } catch (err) {
      console.error('Customer creation error:', err);
      throw new Error(err.response?.data?.message || 'Customer creation failed');
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      setCustomers(prev => 
        prev.map(customer => 
          customer._id === id ? response.data.customer : customer
        )
      );
      return { success: true, customer: response.data.customer };
    } catch (err) {
      console.error('Customer update error:', err);
      throw new Error(err.response?.data?.message || 'Customer update failed');
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(customer => customer._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Customer deletion error:', err);
      throw new Error(err.response?.data?.message || 'Customer deletion failed');
    }
  };

  // Employee stats
  const fetchEmployeeStats = async (employeeId) => {
    try {
      if (!employeeId || !/^[0-9a-fA-F]{24}$/.test(employeeId)) {
        console.error('Invalid employee ID format:', employeeId);
        return {
          pending: 0,
          completed: 0,
          inProgress: 0,
          _error: 'Invalid employee ID'
        };
      }

      const response = await api.get(`/employees/${employeeId}/stats`);
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Invalid stats response');
      }

      return {
        pending: response.data.data?.pending ?? 0,
        completed: response.data.data?.completed ?? 0,
        inProgress: response.data.data?.inProgress ?? 0
      };
    } catch (error) {
      console.error('Employee stats fetch error:', {
        endpoint: `/employees/${employeeId}/stats`,
        status: error.response?.status,
        error: error.message,
        responseData: error.response?.data
      });
      
      return {
        pending: 0,
        completed: 0,
        inProgress: 0,
        _error: error.response?.status === 404
          ? 'Employee not found'
          : error.response?.data?.error || 'Failed to load statistics'
      };
    }
  };

  // Token management
  // const refreshToken = async () => {
  //   try {
  //     const response = await api.post('/auth/refresh');
  //     localStorage.setItem('token', response.data.token);
  //     return { success: true, token: response.data.token };
  //   } catch (err) {
  //     console.error('Token refresh error:', err);
  //     logout();
  //     throw new Error(err.response?.data?.message || 'Token refresh failed');
  //   }
  // };

  // Role checking
  const hasRole = (role) => user?.role === role.toLowerCase();
  const isCustomer = () => hasRole('customer');
  const isAdmin = () => hasRole('admin');
  const isEmployee = () => hasRole('employee');
  const isSupplier = () => hasRole('supplier');
  const isAuthenticated = () => !!user;

  // Memoized context value
  const value = useMemo(() => ({
    user,
    loading,
    orders,
    ordersLoading,
    suppliers,
    suppliersLoading,
    customers,
    customersLoading,
    users,
    usersLoading,
    api,
    login,
    logout,
    register,
    updateUser,
    createOrder,
    getOrders,
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getCustomers,
    fetchEmployeeStats,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshToken,
    hasRole,
    isCustomer,
    isAdmin,
    isEmployee,
    isSupplier,
    isAuthenticated,
    loadUser,
    getAllUsers,
  }), [
    user, 
    loading, 
    orders,
    ordersLoading, 
    suppliers, 
    suppliersLoading,
    customers,
    customersLoading,
    users,
    usersLoading
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};