import React from 'react';
import './index.css';

const LoadingWave = () => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center overlay">
      {[...Array(10)].map((_, index) => (
        <div
          className="bg-primary rounded-pill m-2 wave"
          style={{ animationDelay: `${index * 0.1}s` }}
          key={index}
        ></div>
      ))}
    </div>
  );
};

export default LoadingWave;
