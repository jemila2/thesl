
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeRoute = () => {
  const { user } = useAuth();
  return user?.role === 'employee' ? <Outlet /> : <Navigate to="/" replace />;
};

export default EmployeeRoute;