import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageSpinner } from '../components/ui';
import { LOADING_STATES } from '../constants';

/**
 * 受保护的路由组件
 * 需要用户登录才能访问
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // 如果正在加载认证状态，显示加载器
  if (isLoading) {
    return <PageSpinner />;
  }
  
  // 如果用户未登录，重定向到登录页面
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  // 用户已登录，渲染子组件
  return children;
};

export default ProtectedRoute;