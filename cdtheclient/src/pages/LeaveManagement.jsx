import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserClock, FaCheck, FaTimes } from 'react-icons/fa';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'casual'
  });

  useEffect(() => {
    fetch('/api/leave-requests')
      .then(res => res.json())
      .then(data => setLeaveRequests(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/leave-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    });
    const data = await res.json();
    setLeaveRequests([...leaveRequests, data]);
    setNewRequest({
      startDate: '',
      endDate: '',
      reason: '',
      type: 'casual'
    });
  };

  const handleApprove = async (id) => {
    await fetch(`/api/leave-requests/${id}/approve`, { method: 'PUT' });
    setLeaveRequests(leaveRequests.map(req => 
      req._id === id ? {...req, status: 'approved'} : req
    ));
  };

  const handleReject = async (id) => {
    await fetch(`/api/leave-requests/${id}/reject`, { method: 'PUT' });
    setLeaveRequests(leaveRequests.map(req => 
      req._id === id ? {...req, status: 'rejected'} : req
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaUserClock /> Leave Management
      </h2>
      
      {/* New Leave Request Form */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">New Leave Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                required
              />
            </div>
            
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={newRequest.type}
              onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
            >
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="annual">Annual Leave</option>
            </select>
          </div>
          
          <div>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Reason for leave"
              value={newRequest.reason}
              onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </div>
      
      {/* Leave Requests List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Leave Requests</h3>
        <div className="space-y-3">
          {leaveRequests.map(request => (
            <div key={request._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{request.employeeName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{request.reason}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                  
                  {request.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(request._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleReject(request._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;