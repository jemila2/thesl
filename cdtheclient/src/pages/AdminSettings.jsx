
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    systemName: 'Laundryapp',
    maintenanceMode: false,
    notificationEmail: 'jemiletuabubakar08@gmail.com'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="p-6 pl-50">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="form-control">
          <div className="label">
            <span className="label-text">System Name</span>
          </div>
          <input
            type="text"
            name="systemName"
            value={settings.systemName}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <div className="label cursor-pointer">
            <span className="label-text">Maintenance Mode</span>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="toggle toggle-primary"
            />
          </div>
        </div>

        <div className="form-control">
          <div className="label">
            <span className="label-text">Notification Email</span>
          </div>
          <input
            type="email"
            name="notificationEmail"
            value={settings.notificationEmail}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control pt-4">
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;