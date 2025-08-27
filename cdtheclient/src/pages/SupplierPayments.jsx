
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupplierPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const [paymentsRes, balanceRes] = await Promise.all([
          axios.get('/api/supplier/payments'),
          axios.get('/api/supplier/balance')
        ]);
        setPayments(paymentsRes.data);
        setBalance(balanceRes.data.balance);
      } catch (error) {
        toast.error('Failed to load payment data');
        console.error('Payment fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-4">Loading payment history...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500">Current Balance</h3>
          <p className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.description || 'Supplier Payment'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  payment.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payment.amount > 0 ? '+' : ''}${Math.abs(payment.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {payment.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.invoice && (
                    <a 
                      href={`/api/invoices/${payment.invoice}/download`} 
                      className="text-blue-600 hover:text-blue-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPayments;