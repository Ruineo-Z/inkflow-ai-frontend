import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';

/**
 * 应用头部导航组件
 */
const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="app-header">
      <div className="header-container">
        {/* 左侧区域：菜单按钮和Logo */}
        <div className="header-left">
          {user && (
            <button 
              className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
          
          <Link to="/" className="logo">
            <span className="logo-text">InkFlow AI</span>
          </Link>
        </div>
        
        {/* 中间区域：导航链接 */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/explore" className="nav-link">探索</Link>
          {user && (
            <Link to="/my-stories" className="nav-link">我的故事</Link>
          )}
          <Link to="/about" className="nav-link">关于</Link>
        </nav>
        
        {/* 右侧区域：用户菜单/登录按钮 */}
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user.username}</span>
              </div>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">个人资料</Link>
                <Link to="/settings" className="dropdown-item">设置</Link>
                <button onClick={handleLogout} className="dropdown-item">登出</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigate('/register')}
              >
                注册
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;