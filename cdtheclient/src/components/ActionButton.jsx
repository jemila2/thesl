import PropTypes from 'prop-types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const ActionButton = ({ onClick, icon, div, loading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center">
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium">{div}</span>
      </div>
      {loading ? (
        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  div: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ActionButton;