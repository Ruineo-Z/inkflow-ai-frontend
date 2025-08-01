import React from 'react';
import { cn } from '../../utils';

/**
 * 通用选择框组件
 * 支持单选、多选、搜索等功能
 */
const Select = React.forwardRef((
  {
    className,
    options = [],
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    error = false,
    errorMessage,
    label,
    required = false,
    helpText,
    id,
    name,
    placeholder = '请选择...',
    multiple = false,
    searchable = false,
    clearable = false,
    loading = false,
    ...props
  },
  ref
) => {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredOptions, setFilteredOptions] = React.useState(options);
  const selectRef = React.useRef(null);
  
  // 处理选项过滤
  React.useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [options, searchTerm, searchable]);
  
  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectClasses = cn(
    'form-input',
    'form-select',
    {
      'error': error
    },
    className
  );
  
  const getSelectedOption = () => {
    if (multiple) {
      return options.filter(option => value?.includes(option.value));
    }
    return options.find(option => option.value === value);
  };
  
  const getDisplayValue = () => {
    const selected = getSelectedOption();
    if (multiple) {
      return selected?.length > 0 
        ? `已选择 ${selected.length} 项`
        : placeholder;
    }
    return selected?.label || placeholder;
  };
  
  const handleOptionClick = (option) => {
    let newValue;
    
    if (multiple) {
      const currentValues = value || [];
      if (currentValues.includes(option.value)) {
        newValue = currentValues.filter(v => v !== option.value);
      } else {
        newValue = [...currentValues, option.value];
      }
    } else {
      newValue = option.value;
      setIsOpen(false);
    }
    
    onChange?.({
      target: {
        name,
        value: newValue
      }
    });
    
    setSearchTerm('');
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.({
      target: {
        name,
        value: multiple ? [] : ''
      }
    });
  };
  
  const hasValue = multiple ? value?.length > 0 : value;
  
  // 如果不是自定义下拉菜单，使用原生 select
  if (!searchable && !multiple && !clearable) {
    return (
      <div className="form-group">
        {label && (
          <label 
            htmlFor={selectId} 
            className={cn('form-label', { 'required': required })}
          >
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={selectClasses}
          value={value || ''}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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
  }
  
  // 自定义下拉菜单
  return (
    <div className="form-group">
      {label && (
        <label 
          htmlFor={selectId} 
          className={cn('form-label', { 'required': required })}
        >
          {label}
        </label>
      )}
      
      <div className="dropdown" ref={selectRef}>
        <div
          className={cn(
            selectClasses,
            'cursor-pointer',
            'flex',
            'items-center',
            'justify-between'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={cn(
            'flex-1',
            'truncate',
            { 'text-tertiary': !hasValue }
          )}>
            {getDisplayValue()}
          </span>
          
          <div className="flex items-center gap-1">
            {clearable && hasValue && (
              <button
                type="button"
                className="text-tertiary hover:text-primary transition-fast"
                onClick={handleClear}
              >
                ✕
              </button>
            )}
            
            <span className={cn(
              'text-tertiary transition-fast',
              { 'rotate-180': isOpen }
            )}>
              ▼
            </span>
          </div>
        </div>
        
        {isOpen && (
          <div className="dropdown-menu">
            {searchable && (
              <div className="p-2">
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="搜索选项..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            
            {loading ? (
              <div className="dropdown-item text-center">
                <div className="spinner spinner-sm"></div>
                <span className="ml-2">加载中...</span>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = multiple 
                  ? value?.includes(option.value)
                  : value === option.value;
                  
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      'dropdown-item',
                      'w-full',
                      'text-left',
                      'flex',
                      'items-center',
                      'justify-between',
                      { 'active': isSelected }
                    )}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="text-primary">✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="dropdown-item text-tertiary text-center">
                {searchTerm ? '未找到匹配选项' : '暂无选项'}
              </div>
            )}
          </div>
        )}
      </div>
      
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

Select.displayName = 'Select';

export default Select;