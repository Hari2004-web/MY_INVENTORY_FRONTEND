const Button = ({ onClick, children, variant = 'primary', type = 'button', className = '' }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary-dark focus:ring-primary",
    danger: "bg-danger hover:bg-red-700 focus:ring-danger",
    success: "bg-success hover:bg-green-700 focus:ring-success",
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;