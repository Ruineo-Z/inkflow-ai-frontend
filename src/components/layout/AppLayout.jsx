import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

/**
 * 应用主布局组件
 * 包含头部、侧边栏、主内容区域和底部
 */
const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="app-layout">
      {/* 头部导航 */}
      <Header 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="app-main">
        {/* 侧边栏 - 仅在用户登录时显示 */}
        {user && (
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}
        
        {/* 主内容区域 */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      
      {/* 底部已移除 */}
    </div>
  );
};

export default AppLayout;