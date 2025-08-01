import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * 侧边栏导航组件
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // 导航菜单项
  const menuItems = [
    {
      path: '/dashboard',
      label: '仪表盘',
      icon: '📊'
    },
    {
      path: '/my-stories',
      label: '我的故事',
      icon: '📚'
    },
    {
      path: '/create-story',
      label: '创建故事',
      icon: '✍️'
    },
    {
      path: '/explore',
      label: '探索故事',
      icon: '🔍'
    },
    {
      path: '/favorites',
      label: '收藏夹',
      icon: '❤️'
    },
    {
      path: '/reading-history',
      label: '阅读历史',
      icon: '📖'
    },
    {
      path: '/profile',
      label: '个人资料',
      icon: '👤'
    },
    {
      path: '/settings',
      label: '设置',
      icon: '⚙️'
    }
  ];
  
  // 检查当前路径是否激活
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // 处理链接点击
  const handleLinkClick = () => {
    // 在移动端点击链接后关闭侧边栏
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      {/* 遮罩层 - 移动端 */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* 用户信息 */}
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          
          {/* 导航菜单 */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      isActive(item.path) ? 'active' : ''
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* 底部信息 */}
          <div className="sidebar-footer">
            <div className="app-version">
              InkFlow AI v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;