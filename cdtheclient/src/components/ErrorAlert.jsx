import PropTypes from 'prop-types';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ErrorAlert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <div className="flex items-center">
        <span className="font-medium mr-2">Error:</span>
        <span>{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-red-700 hover:text-red-900"
        aria-label="Close error"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func
};

export default ErrorAlert;