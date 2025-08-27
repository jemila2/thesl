
import SupplierSidebar from './SupplierSidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const SupplierLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SupplierSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupplierLayout;