import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const CustomerRoute = () => {
  const { isCustomer, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isCustomer() ? <Outlet /> : <Navigate to="/" replace />;
};

export default CustomerRoute;