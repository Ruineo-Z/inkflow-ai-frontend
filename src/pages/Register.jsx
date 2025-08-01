import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardBody, CardTitle } from '../components/ui';
import { validateEmail, validateUsername, validatePassword } from '../utils';

/**
 * 注册页面组件
 */
const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // 错误状态
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  // 同意条款状态
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
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
    } else if (!validateUsername(formData.username)) {
      newErrors.username = '用户名长度为3-20位，只能包含字母、数字和下划线';
    }
    
    // 验证邮箱
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '密码长度至少为6位，建议包含字母和数字';
    }
    
    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    // 验证同意条款
    if (!agreedToTerms) {
      newErrors.terms = '请阅读并同意服务条款和隐私政策';
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
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || '注册失败，请稍后重试');
    }
  };
  
  return (
    <div className="app-container">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            InkFlow AI
          </h1>
          <p className="text-gray-600">创建你的账户</p>
        </div>
        
        <Card className="simple-card">
          <CardBody className="p-6">
            
            {/* 注册表单 */}
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
                  placeholder="请输入用户名"
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
                <div className="text-white/60 text-xs mt-1">3-20位字符，只能包含字母、数字和下划线</div>
              </div>
              
              {/* 邮箱输入 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="请输入您的邮箱地址"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className={`glass border-white/30 text-white placeholder-white/50 focus:border-white/60 ${errors.email ? 'border-red-400' : ''}`}
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                )}
                <div className="text-white/60 text-xs mt-1">用于账户验证和重要通知</div>
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
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className={`glass border-white/30 text-white placeholder-white/50 focus:border-white/60 ${errors.password ? 'border-red-400' : ''}`}
                  required
                  autoComplete="new-password"
                />
                {errors.password && (
                  <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                )}
                <div className="text-white/60 text-xs mt-1">至少6位字符，建议包含字母和数字</div>
              </div>
              
              {/* 确认密码输入 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  确认密码
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  className={`glass border-white/30 text-white placeholder-white/50 focus:border-white/60 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  required
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <div className="text-red-400 text-sm mt-1">{errors.confirmPassword}</div>
                )}
              </div>
              
              {/* 同意条款 */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-transparent border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white/80 text-sm">
                    我已阅读并同意
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline mx-1">服务条款</Link>
                    和
                    <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline ml-1">隐私政策</Link>
                  </span>
                </label>
                {errors.terms && (
                  <div className="text-red-400 text-sm mt-1">{errors.terms}</div>
                )}
              </div>
              
              {/* 提交按钮 */}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '注册中...' : '创建账户'}
              </Button>
            </form>
            
            {/* 登录链接 */}
            <div className="mt-6 text-center">
              <p className="text-white/60">
                已有账户？
                <Link to="/login" className="text-blue-400 hover:text-blue-300 underline ml-1 transition-colors">
                  立即登录
                </Link>
              </p>
            </div>
            
            {/* 社交注册 */}
            <div className="social-login">
              <div className="divider">
                <span>或</span>
              </div>
              <div className="social-buttons">
                <Button
                  variant="outline"
                  size="lg"
                  className="social-button"
                  disabled
                >
                  <span className="social-icon">🐙</span>
                  GitHub注册
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="social-button"
                  disabled
                >
                  <span className="social-icon">🔍</span>
                  Google注册
                </Button>
              </div>
              <p className="social-note">
                社交登录功能即将上线
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Register;