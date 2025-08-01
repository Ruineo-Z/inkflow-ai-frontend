import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardBody, CardTitle } from '../components/ui';
import { validatePassword } from '../utils';

/**
 * 登录页面组件
 */
const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取重定向路径
  const from = location.state?.from?.pathname || '/dashboard';
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // 错误状态
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // 清除提交错误
    if (submitError) {
      setSubmitError('');
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    // 验证用户名
    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名长度至少为3位';
    }
    
    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '密码长度至少为6位';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setSubmitError(result.error?.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      setSubmitError(error.message || '登录失败，请检查用户名和密码');
    }
  };
  
  return (
    <div className="app-container">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            InkFlow AI
          </h1>
          <p className="text-gray-600">登录到你的账户</p>
        </div>
        
        <Card className="simple-card">
          <CardBody className="p-6">
            
            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 全局错误提示 */}
              {submitError && (
                <div className="bg-red-500/20 border border-red-400 text-red-400 px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}
              
              {/* 用户名输入 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  用户名
                </label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="请输入您的用户名"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  className={`glass border-white/30 text-white placeholder-white/50 focus:border-white/60 ${errors.username ? 'border-red-400' : ''}`}
                  required
                  autoComplete="username"
                />
                {errors.username && (
                  <div className="text-red-400 text-sm mt-1">{errors.username}</div>
                )}
              </div>
              
              {/* 密码输入 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="请输入您的密码"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className={`glass border-white/30 text-white placeholder-white/50 focus:border-white/60 ${errors.password ? 'border-red-400' : ''}`}
                  required
                  autoComplete="current-password"
                />
                {errors.password && (
                  <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                )}
              </div>
              
              {/* 忘记密码链接 */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  忘记密码？
                </Link>
              </div>
              
              {/* 提交按钮 */}
              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
            
            {/* 注册链接 */}
            <div className="mt-6 text-center">
              <p className="text-white/60">
                还没有账户？
                <Link to="/register" className="text-blue-400 hover:text-blue-300 underline ml-1 transition-colors">
                  立即注册
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;