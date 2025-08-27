

import React from 'react';
import { FiUser } from 'react-icons/fi';

const ProfileCard = ({ employee = {}, editMode = false, formData = {}, onInputChange, onSubmit }) => {

  const safeEmployee = employee || {};
  const safeFormData = formData || {};
  
  const getInitial = () => {
    try {
      return safeEmployee.name?.charAt(0)?.toUpperCase() || '?';
    } catch {
      return '?';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 mb-3">
          {getInitial()}
        </div>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={safeFormData.name || ''}
            onChange={onInputChange}
            className="text-xl font-bold text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <h2 className="text-xl font-bold">{safeEmployee.name || 'No Name Provided'}</h2>
        )}
        <p className="text-gray-500">{safeEmployee.role || 'No Role'}</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-500">Email</div>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={safeFormData.email || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p>{safeEmployee.email || 'No email provided'}</p>
          )}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-500">Contact</div>
          {editMode ? (
            <input
              type="tel"
              name="contact"
              value={safeFormData.contact || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p>{safeEmployee.contact || 'No contact provided'}</p>
          )}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-500">Salary</div>
          {editMode ? (
            <input
              type="number"
              name="salary"
              value={safeFormData.salary || 0}
              onChange={onInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p>${safeEmployee.salary ? safeEmployee.salary.toLocaleString() : '0'}</p>
          )}
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-500">Member Since</div>
          <p>
            {safeEmployee.createdAt 
              ? new Date(safeEmployee.createdAt).toLocaleDateString() 
              : 'Unknown date'}
          </p>
        </div>

        {editMode && (
          <button
            onClick={onSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={!onSubmit} 
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;