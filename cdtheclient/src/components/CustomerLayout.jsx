
import CustomerSidebar from './CustomerSidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;