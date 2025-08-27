import { useState, useEffect } from 'react';

export const useRecentActivity = () => {
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    setTimeout(() => {
      setActivity([
        {
          id: 1,
          description: "Order #12345 marked as completed",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          description: "New order #12346 created",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { activity, isLoading };
};