import React from 'react';

/**
 * Button - Component nút bấm tái sử dụng
 * @param {string} variant - 'primary' | 'outline' | 'danger' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  id,
  style = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '13px 28px', fontSize: '16px' },
  };

  const variants = {
    primary: { backgroundColor: 'var(--primary, #326e51)', color: '#fff' },
    outline: { backgroundColor: 'transparent', color: 'var(--primary, #326e51)', border: '2px solid var(--primary, #326e51)' },
    danger: { backgroundColor: '#ee4d2d', color: '#fff' },
    ghost: { backgroundColor: 'transparent', color: '#555', border: '1px solid #ddd' },
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

export default Button;
