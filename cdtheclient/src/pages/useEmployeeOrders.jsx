
import { useEffect, useState } from 'react';
import api from '../api';

const useEmployeeOrders = () => {
  const [orders, setOrders] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/all');
        
       
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: expected array');
        }

        const allOrders = response.data;
        
        setOrders({
          total: allOrders.length,
          pending: allOrders.filter(o => o.status === 'pending').length,
          completed: allOrders.filter(o => o.status === 'completed').length,
          recentOrders: allOrders.slice(0, 5)
        });
      } catch (err) {
        console.error('API Error:', {
          message: err.message,
          config: err.config,
          response: err.response
        });
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
};

export default useEmployeeOrders;