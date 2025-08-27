import { NavLink } from 'react-router-dom';
import { 
  FiPieChart,
  FiList,
  FiPackage,
  FiDollarSign,
  FiSettings
} from 'react-icons/fi';

const SupplierSidebar = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-35 bg-blue-800 text-white">
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-8">Supplier Portal</h2>
        
        <nav className="space-y-2 flex-1">
          <NavLink 
            to="/supplier-portal/dashboard" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiPieChart className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/supplier-portal/orders" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiList className="text-lg" />
            <span>Orders</span>
          </NavLink>

          <NavLink 
            to="/supplier-portal/inventory" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiPackage className="text-lg" />
            <span>Inventory</span>
          </NavLink>

          <NavLink 
            to="/supplier-portal/payments" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiDollarSign className="text-lg" />
            <span>Payments</span>
          </NavLink>

          <NavLink 
            to="/supplier-portal/settings" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiSettings className="text-lg" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default SupplierSidebar;