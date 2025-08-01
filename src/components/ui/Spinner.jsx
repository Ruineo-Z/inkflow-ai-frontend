import React from 'react';
import { cn } from '../../utils';

/**
 * 通用加载器组件
 * 支持多种尺寸和样式
 */
const Spinner = ({
  size = 'md',
  className,
  color = 'primary',
  ...props
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg'
  };
  
  const colorClasses = {
    primary: 'border-t-primary',
    secondary: 'border-t-secondary',
    success: 'border-t-success',
    warning: 'border-t-warning',
    error: 'border-t-error',
    white: 'border-t-white'
  };
  
  const spinnerClasses = cn(
    'spinner',
    sizeClasses[size],
    colorClasses[color],
    className
  );
  
  return (
    <div className={spinnerClasses} {...props} />
  );
};

/**
 * 带文本的加载器组件
 */
const SpinnerWithText = ({
  text = '加载中...',
  size = 'md',
  className,
  textClassName,
  direction = 'vertical',
  ...props
}) => {
  const containerClasses = cn(
    'flex',
    'items-center',
    {
      'flex-col gap-3': direction === 'vertical',
      'flex-row gap-2': direction === 'horizontal'
    },
    className
  );
  
  return (
    <div className={containerClasses} {...props}>
      <Spinner size={size} />
      <span className={cn('text-secondary', textClassName)}>
        {text}
      </span>
    </div>
  );
};

/**
 * 页面级加载器组件
 */
const PageSpinner = ({
  text = '页面加载中...',
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-screen',
        'gap-4',
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
      <p className="text-lg text-secondary">{text}</p>
    </div>
  );
};

/**
 * 覆盖层加载器组件
 */
const OverlaySpinner = ({
  isVisible = false,
  text = '处理中...',
  className,
  overlayClassName,
  ...props
}) => {
  if (!isVisible) return null;
  
  return (
    <div 
      className={cn(
        'fixed',
        'inset-0',
        'bg-overlay',
        'flex',
        'items-center',
        'justify-center',
        'z-modal',
        overlayClassName
      )}
    >
      <div 
        className={cn(
          'bg-primary',
          'rounded-lg',
          'p-6',
          'shadow-xl',
          'flex',
          'flex-col',
          'items-center',
          'gap-4',
          className
        )}
        {...props}
      >
        <Spinner size="lg" color="white" />
        <p className="text-white text-lg">{text}</p>
      </div>
    </div>
  );
};

/**
 * 内联加载器组件
 */
const InlineSpinner = ({
  text,
  size = 'sm',
  className,
  ...props
}) => {
  return (
    <span 
      className={cn(
        'inline-flex',
        'items-center',
        'gap-2',
        className
      )}
      {...props}
    >
      <Spinner size={size} />
      {text && <span className="text-secondary">{text}</span>}
    </span>
  );
};

/**
 * 脉冲加载器组件（用于骨架屏）
 */
const PulseLoader = ({
  className,
  width = '100%',
  height = '1rem',
  ...props
}) => {
  return (
    <div 
      className={cn(
        'animate-pulse',
        'bg-secondary',
        'rounded',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

/**
 * 点状加载器组件
 */
const DotsLoader = ({
  size = 'md',
  className,
  color = 'primary',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error'
  };
  
  const dotClasses = cn(
    'rounded-full',
    sizeClasses[size],
    colorClasses[color]
  );
  
  return (
    <div 
      className={cn(
        'flex',
        'items-center',
        'gap-1',
        className
      )}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            dotClasses,
            'animate-pulse'
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// 导出所有组件
Spinner.WithText = SpinnerWithText;
Spinner.Page = PageSpinner;
Spinner.Overlay = OverlaySpinner;
Spinner.Inline = InlineSpinner;
Spinner.Pulse = PulseLoader;
Spinner.Dots = DotsLoader;

export default Spinner;
export {
  SpinnerWithText,
  PageSpinner,
  OverlaySpinner,
  InlineSpinner,
  PulseLoader,
  DotsLoader
};