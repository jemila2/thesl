const StatCard = ({ title, value, icon, onClick }) => {
  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow flex items-center justify-between ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
};

export default StatCard