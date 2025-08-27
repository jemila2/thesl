
// import { browserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import EmployeeRoute from './components/EmployeeRoute';
import SupplierRoute from './components/SupplierRoute';
import CustomerRoute from './components/CustomerRoute';
import DashboardLayout from './components/DashboardLayout';
import SupplierLayout from './components/SupplierLayout';
import CustomerLayout from './components/CustomerLayout';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


import AdminDashboard from './pages/AdminDashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeProfile from './pages/EmployeeProfile';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import SupplierForm from './pages/SupplierForm';
import SupplierDetail from './pages/SupplierDetail';
import PurchaseOrders from './pages/PurchaseOrders';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder';
import PurchaseOrderDetail from './pages/PurchaseOrderDetail';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import AdminSettings from './pages/AdminSettings';


// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeOrders from './pages/EmployeeOrders';
import NewOrderPage from './pages/NewOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import Schedule from './pages/Schedule';
import EmployeeTasks from './components/EmployeeTasks';
import EmployeeReports from './pages/EmployeeReports';
import EmployeeMessages from './pages/EmployeeMessages';
import ManageOrders from './pages/ManageOrders';

// Supplier Pages
import SupplierDashboard from './pages/SupplierDashboard';
import SupplierOrders from './pages/SupplierOrders';
import SupplierInventory from './pages/SupplierInventory';
import SupplierPayments from './pages/SupplierPayments';
import SupplierSettings from './pages/SupplierSettings';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import PaymentHistory from './pages/PaymentHistory';
import Support from './pages/Support';
import CustomerForm from './pages/CustomerForm';
import CustomerDetails from './pages/CustomerDetails';
import CustomerNewOrder from './pages/CustomerNewOrder';
import CustomerOrders from './pages/CustomerOrders';

// Import AdminRegistrationForm and React hooks
import { useState, useEffect } from 'react';
import AdminRegistrationForm from './components/AdminRegistrationForm';

// Admin Setup Check Component
const AdminSetupCheck = ({ children }) => {
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE_URL}/admin/admins/count`);
        
        if (response.ok) {
          const data = await response.json();
          setShowAdminSetup(data.count === 0);
        } else {
          // If endpoint doesn't exist yet, show setup form
          setShowAdminSetup(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // If there's an error, show setup form
        setShowAdminSetup(true);
      } finally {
        setChecking(false);
      }
    };

    checkAdminExists();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking system configuration...</p>
        </div>
      </div>
    );
  }

  if (showAdminSetup) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <AdminRegistrationForm onSuccess={() => setShowAdminSetup(false)} />
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <AdminSetupCheck>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Admin setup route */}
            <Route path="/setup-admin" element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <AdminRegistrationForm />
              </div>
            } />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Common routes for all authenticated users */}
              <Route path="/profile" element={<Profile />} />

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index path="admin" element={<AdminDashboard />} />
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  
                  {/* User Management */}
                  <Route path="employees" element={<Employees />} />
                  <Route path="employees/add" element={<EmployeeForm />} />
                  <Route path="employees/edit/:id" element={<EmployeeForm />} />
                  <Route path="employees/:id" element={<EmployeeProfile adminView />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="suppliers" element={<Suppliers />} />
                  <Route path="suppliers/add" element={<SupplierForm />} />
                  <Route path="suppliers/:id" element={<SupplierDetail />} />
                  <Route path="suppliers/edit/:id" element={<SupplierForm />} />
                  
                  {/* Order Management */}
                  <Route path="orders" element={<EmployeeOrders adminView />} />
                  <Route path="orders/new" element={<NewOrderPage adminView />} />
                  <Route path="orders/:orderId" element={<OrderDetailPage adminView />} />
                  <Route path="purchase-orders" element={<PurchaseOrders />} />
                  <Route path="purchase-orders/new" element={<CreatePurchaseOrder />} />
                  <Route path="purchase-orders/:orderId" element={<PurchaseOrderDetail />} />
                  
                  {/* Inventory & Finance */}
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="payments" element={<Payments />} />
                  
                  {/* System Settings */}
                  <Route path="settings" element={<AdminSettings />} />
                 
                </Route>
              </Route>

              {/* Employee routes */}
              <Route element={<EmployeeRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index path="dashboard" element={<EmployeeDashboard />} />
                  
                  {/* Profile */}
                  <Route path="profile/:id" element={<EmployeeProfile />} />
                  
                  {/* Orders */}
                  <Route path="orders" element={<EmployeeOrders />} />
                  <Route path="orders/new" element={<NewOrderPage />} />
                  <Route path="orders/:orderId" element={<OrderDetailPage />} />
                  <Route path="employee/orders" element={<ManageOrders />} />
                  
                  {/* Customer Management */}
                  <Route path="customers" element={<Customers employeeView />} />
                  <Route path="customers/add" element={<CustomerForm />} />
                  <Route path="customers/edit/:id" element={<CustomerForm />} />
                  <Route path="customers/:id" element={<CustomerDetails />} />
                  
                  {/* Schedule & Tasks */}
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="tasks" element={<EmployeeTasks />} />
                  
                  {/* Reports & Communication */}
                  <Route path="reports" element={<EmployeeReports />} />
                  <Route path="messages" element={<EmployeeMessages />} />
                </Route>
              </Route>

              {/* Supplier routes */}
              <Route element={<SupplierRoute />}>
                <Route element={<SupplierLayout />}>
                  <Route index path="dashboard" element={<SupplierDashboard />} />
                  <Route path="orders" element={<SupplierOrders />} />
                  <Route path="orders/:orderId" element={<PurchaseOrderDetail external />} />
                  <Route path="inventory" element={<SupplierInventory />} />
                  <Route path="payments" element={<SupplierPayments />} />
                  <Route path="settings" element={<SupplierSettings />} />
                </Route>
              </Route>

              {/* Customer routes */}
              <Route element={<CustomerRoute />}>
                <Route element={<CustomerLayout />}>
                  <Route index path="customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="customer/orders" element={<CustomerOrders />} />
                  <Route path="customer/orders/new" element={<CustomerNewOrder />} />
                  <Route path="customer/orders/:orderId" element={<OrderDetailPage customerView />} />
                  <Route path="customer/payment-history" element={<PaymentHistory />} />
                  <Route path="customer/support" element={<Support />} />
                </Route>
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AdminSetupCheck>
    </AuthProvider>
  );
};

export default App;
