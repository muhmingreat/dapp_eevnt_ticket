// SplashScreen.js
import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Set a timeout to hide the splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 3000 ms = 3 seconds

    return () => clearTimeout(timer); // Clean up timer if the component is unmounted
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
     <div 
        className= 'flex justify-center items-center text-5xl text-orange-900 pt-2 animate-ping'> 
        GoTicket

          </div> 
      </div>
    );
  }

  return null; 
};

export default SplashScreen;
