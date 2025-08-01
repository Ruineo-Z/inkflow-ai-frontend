import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageSpinner } from '../components/ui';
import { LOADING_STATES } from '../constants';

/**
 * 公共路由组件
 * 已登录用户访问时会重定向到仪表盘
 * 主要用于登录、注册等页面
 */
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // 如果正在加载认证状态，显示加载器
  if (isLoading) {
    return <PageSpinner />;
  }
  
  // 如果用户已登录，重定向到指定页面
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // 用户未登录，渲染子组件
  return children;
};

export default PublicRoute;