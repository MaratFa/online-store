
import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#007bff' 
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} style={{ borderTopColor: color }}>
      <div className="loading-spinner-inner"></div>
    </div>
  );
};
