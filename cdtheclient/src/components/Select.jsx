const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;