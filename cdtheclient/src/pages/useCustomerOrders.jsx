// hooks/useCustomerOrders.js
import { useEffect, useState } from 'react';
import api from '../api';

const useCustomerOrders = (userId) => {
  const [orders, setOrders] = useState({ pending: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders?user=${userId}`);
        const allOrders = response.data;
        
        setOrders({
          pending: allOrders.filter(o => o.status === 'pending').length,
          completed: allOrders.filter(o => o.status === 'completed').length
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { orders, isLoading };
};

export default useCustomerOrders;