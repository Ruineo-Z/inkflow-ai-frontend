import React from 'react';
import { cn } from '../../utils';

/**
 * 通用输入框组件
 * 支持多种类型、状态和验证
 */
const Input = React.forwardRef((
  {
    className,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    readOnly = false,
    error = false,
    errorMessage,
    label,
    required = false,
    helpText,
    id,
    name,
    autoComplete,
    autoFocus = false,
    maxLength,
    minLength,
    pattern,
    ...props
  },
  ref
) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = cn(
    'form-input',
    {
      'error': error
    },
    className
  );
  
  return (
    <div className="form-group">
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn('form-label', { 'required': required })}
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        {...props}
      />
      
      {error && errorMessage && (
        <div className="form-error">
          {errorMessage}
        </div>
      )}
      
      {helpText && !error && (
        <div className="form-help">
          {helpText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;