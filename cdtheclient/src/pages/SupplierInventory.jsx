import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import InventoryItem from '../components/InventoryItem';

const SupplierInventory = ({ external = false }) => {
  const { id } = useParams();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const url = external
          ? '/api/supplier/inventory'
          : `/api/suppliers/${id}/inventory`;
        const res = await axios.get(url);
        setInventory(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id, external]);

  const handleRestock = async (productId, quantity) => {
    try {
      await axios.post(`/api/inventory/restock`, {
        productId,
        quantity,
        supplierId: id
      });
      // Refresh inventory after restock
      const res = await axios.get(`/api/suppliers/${id}/inventory`);
      setInventory(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Restock failed');
    }
  };

  if (loading) return <div className="p-4">Loading inventory...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 pl-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {external ? 'Your Products' : `Inventory from Supplier`}
        </h2>
        {!external && (
          <Link
            to={`/suppliers/${id}`}
            className="text-blue-500 hover:underline"
          >
            Back to Supplier
          </Link>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Restock
              </th>
              {!external && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <InventoryItem
                key={item._id}
                item={item}
                onRestock={handleRestock}
                showActions={!external}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierInventory;