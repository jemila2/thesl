import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const EmployeeRoute = () => {
  const { user } = useAuth();
  return ['employee', 'admin'].includes(user?.role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default EmployeeRoute;