import React from 'react';
import { cn } from '../../utils';

/**
 * 通用文本域组件
 * 支持自动调整高度、字符计数等功能
 */
const Textarea = React.forwardRef((
  {
    className,
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
    autoFocus = false,
    maxLength,
    minLength,
    rows = 4,
    cols,
    resize = 'vertical',
    autoResize = false,
    showCharCount = false,
    ...props
  },
  ref
) => {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const [currentLength, setCurrentLength] = React.useState(
    value?.length || defaultValue?.length || 0
  );
  
  const textareaClasses = cn(
    'form-input',
    'form-textarea',
    {
      'error': error,
      'resize-none': resize === 'none',
      'resize-x': resize === 'horizontal',
      'resize-y': resize === 'vertical',
      'resize': resize === 'both'
    },
    className
  );
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentLength(newValue.length);
    
    // 自动调整高度
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    
    onChange?.(e);
  };
  
  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentLength(value.length);
    }
  }, [value]);
  
  const isOverLimit = maxLength && currentLength > maxLength;
  
  return (
    <div className="form-group">
      {label && (
        <label 
          htmlFor={textareaId} 
          className={cn('form-label', { 'required': required })}
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        cols={cols}
        {...props}
      />
      
      {showCharCount && maxLength && (
        <div className={cn(
          'form-help',
          'text-right',
          { 'text-error': isOverLimit }
        )}>
          {currentLength}/{maxLength}
        </div>
      )}
      
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

Textarea.displayName = 'Textarea';

export default Textarea;