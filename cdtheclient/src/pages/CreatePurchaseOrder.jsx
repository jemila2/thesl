import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplier: '',
    deliveryDate: '',
    items: [{ product: '', quantity: 1, price: 0 }],
    notes: ''
  });
  
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Safe data fetching with error handling
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [suppliersRes, productsRes] = await Promise.all([
          axios.get('/api/suppliers'),
          axios.get('/api/products')
        ]);

        // Verify response structure before setting state
        if (isMounted) {
          setSuppliers(Array.isArray(suppliersRes?.data?.data) ? suppliersRes.data.data : []);
          setProducts(Array.isArray(productsRes?.data?.data) ? productsRes.data.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load required data');
          toast.error(err.response?.data?.message || 'Failed to load data');
          console.error('API Error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  // Form handlers with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    
    newItems[index] = {
      ...newItems[index],
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    };
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) {
      toast.warning('At least one item is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.supplier || !formData.deliveryDate || 
        formData.items.some(item => !item.product)) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        totalAmount: calculateTotal(),
        status: 'pending',
        dateCreated: new Date().toISOString()
      };

      const response = await axios.post('/api/purchase-orders', orderData);
      toast.success('Purchase order created successfully');
      navigate('/purchase-orders');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to create purchase order';
      toast.error(errorMessage);
      console.error('Submission Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex justify-between">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              Retry
            </button>
          </div>
          <p className="text-sm mt-2">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Supplier and Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier *
            </label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date *
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Order Items *</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product *
                  </label>
                  <select
                    name="product"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.code || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price *
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <div className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Any additional information..."
          />
        </div>

        {/* Total and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6">
          <div className="text-xl font-bold mb-4 md:mb-0">
            Total: ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/purchase-orders')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Create Purchase Order'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;