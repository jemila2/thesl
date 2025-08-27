
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Details:', {
        url: error.config.url,
        method: error.config.method,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        requestHeaders: error.config.headers
      });
      
      // For 400 errors, log the validation errors if available
      if (error.response.status === 400) {
        console.error('Validation errors:', error.response.data.errors);
      }
    }
    return Promise.reject(error);
  }
);
export const customerApi = {
  create: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Customer creation failed:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Customer deletion failed:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  }
};

// Employee API
export const employeeApi = {
  getTasks: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee tasks:', error);
      throw error;
    }
  },

  getOrderStats: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
      throw error;
    }
  }
};


export const getOrderSummary = async (employeeId) => {
  try {
    const response = await api.get('/orders/summary', {
      params: { employeeId }, // Include employeeId if needed
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });

    if (response.status === 400) {
      // Handle specific 400 error
      console.warn('Bad request - check parameters:', response.data);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        error: response.data?.message || 'Invalid request parameters'
      };
    }

    return {
      total: response.data?.total || 0,
      pending: response.data?.pending || 0,
      completed: response.data?.completed || 0
    };
  } catch (error) {
    console.error('Get order summary error:', {
      url: error.config?.url,
      status: error.response?.status,
      error: error.message,
      time: new Date().toISOString()
    });
    
    // Return default values
    return {
      total: 0,
      pending: 0,
      completed: 0,
      error: 'Failed to fetch order summary'
    };
  }
};

//     if (params.summary) {
//       // Return summary data
//       return axios.get('/api/orders/summary', { params });
//     } else {
//       // Return full orders list
//       return axios.get('/api/orders', { params });
//     }
//   },
  
//   // Customer endpoints
//   getCustomerOrders: (customerId) => api.get(`/orders/customer/${customerId}`),
//   createOrder: (orderData) => api.post('/orders', orderData),
  
//   // Shared endpoints
//   getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
//   searchOrders: (query) => api.get('/orders/search', { params: { q: query } }),


//   complete: async (orderId) => {
//     try {
//       await api.post(`/orders/${orderId}/complete`);
//     } catch (error) {
//       console.error('Failed to complete order:', error);
//       throw error;
//     }
//   },


//  getCustomerOrders: async (customerId) => {
//     try {
//       // Verify token exists before making request
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await api.get(`/orders/customer/${customerId}`, {
//         validateStatus: (status) => status < 500 // Don't throw for 4xx errors
//       });

//       if (response.status === 403) {
//         throw new Error('Forbidden - You may not have permission to view these orders');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer orders:', {
//         customerId,
//         status: error.response?.status,
//         error: error.response?.data || error.message,
//         time: new Date().toISOString()
//       });
      
//       // Rethrow with more user-friendly message
//       throw new Error(
//         error.response?.data?.message || 
//         error.message || 
//         'Failed to fetch orders. Please check your permissions.'
//       );
//     }
//   },

//    getAll: async () => {
//     return {
//       data: [
//         {
//           _id: '1',
//           customer: { name: 'John Doe', phone: '555-1234' },
//           items: [
//             { type: 'Shirt', service: 'Wash & Fold', quantity: 5, price: 2.5 }
//           ],
//           status: 'pending',
//           total: 12.5,
//           createdAt: new Date().toISOString()
//         }
//       ]
//     };
//   },
// };


// In your services/api.js
export const orderApi = {

   getOrderSummary: async (employeeId = null) => {
    try {
      const config = {};
      if (employeeId) {
        config.params = { employeeId };
      }
      
      const response = await api.get('/orders/summary', config);
      
      return {
        success: true,
        data: {
          total: response.data?.total || 0,
          pending: response.data?.pending || 0,
          completed: response.data?.completed || 0,
          // Include any other summary fields your backend provides
        }
      };
    } catch (error) {
      console.error('Order summary error:', {
        url: '/orders/summary',
        status: error.response?.status,
        error: error.response?.data || error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order summary',
        data: {
          total: 0,
          pending: 0,
          completed: 0
        }
      };
    }
  },

   getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await fetch(`/api/orders/admin/orders?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.json();
  },

  // Get customer orders (for customer dashboard)
  getCustomerOrders: async (customerId) => {
    const response = await fetch(`/api/orders/customer/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.json();
  },

    updateStatus: async (orderId, status) => {
    const response = await fetch(`/api/orders/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    
    return response.json();
  },

    complete: async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/complete`);
    } catch (error) {
      console.error('Failed to complete order:', error);
      throw error;
    }
  },


 getCustomerOrders: async (customerId) => {
    try {
      // Verify token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get(`/orders/customer/${customerId}`, {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      if (response.status === 403) {
        throw new Error('Forbidden - You may not have permission to view these orders');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', {
        customerId,
        status: error.response?.status,
        error: error.response?.data || error.message,
        time: new Date().toISOString()
      });
      
      // Rethrow with more user-friendly message
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch orders. Please check your permissions.'
      );
    }
  },

  //  getOrderSummary: async () => {
  //   try {
  //     const response = await api.get('/orders/summary');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Order summary error:', error);
  //     throw error;
  //   }
  // },
  getAllOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  },
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      
      // Standardize the response format
      return {
        data: response.data?.data || response.data?.orders || response.data || []
      };
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  },

  getCustomerOrders: async (customerId) => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`);
      return {
        data: response.data?.data || response.data?.orders || response.data || []
      };
    } catch (error) {
      console.error('Get customer orders error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

    
   getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/orders?${queryString}`);
  },
 


  //  updateStatus: (orderId, status) => 

     updateStatus: (orderId, status) => 
    api.put(`/orders/${orderId}/status`, { status }),
  
  // OR if you're using admin routes:
  updateStatus: (orderId, status) => 
    api.put(`/admin/orders/${orderId}/status`, { status }),

};

const fetchAllData = async () => {
  try {
    const summary = await orderApi.getOrderSummary(user.id);
   
  } catch (error) {
    console.error('Failed to fetch order summary:', error);
  }
};

export const getCustomerOrders = async (customerId, retries = 3) => {
  try {
    // Validate customerId
    if (!customerId || typeof customerId !== 'string') {
      throw new Error('Invalid customer ID');
    }

    // Add cache busting and retry delay
    const timestamp = Date.now();
    const retryDelay = 1000; // 1 second between retries

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(`/orders/customer/${customerId}?_=${timestamp}`, {
          timeout: 8000,
          headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.data) {
          throw new Error('Empty response from server');
        }

        return {
          success: true,
          data: response.data.data || response.data.orders || [],
          count: response.data.count || 0
        };
      } catch (error) {
        if (attempt === retries) throw error;
        
        // If rate limited (429), use exponential backoff
        if (error.response?.status === 429) {
          const delay = Math.pow(2, attempt) * retryDelay;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  } catch (error) {
    console.error('API Error:', {
      endpoint: `/orders/customer/${customerId}`,
      status: error.response?.status,
      error: error.message,
      time: new Date().toISOString()
    });
    
    throw new Error(
      error.response?.status === 429 
        ? 'Too many requests. Please try again later.'
        : error.response?.data?.message || 'Failed to fetch orders'
    );
  }
};

export const supplyApi = {
  request: async (employeeId) => {
    try {
      await api.post('/supplies', { employeeId });
    } catch (error) {
      console.error('Failed to request supplies:', error);
      throw error;
    }
  }
};



export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const getAllUsers = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        data: response.data?.data || response.data?.users || response.data || []
      };
    } catch (error) {
      console.error('Get users error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  updateRole: async (userId, newRole) => {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role: newRole });
      return response.data;
    } catch (error) {
      console.error('Role update error:', error);
      throw error;
    }
  }
};


export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};
export const getCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

export const fetchOrderStats = async (employeeId) => {
  try {
    // Validate employee ID format first
    if (!employeeId || !/^[0-9a-fA-F]{24}$/.test(employeeId)) {
      throw new Error('Invalid employee ID format');
    }

    const response = await api.get(`/employees/${employeeId}/stats`);
    
    // Check for empty response
    if (!response.data) {
      throw new Error('Empty response from server');
    }

    return {
      pending: response.data.data?.pending ?? 0,
      completed: response.data.data?.completed ?? 0,
      inProgress: response.data.data?.inProgress ?? 0,
      recentActivity: response.data.data?.recentActivity ?? []
    };
  } catch (error) {
    console.error('API Error Details:', {
      url: `/employees/${employeeId}/stats`,
      status: error.response?.status,
      error: error.message
    });
    throw error;
  }
};
export const completeOrder = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}/complete`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to complete order');
};

export const requestSupplies = async (employeeId) => {
  const response = await fetch(`/api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
  });
  if (!response.ok) throw new Error('Failed to request supplies');
};
export const fetchEmployeeTasks = async (employeeId) => {
  // Validate the employee ID format
  if (!employeeId || !/^[0-9a-fA-F]{24}$/.test(employeeId)) {
    console.error('Invalid employee ID:', employeeId);
    throw new Error('Invalid employee ID format');
  }

  try {
    const response = await axios.get(`/employees/${employeeId}/tasks`);
    return response.data?.data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-throw for component to handle
  }
};


export default {
  getCustomerName: async (customerId) => {
    try {
      const response = await api.get(`/name/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }}

export const fetchEmployeeStats = async (employeeId, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await api.get(`/employees/${employeeId}/stats`, {
        
        timeout: 5000 // 5 second timeout
      });
      
      if (response.status === 404) {
        throw new Error('Endpoint not configured');
      }
      
      return response.data.data || {
        pending: 0,
        completed: 0,
        inProgress: 0
      };
      
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};


export const taskApi = {
 
   updateStatus: async (taskId, status) => {
    try {
      console.log('Attempting to update task status:', { taskId, status });
      
      const response = await api.patch(`/tasks/${taskId}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 10000
        }
      );

      console.log('Update successful:', response.data);
      return response.data;

    } catch (error) {
      console.error('Task status update failed:', {
        url: `/tasks/${taskId}/status`,
        method: 'PATCH',
        status: error.response?.status,
        error: error.response?.data || error.message
      });
      
      throw new Error(
        error.response?.data?.message || 
        'Failed to update task status. Please try again.'
      );
    }
  },


   getEmployeeTasks: (employeeId) => {
    return axios.get(`/api/tasks/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  },


  getAll: async (adminView = false) => {
    try {
      const response = await api.get('/tasks', {
        params: { adminView }
      });
      
      // Standardize response format
      return {
        success: true,
        data: response.data?.data || response.data?.tasks || response.data || []
      };
    } catch (error) {
      console.error('Task fetch error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },
  getMyTasks: async () => {
    try {
      const response = await api.get('/tasks/my-tasks');
      return {
        success: true,
        data: response.data?.data || response.data || []
      };
    } catch (error) {
      console.error('Get my tasks error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },


   getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return {
        data: response.data?.data || response.data?.orders || response.data || []
      };
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  },


  getOrderSummary: async () => {
    try {
      const response = await api.get('/orders/summary');
      return {
        total: response.data?.total || 0,
        pending: response.data?.pending || 0,
        completed: response.data?.completed || 0
      };
    } catch (error) {
      console.error('Get order summary error:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order details error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },
  // Get task details
  getTaskDetails: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task details error:', error);
      throw error;
    }
  }
};

export const userApi = {

  getAll: async () => {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        data: response.data?.data || response.data?.users || response.data || []
      };
    } catch (error) {
      console.error('Get users error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },


  getById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  updateRole: async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      return response.data;
    } catch (error) {
      console.error('Role update error:', error);
      throw error;
    }
  },

  delete: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('User deletion error:', error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  },
 
};






