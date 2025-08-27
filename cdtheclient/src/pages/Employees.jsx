
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth(); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3001/api/employees",
          config
        );
        setEmployees(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err.response?.data?.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchEmployees();
    } else {
      setError("Authentication required");
      setLoading(false);
    }
  }, [authToken]);

  const deleteEmployee = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      await axios.delete(
        `http://localhost:3001/api/employees/${id}`,
        config
      );
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <Link
        to="/employees/add"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Employee
      </Link>
      <div className="overflow-x-auto ml-60">
        <table className="min-w-80 bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Salary</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="py-2 px-4 border">{emp.name}</td>
                <td className="py-2 px-4 border">{emp.role}</td>
                <td className="py-2 px-4 border">{emp.contact}</td>
                <td className="py-2 px-4 border">₦{emp.salary?.toLocaleString()}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`/employees/edit/${emp._id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this employee?")) {
                        deleteEmployee(emp._id);
                      }
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;