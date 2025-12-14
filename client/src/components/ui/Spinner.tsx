import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'light';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const spinnerClass = `spinner spinner-${size} spinner-${color} ${className}`.trim();

  return (
    <div className={spinnerClass}>
      <div className="spinner-inner"></div>
    </div>
  );
};
