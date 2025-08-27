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
  
  // Initialize with empty arrays
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both suppliers and products simultaneously
        const [suppliersRes, productsRes] = await Promise.all([
          axios.get('/api/suppliers'),
          axios.get('/api/products')
        ]);

        // Safely extract data from responses with null checks
        const suppliersData = suppliersRes.data?.data ?? [];
        const productsData = productsRes.data?.data ?? [];

        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError('Failed to load required data');
        toast.error('Failed to load suppliers or products');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === 'quantity' || name === 'price' 
      ? Number(value) 
      : value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * (item.price || 0));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        totalAmount: calculateTotal(),
        status: 'pending',
        dateCreated: new Date().toISOString()
      };

      await axios.post('/api/purchase-orders', orderData);
      toast.success('Purchase order created successfully');
      navigate('/purchase-orders');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to create purchase order';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Supplier *
            </div>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Supplier</option>
              {/* Safe mapping with null check */}
              {(suppliers || []).map(supplier => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date *
            </div>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Product *
                  </div>
                  <select
                    name="product"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Product</option>
                    {/* Safe mapping with null check */}
                    {(products || []).map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.code || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Qty *
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price *
                  </div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-2">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium">
            Total: ₦{calculateTotal().toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/purchase-orders')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {submitting ? 'Creating...' : 'Create Purchase Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;