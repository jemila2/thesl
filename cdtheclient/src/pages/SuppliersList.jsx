import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SuppliersList = () => {
  const { suppliers, suppliersLoading, getSuppliers } = useAuth();

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        await getSuppliers({
          status: 'active',
          sort: 'name'
        });
      } catch (error) {
        console.error('Failed to load suppliers:', error);
      }
    };
    loadSuppliers();
  }, []);

  if (suppliersLoading) return <div>Loading suppliers...</div>;

  return (
    <div>
      {suppliers.map(supplier => (
        <div key={supplier._id}>
          <h3>{supplier.name}</h3>
          <p>{supplier.email}</p>
        </div>
      ))}
    </div>
  );
};
export default SuppliersList