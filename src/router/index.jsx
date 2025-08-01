import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { Home, Login, Register, Dashboard, CreateStory } from '../pages';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

/**
 * 应用路由配置
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'create-story',
        element: (
          <ProtectedRoute>
            <CreateStory />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-stories',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>我的故事</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'explore',
        element: (
          <div className="page">
            <h1>探索故事</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'story/:id',
        element: (
          <div className="page">
            <h1>故事详情</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'story/:id/edit',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>编辑故事</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'story/:id/read',
        element: (
          <div className="page">
            <h1>阅读故事</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>个人资料</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>设置</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>收藏夹</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'reading-history',
        element: (
          <ProtectedRoute>
            <div className="page">
              <h1>阅读历史</h1>
              <p>此页面正在开发中...</p>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: 'about',
        element: (
          <div className="page">
            <h1>关于我们</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'help',
        element: (
          <div className="page">
            <h1>帮助中心</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'faq',
        element: (
          <div className="page">
            <h1>常见问题</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'contact',
        element: (
          <div className="page">
            <h1>联系我们</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'feedback',
        element: (
          <div className="page">
            <h1>意见反馈</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'privacy',
        element: (
          <div className="page">
            <h1>隐私政策</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'terms',
        element: (
          <div className="page">
            <h1>服务条款</h1>
            <p>此页面正在开发中...</p>
          </div>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <div className="page">
              <h1>忘记密码</h1>
              <p>此页面正在开发中...</p>
            </div>
          </PublicRoute>
        )
      },
      // 404 页面
      {
        path: '*',
        element: (
          <div className="page">
            <div className="error-page">
              <h1>404</h1>
              <p>页面未找到</p>
              <a href="/">返回首页</a>
            </div>
          </div>
        )
      }
    ]
  }
]);

export default router;