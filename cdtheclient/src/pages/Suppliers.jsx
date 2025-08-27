import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SupplierTable from '../components/SupplierTable';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { api } = useAuth();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/suppliers');
        
        console.log('API Response:', response); 
        const contentType = response.headers?.['content-type'];
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Received HTML instead of JSON. Check backend service.');
        }

        // Handle successful response
        const data = response.data?.data || response.data?.suppliers || response.data || [];
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        setSuppliers(data);
        setError(null);
      } catch (err) {
        console.error('API Error Details:', {
          message: err.message,
          config: err.config,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Failed to load suppliers';
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [api]);
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-4 ml-40">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 ml-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error loading suppliers</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 ml-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link
          to="/suppliers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Supplier
        </Link>
      </div>

      <div className="mb-4 ml-50">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {filteredSuppliers.length > 0 ? (
        <SupplierTable suppliers={filteredSuppliers} />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matching suppliers found' : 'No suppliers found'}
          </p>
          {!searchTerm && (
            <Link
              to="/suppliers/add"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Your First Supplier
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Suppliers;