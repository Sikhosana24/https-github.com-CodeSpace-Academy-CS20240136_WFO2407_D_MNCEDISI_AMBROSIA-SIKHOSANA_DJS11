import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="loading-spinner rounded-full h-32 w-32"></div>
    </div>
  );
};

export default LoadingSpinner;

