import React from "react";
import Image from "next/image";
import "@/styles/LoadingScreenStyles.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Image
        src="https://dev11-images.csnonprod.com/v3/assets/blt6909adbed69bd01c/bltb99e168c75e99af6/66f3c165464e5947d45975a7/Logomark.png"
        alt="Logo"
        width={80}
        height={64}
        priority={true}
      />
    </div>
  );
};

export default LoadingScreen;
