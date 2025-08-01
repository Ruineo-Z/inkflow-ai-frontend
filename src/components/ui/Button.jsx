import React from 'react';
import { cn } from '../../utils';

/**
 * 通用按钮组件
 * 支持多种样式变体、尺寸和状态
 */
const Button = React.forwardRef((
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon = false,
    type = 'button',
    onClick,
    ...props
  },
  ref
) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  const iconClasses = icon ? 'btn-icon' : '';
  const loadingClasses = loading ? 'btn-loading' : '';
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    iconClasses,
    loadingClasses,
    className
  );
  
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;