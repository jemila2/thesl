
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiShoppingBag, FiPlusCircle, 
  FiUser, FiLogOut, FiX, FiUsers, 
  FiLayers, FiTruck, FiPackage, FiList,
  FiDollarSign, FiSettings, FiClipboard,
  FiCalendar, FiCreditCard, FiHelpCircle,
  FiPieChart, FiInfo, FiMail, FiUserCheck
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch(user.role) {
      case 'admin': return '/admin';
      case 'employee': return '/dashboard';
      case 'supplier': return '/dashboard';
      case 'customer': return '/customer/dashboard';
      default: return '/';
    }
  };

  // Get the correct profile path based on user role
  const getProfilePath = () => {
    if (!user) return '/profile';
    return user.role === 'admin' 
      ? '/profile' 
      : `/profile/${user._id || user.id || user.employeeId}`;
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-54 bg-blue-800 text-white transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}>
      <div className="p-4 relative h-full flex flex-col">
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-1 text-white hover:text-blue-200"
          aria-label="Close sidebar"
        >
          <FiX size={24} />
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold">LaundryPro</h2>
          <p className="text-sm text-blue-200 mt-6">Management Portal</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {/* Common Routes for All Roles */}
          <NavItem to={getDashboardPath()} icon={<FiPieChart />}>
            Dashboard
          </NavItem>

          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Management</div>
              <NavItem to="/orders" icon={<FiLayers />}>
                All Orders
              </NavItem>
              <NavItem to="/suppliers" icon={<FiTruck />}>
                Suppliers
              </NavItem>
              
           
            
              <NavItem to="/inventory" icon={<FiPackage />}>
                Inventory
              </NavItem>
              <NavItem to="/settings" icon={<FiSettings />}>
                Settings
              </NavItem>
            
            </>
          )}

          {/* Employee Routes */}
          {user?.role === 'employee' && (
            <>
              <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Orders</div>
              <NavItem to="/orders" icon={<FiShoppingBag />}>
                My Orders
              </NavItem>
              <NavItem to="/orders/new" icon={<FiPlusCircle />}>
                New Order
              </NavItem>
              <NavItem to="/customers" icon={<FiUsers />}>
                Customers
              </NavItem>
             
            </>
          )}

          {/* Supplier Routes */}
          {user?.role === 'supplier' && (
            <>
              <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">Supplier Portal</div>
              <NavItem to="/orders" icon={<FiList />}>
                Orders
              </NavItem>
              <NavItem to="/inventory" icon={<FiPackage />}>
                Inventory
              </NavItem>
              <NavItem to="/payments" icon={<FiDollarSign />}>
                Payments
              </NavItem>
              <NavItem to="/settings" icon={<FiSettings />}>
                Settings
              </NavItem>
            </>
          )}

          {/* Customer Routes */}
          {user?.role === 'customer' && (
            <>
              <div className="text-xs uppercase text-blue-300 px-3 pt-4 pb-1">My Account</div>
              <NavItem to="/customer/dashboard" icon={<FiPieChart />}>
                Dashboard
              </NavItem>
              <NavItem to="/customer/orders" icon={<FiShoppingBag />}>
                My Orders
              </NavItem>
              <NavItem to="/customer/orders/new" icon={<FiPlusCircle />}>
                New Order
              </NavItem>
              <NavItem to="/customer/support" icon={<FiHelpCircle />}>
                Support
              </NavItem>
            </>
          )}
        </nav>
        
        {/* User Profile Section */}
        {user && (
          <div className="border-t border-blue-700 pt-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                {user.name?.charAt(0)?.toUpperCase() || <FiUser size={18} />}
              </div>
              <div>
                <p className="font-medium">{user.name || 'User'}</p>
                <p className="text-sm text-blue-200">
                  {user.email} ({user.role || 'user'})
                </p>
              </div>
            </div>

            {user?.role === 'employee' && (
              <div className="mb-4">
             
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, children, onClick, className = '' }) => {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive ? 'bg-blue-700 shadow-md' : 'hover:bg-blue-700/50 text-blue-100'
        } ${className}`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
};

export default Sidebar;