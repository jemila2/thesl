import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers/${id}`);
        setCustomer(response.data);
      } catch (err) {
        toast.error('Failed to load customer details');
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Name</h2>
          <p>{customer.name}</p>
        </div>
        
        <div>
          <h2 className="font-semibold">Email</h2>
          <p>{customer.email}</p>
        </div>
        
        <div>
          <h2 className="font-semibold">Phone</h2>
          <p>{customer.phone || 'N/A'}</p>
        </div>
        
        <div>
          <h2 className="font-semibold">Address</h2>
          <p>{customer.address || 'N/A'}</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/customers')}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;