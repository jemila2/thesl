
import { Link } from 'react-router-dom';

const SupplierTable = ({ suppliers = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td className="px-6 py-4">
                <Link 
                  to={`/suppliers/${supplier._id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {supplier.name}
                </Link>
              </td>
              <td className="px-6 py-4">
                {supplier.contactPerson}
              </td>
              <td className="px-6 py-4">
                {supplier.email}
              </td>
              <td className="px-6 py-4">
                {supplier.phone}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                  supplier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {supplier.status || 'pending'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium space-x-2">
                <Link
                  to={`/suppliers/${supplier._id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </Link>
                <Link
                  to={`/suppliers/${supplier._id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
                <Link
                  to={`/suppliers/${supplier._id}/orders`}
                  className="text-green-600 hover:text-green-900"
                >
                  Orders
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;