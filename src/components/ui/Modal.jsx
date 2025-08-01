import React from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../utils';
import Button from './Button';

/**
 * 通用模态框组件
 * 支持自定义大小、位置和动画
 */
const Modal = ({
  isOpen = false,
  onClose,
  children,
  className,
  overlayClassName,
  size = 'md',
  centered = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  title,
  footer,
  ...props
}) => {
  const modalRef = React.useRef(null);
  
  // 处理 ESC 键关闭
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  // 处理 body 滚动锁定
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // 处理点击遮罩层关闭
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  const modalClasses = cn(
    'modal',
    sizeClasses[size],
    className
  );
  
  const overlayClasses = cn(
    'modal-overlay',
    {
      'items-center': centered,
      'items-start pt-20': !centered
    },
    overlayClassName
  );
  
  if (!isOpen) return null;
  
  const modalContent = (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div 
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 className="modal-title">{title}</h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                icon
                className="modal-close"
                onClick={onClose}
                aria-label="关闭"
              >
                ✕
              </Button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  // 使用 Portal 渲染到 body
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

/**
 * 模态框头部组件
 */
const ModalHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('modal-header', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * 模态框主体组件
 */
const ModalBody = ({ children, className, ...props }) => {
  return (
    <div className={cn('modal-body', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * 模态框底部组件
 */
const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn('modal-footer', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * 确认对话框组件
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  message = '您确定要执行此操作吗？',
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'primary',
  loading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      onClose?.();
    } catch (error) {
      console.error('确认操作失败:', error);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <div className="text-center py-4">
        <p className="text-lg mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// 导出所有组件
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirm = ConfirmModal;

export default Modal;
export {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmModal
};