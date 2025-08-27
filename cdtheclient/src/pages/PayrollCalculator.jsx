import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalculator, FaMoneyBillWave } from 'react-icons/fa';

const PayrollCalculator = () => {
  const [employee, setEmployee] = useState(null);
  const [payroll, setPayroll] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
    netSalary: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`/api/employees/${id}`)
        .then(res => res.json())
        .then(data => {
          setEmployee(data);
          setPayroll(prev => ({
            ...prev,
            basicSalary: data.salary
          }));
        });
    }
  }, [id]);

  const calculatePayroll = () => {
    // Simple tax calculation (adjust according to your country's tax rules)
    const taxableIncome = payroll.basicSalary + payroll.allowances - payroll.deductions;
    const tax = taxableIncome > 50000 ? taxableIncome * 0.15 : 0;
    
    setPayroll(prev => ({
      ...prev,
      tax,
      netSalary: taxableIncome - tax
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/payroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: id,
        ...payroll
      })
    });
    alert('Payroll processed successfully!');
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMoneyBillWave /> Payroll for {employee.name}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Basic Salary</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={payroll.basicSalary}
              onChange={(e) => setPayroll({...payroll, basicSalary: parseFloat(e.target.value)})}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Allowances</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={payroll.allowances}
              onChange={(e) => setPayroll({...payroll, allowances: parseFloat(e.target.value)})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Deductions</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={payroll.deductions}
              onChange={(e) => setPayroll({...payroll, deductions: parseFloat(e.target.value)})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tax</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={payroll.tax}
              readOnly
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Net Salary:</span>
            <span className="text-xl font-bold">${payroll.netSalary.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={calculatePayroll}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            <FaCalculator /> Calculate
          </button>
          
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Process Payroll
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollCalculator;