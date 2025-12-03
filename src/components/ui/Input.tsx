import React from 'react';
import './Input.css';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  autoComplete?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  id,
  name,
  required = false,
  disabled = false,
  error = false,
  helperText,
  label,
  autoComplete,
  ...rest
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${className}`.trim();

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        {...rest}
      />
      {helperText && (
        <p className={`helper-text ${error ? 'error-text' : ''}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
