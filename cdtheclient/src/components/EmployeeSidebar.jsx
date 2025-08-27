
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiPieChart,
  FiShoppingBag,
  FiPlusCircle,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiMail,
  FiUser
} from 'react-icons/fi';

const EmployeeSidebar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 w-54 bg-blue-800 text-white ">
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-8 ">Employee Portal</h2>
        
        <nav className="space-y-1 flex-1">
          {/* Dashboard */}
          <NavLink 
            to="/dashboard" 
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

          {/* Orders Section */}
          <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Orders</div>
          <NavLink 
            to="/orders" 
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
            to="/orders/new" 
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
            to="/employee/orders"
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiShoppingBag className="text-lg" />
            <span>Manage Orders</span>
          </NavLink>

          {/* Customer Management */}
          <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Customers</div>
          <NavLink 
            to="/customers" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiUsers className="text-lg" />
            <span>Customer List</span>
          </NavLink>

          {/* Schedule & Tasks */}
          <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Work</div>
          <NavLink 
            to="/schedule" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiCalendar className="text-lg" />
            <span>Schedule</span>
          </NavLink>
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiClipboard className="text-lg" />
            <span>Tasks</span>
          </NavLink>

          {/* Communication */}
          <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Communication</div>
          <NavLink 
            to="/messages" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiMail className="text-lg" />
            <span>Messages</span>
          </NavLink>

          {/* Profile */}
          <NavLink 
            to={`/profile/${user?._id || user?.id || user?.employeeId}`}
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              }`
            }
          >
            <FiUser className="text-lg" />
            <span>My Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default EmployeeSidebar;