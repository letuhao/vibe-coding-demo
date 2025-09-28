/**
 * @fileoverview Button component
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  loading = false,
  type = 'button',
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const defaultClasses = 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const disabledClasses = 'bg-gray-400 cursor-not-allowed';
  const loadingClasses = 'opacity-50 cursor-not-allowed';

  const classes = [
    baseClasses,
    disabled || loading ? disabledClasses : defaultClasses,
    loading ? loadingClasses : '',
    className,
  ].join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
