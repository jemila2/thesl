// src/pages/SupplierDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`/api/suppliers/${id}`);
        setSupplier(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load supplier');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`/api/suppliers/${id}`);
        toast.success('Supplier deleted successfully');
        navigate('/suppliers');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to delete supplier');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error loading supplier</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => navigate('/suppliers')}
            className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Back to Suppliers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pl-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Details</h1>
        <div className="space-x-2">
          <Link
            to={`/suppliers/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Basic Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {supplier.name}</p>
              <p><span className="font-medium">Contact Person:</span> {supplier.contactPerson}</p>
              <p><span className="font-medium">Email:</span> {supplier.email}</p>
              <p><span className="font-medium">Phone:</span> {supplier.phone}</p>
              <p>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                  supplier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {supplier.status}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Address</h2>
            <p className="whitespace-pre-line">{supplier.address || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Actions</h2>
          <div className="flex space-x-4">
            <Link
              to={`/suppliers/${id}/orders`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Orders
            </Link>
            <Link
              to={`/suppliers/${id}/inventory`}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;