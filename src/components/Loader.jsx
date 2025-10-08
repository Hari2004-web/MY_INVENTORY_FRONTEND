// src/components/Loader.jsx

const Loader = ({ 
  color = "#32cd32", // Default color is lime green
  size = "medium",    // Options: "small", "medium", "large"
  text = "", 
  textColor = "" 
}) => {
  const sizeMap = {
    small: "80px",
    medium: "120px",
    large: "160px",
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  return (
    <>
      <style>
        {`
          .lifeline-path {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            animation: draw-lifeline 2.5s ease-in-out infinite;
          }

          @keyframes draw-lifeline {
            0% {
              stroke-dashoffset: 400;
            }
            40% {
              stroke-dashoffset: 0;
            }
            60% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -400;
            }
          }
        `}
      </style>
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <svg 
          width={currentSize} 
          height={currentSize} 
          viewBox="0 0 132 40" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            className="lifeline-path"
            d="M0 20 H30 L35 12 L40 28 L45 8 L50 24 L55 18 H65 L70 25 L75 15 L80 22 H132" 
            stroke={color} 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {text && (
          <p 
            className="text-lg font-semibold" 
            style={{ color: textColor || color }}
          >
            {text}
          </p>
        )}
      </div>
    </>
  );
};

export default Loader;