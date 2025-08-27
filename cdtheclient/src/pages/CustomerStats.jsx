const CustomerStats = ({ customers }) => {
  const totalCustomers = customers.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800">Total Customers</h3>
        <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
      </div>
      
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-green-800">Active</h3>
        <p className="text-3xl font-bold text-green-600">{totalCustomers}</p>
      </div>
      
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-purple-800">Recent Activity</h3>
        <p className="text-sm text-purple-600">Last added: {customers.length > 0 ? customers[customers.length - 1].name : 'None'}</p>
      </div>
    </div>
  );
};

export default CustomerStats;