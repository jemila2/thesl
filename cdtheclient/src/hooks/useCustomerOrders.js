import { useState, useEffect } from 'react';

export const useCustomerOrders = () => {
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {
      setOrders({
        pending: 3,
        completed: 12,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return { orders, isLoading };
};