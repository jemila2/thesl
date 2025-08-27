

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (activeForm === 'password') {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
      
        await updateUser({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        setSuccess('Password changed successfully');
      } else {
      
        await updateUser({
          name: formData.name,
          email: formData.email
        });
        setSuccess('Profile updated successfully');
      }
      setActiveForm(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="space-y-4">
            <ProfileField label="Name" value={user?.name} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField label="Member Since" value={new Date(user?.createdAt).toLocaleDateString()} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Account Actions</h3>
          <div className="space-y-3">
            {activeForm !== 'password' ? (
              <button 
                onClick={() => setActiveForm('password')}
                className="w-full text-left p-3 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded">
                <h4 className="font-medium">Change Password</h4>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <div className="flex space-x-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveForm(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {activeForm !== 'profile' ? (
              <button 
                onClick={() => setActiveForm('profile')}
                className="w-full text-left p-3 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
              >
                Update Personal Information
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded">
                <h4 className="font-medium">Update Profile</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <div className="flex space-x-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveForm(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || 'Not provided'}</p>
    </div>
  );
}

export default Profile;