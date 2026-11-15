import React from 'react';
import Link from './Link';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'rose' | 'ghost' | 'light'
  size = 'normal',     // 'normal' | 'sm'
  to,
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  let baseClass = 'btn';
  if (variant === 'rose') baseClass += ' rose';
  if (variant === 'ghost') baseClass += ' ghost';
  if (variant === 'light') baseClass += ' light';
  if (size === 'sm') baseClass += ' sm';

  const fullClassName = `${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;

  if (to) {
    return (
      <Link to={to} className={fullClassName} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={fullClassName} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={fullClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

