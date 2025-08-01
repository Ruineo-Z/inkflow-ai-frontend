import React from 'react';
import { cn } from '../../utils';

/**
 * 通用卡片组件
 * 支持头部、主体、底部等区域
 */
const Card = React.forwardRef((
  {
    children,
    className,
    hover = false,
    ...props
  },
  ref
) => {
  const cardClasses = cn(
    'card',
    {
      'hover:shadow-lg': hover
    },
    className
  );
  
  return (
    <div ref={ref} className={cardClasses} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * 卡片头部组件
 */
const CardHeader = React.forwardRef((
  {
    children,
    className,
    ...props
  },
  ref
) => {
  return (
    <div ref={ref} className={cn('card-header', className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

/**
 * 卡片主体组件
 */
const CardBody = React.forwardRef((
  {
    children,
    className,
    ...props
  },
  ref
) => {
  return (
    <div ref={ref} className={cn('card-body', className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

/**
 * 卡片底部组件
 */
const CardFooter = React.forwardRef((
  {
    children,
    className,
    ...props
  },
  ref
) => {
  return (
    <div ref={ref} className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

/**
 * 卡片标题组件
 */
const CardTitle = React.forwardRef((
  {
    children,
    className,
    as: Component = 'h3',
    ...props
  },
  ref
) => {
  return (
    <Component ref={ref} className={cn('card-title', className)} {...props}>
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

/**
 * 卡片副标题组件
 */
const CardSubtitle = React.forwardRef((
  {
    children,
    className,
    as: Component = 'p',
    ...props
  },
  ref
) => {
  return (
    <Component ref={ref} className={cn('card-subtitle', className)} {...props}>
      {children}
    </Component>
  );
});

CardSubtitle.displayName = 'CardSubtitle';

/**
 * 卡片文本组件
 */
const CardText = React.forwardRef((
  {
    children,
    className,
    as: Component = 'p',
    ...props
  },
  ref
) => {
  return (
    <Component ref={ref} className={cn('card-text', className)} {...props}>
      {children}
    </Component>
  );
});

CardText.displayName = 'CardText';

// 导出所有组件
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Text = CardText;

export default Card;
export {
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardSubtitle,
  CardText
};