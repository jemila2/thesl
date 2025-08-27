
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiTruck, FiDollarSign, FiInfo, 
  FiMail, FiUser, FiLogOut, FiMenu, 
  FiX, FiShoppingBag, FiSettings, FiPieChart 
} from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, loading, logout, isCustomer } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const closeMenus = (e) => {
      if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-trigger')) {
        setIsProfileDropdownOpen(false);
      }
      if (!e.target.closest('.mobile-menu-button') && !e.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  if (loading) return null;

  const getUserName = () => {
    if (!user) return 'Customer';
    return user.name?.split(' ')[0] || 'Customer';
  };

  // Get the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    if (isCustomer()) return '/customer/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'employee') return '/dashboard';
    if (user.role === 'supplier') return '/dashboard';
    return '/';
  };

  // Get the correct profile path based on user role
  const getProfilePath = () => {
    if (!user) return '/profile';
    if (user.role === 'admin') return '/profile';
    return `/profile/${user._id || user.id || user.employeeId}`;
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-xl font-bold">
            <span className="text-white">LaundryPro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Common navigation links */}
            <Link to="/" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
              <FiHome className="text-lg" />
              <span>Home</span>
            </Link>
            <Link to="/services" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
              <FiTruck className="text-lg" />
              <span>Services</span>
            </Link>
           
            <Link to="/about" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
              <FiInfo className="text-lg" />
              <span>About</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
              <FiMail className="text-lg" />
              <span>Contact</span>
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="relative ml-4">
                <button 
                  className="profile-trigger flex items-center space-x-2 hover:bg-blue-700 rounded-lg p-2 transition-colors"
                  onClick={toggleProfileDropdown}
                  aria-label="User profile"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user.name?.charAt(0)?.toUpperCase() || <FiUser size={18} />}
                  </div>
                  <span className="text-white">Hi, {getUserName()}</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown absolute right-0 mt-2 w-56 bg-blue-700 rounded-lg shadow-lg py-2 z-50 border border-blue-600">
                    <Link 
                      to={getDashboardPath()} 
                      className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiPieChart />
                      <span>Dashboard</span>
                    </Link>
                    {isCustomer() && (
                      <>
                        <Link 
                          to="/customer/orders" 
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FiShoppingBag />
                          <span>My Orders</span>
                        </Link>
                        <Link 
                          to="/customer/orders/new" 
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FiShoppingBag />
                          <span>New Order</span>
                        </Link>
                   
                      </>
                    )}
                    {user.role === 'employee' && (
                      <>
                        <Link 
                          to="/orders" 
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FiShoppingBag />
                          <span>My Orders</span>
                        </Link>
                        <Link 
                          to="/orders/new" 
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FiShoppingBag />
                          <span>New Order</span>
                        </Link>
                      </>
                    )}
                
                    <div className="border-t border-blue-600 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-2 text-white hover:bg-blue-600 rounded-md mx-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-button md:hidden p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden bg-blue-800 shadow-xl pb-4">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={toggleMobileMenu}
            >
              <FiHome />
              <span>Home</span>
            </Link>
            <Link 
              to="/services" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={toggleMobileMenu}
            >
              <FiTruck />
              <span>Services</span>
            </Link>
           
            <Link 
              to="/about" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={toggleMobileMenu}
            >
              <FiInfo />
              <span>About</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={toggleMobileMenu}
            >
              <FiMail />
              <span>Contact</span>
            </Link>

            {user ? (
              <>
                <div className="border-t border-blue-700 my-2"></div>
                <Link 
                  to={getDashboardPath()} 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                  onClick={toggleMobileMenu}
                >
                  <FiPieChart />
                  <span>Dashboard</span>
                </Link>
                {isCustomer() && (
                  <>
                    <Link 
                      to="/customer/orders" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                      onClick={toggleMobileMenu}
                    >
                      <FiShoppingBag />
                      <span>My Orders</span>
                    </Link>
                    <Link 
                      to="/customer/orders/new" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                      onClick={toggleMobileMenu}
                    >
                      <FiShoppingBag />
                      <span>New Order</span>
                    </Link>
                
                  </>
                )}
                {user.role === 'employee' && (
                  <>
                    <Link 
                      to="/orders" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                      onClick={toggleMobileMenu}
                    >
                      <FiShoppingBag />
                      <span>My Orders</span>
                    </Link>
                    <Link 
                      to="/orders/new" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                      onClick={toggleMobileMenu}
                    >
                      <FiShoppingBag />
                      <span>New Order</span>
                    </Link>
                  </>
                )}
              
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-white hover:bg-blue-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-4 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-2 text-blue-800 bg-white rounded-md hover:bg-blue-100 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;