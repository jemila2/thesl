
import React from 'react';

const PaymentHistory = () => {
  const payments = [
    { id: 1, date: '2023-05-15', amount: 2500, status: 'Paid' },
    { id: 2, date: '2023-05-10', amount: 3500, status: 'Paid' },
 
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₦{payment.amount.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  payment.status === 'Paid' ? 'text-green-600' : 
                  payment.status === 'Pending' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No payment history found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;