

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiShoppingBag, 
  FiPlusCircle,
  FiCreditCard,
  FiHelpCircle,
  FiPieChart
} from 'react-icons/fi';

const CustomerSidebar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 w-35 bg-blue-800 text-white">
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-8">Customer Portal</h2>
        
        <nav className="space-y-2 flex-1">
          <NavLink 
            to="/customer/dashboard" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
            end
          >
            <FiPieChart className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/customer/orders" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiShoppingBag className="text-lg" />
            <span>My Orders</span>
          </NavLink>

          <NavLink 
            to="/customer/orders/new" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiPlusCircle className="text-lg" />
            <span>New Order</span>
          </NavLink>

          <NavLink 
            to="/customer/payment-history" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiCreditCard className="text-lg" />
            <span>Payments</span>
          </NavLink>

          <NavLink 
            to="/customer/support" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiHelpCircle className="text-lg" />
            <span>Support</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default CustomerSidebar;