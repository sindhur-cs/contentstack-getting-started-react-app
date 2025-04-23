import React from "react";
import "../styles/Spinner.css";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`spinner-container ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner; 