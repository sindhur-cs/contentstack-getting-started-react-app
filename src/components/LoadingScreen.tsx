import React from "react";
import "../styles/LoadingScreenStyles.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img
        src="/drinkitup.png"
        alt="Logo"
        height={80}
        width={80}
      />
    </div>
  );
};

export default LoadingScreen;
