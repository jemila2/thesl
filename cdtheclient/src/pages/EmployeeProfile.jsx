import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ProfileCard from '../components/ProfileCard';


const EmployeeProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    salary: 0
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmployee(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          contact: response.data.contact,
          salary: response.data.salary
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/employees/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setEmployee(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShift = async (shiftData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/employees/${id}/shifts`,
        shiftData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setEmployee(prev => ({
        ...prev,
        shifts: [...prev.shifts, response.data]
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign shift');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="p-6 pl-60 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {employee.name}'s Profile
          </h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1">
            <ProfileCard 
              employee={employee}
              editMode={editMode}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Shifts and Performance */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Shift Schedule</h2>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => document.getElementById('shift-modal').showModal()}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Assign Shift
                  </button>
                )}
              </div>
          
            </div>

           
          </div>
        </div>

        {user?.role === 'admin' && (
          <dialog id="shift-modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Assign New Shift</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                handleAssignShift({
                  date: form.date.value,
                  startTime: form.startTime.value,
                  endTime: form.endTime.value,
                  location: form.location.value
                });
                form.reset();
                document.getElementById('shift-modal').close();
              }}>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Assign Shift
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => document.getElementById('shift-modal').close()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;