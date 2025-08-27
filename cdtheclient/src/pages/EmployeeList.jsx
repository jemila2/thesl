


import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const mockData = [
          { id: 1, name: 'John ', position: 'Develer' },
          { id: 2, name: 'Jane Smh', position: 'Desner' },
          { id: 3, name: 'Mike Json', position: 'Maner' }
        ];
        
      
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEmployees(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading employees...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(employees)) {
    return <div>Employee data is not in expected format</div>;
  }

  if (employees.length === 0) {
    return <div>No employees found</div>;
  }

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <h3>{employee.name}</h3>
            <p>{employee.position}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;