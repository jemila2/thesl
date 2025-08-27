
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';


const SupplierSettings = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, accountsRes] = await Promise.all([
          axios.get('/api/supplier/profile'),
          axios.get('/api/supplier/bank-accounts')
        ]);
        setSupplier(supplierRes.data);
        setBankAccounts(accountsRes.data);
        reset(supplierRes.data);
      } catch (error) {
        toast.error('Failed to load supplier data');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put('/api/supplier/profile', data);
      setSupplier(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  const handleAddBankAccount = async (accountData) => {
    try {
      const response = await axios.post('/api/supplier/bank-accounts', accountData);
      setBankAccounts([...bankAccounts, response.data]);
      toast.success('Bank account added');
    } catch (error) {
      toast.error('Failed to add bank account');
    }
  };

  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Supplier Settings</h1>

      {/* Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                {...register("name", { required: "Company name is required" })}
                className="w-full p-2 border rounded-md"
                defaultValue={supplier?.name}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address"
                  }
                })}
                className="w-full p-2 border rounded-md"
                defaultValue={supplier?.email}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                {...register("phone")}
                className="w-full p-2 border rounded-md"
                defaultValue={supplier?.phone}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
              <input
                {...register("taxId")}
                className="w-full p-2 border rounded-md"
                defaultValue={supplier?.taxId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <select
                {...register("businessType")}
                className="w-full p-2 border rounded-md"
                defaultValue={supplier?.businessType}
              >
                <option value="individual">Individual</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register("address")}
              rows={3}
              className="w-full p-2 border rounded-md"
              defaultValue={supplier?.address}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Bank Accounts Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bank Accounts</h2>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {/* Open add bank account modal */}}
          >
            Add Account
          </button>
        </div>

        {bankAccounts.length > 0 ? (
          <div className="space-y-4">
            {bankAccounts.map(account => (
              <div key={account._id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{account.bankName}</p>
                    <p className="text-gray-600">•••• {account.last4}</p>
                  </div>
                  <div className="text-right">
                    <p className="capitalize">{account.accountType}</p>
                    {account.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Remove
                  </button>
                  {!account.isDefault && (
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No bank accounts added</p>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              className="rounded text-blue-600"
              defaultChecked={supplier?.notifications?.orderUpdates}
            />
            <span>New order notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              className="rounded text-blue-600"
              defaultChecked={supplier?.notifications?.paymentUpdates}
            />
            <span>Payment notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              className="rounded text-blue-600"
              defaultChecked={supplier?.notifications?.promotions}
            />
            <span>Promotional offers</span>
          </label>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierSettings;