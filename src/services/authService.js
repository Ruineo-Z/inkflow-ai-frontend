/**
 * 用户认证服务
 * 包含登录、注册、用户信息获取等认证相关功能
 */

import { apiPost, apiGet, setAuthToken, clearAuth } from './api.js';
import { API_ENDPOINTS, STORAGE_KEYS, API_CONFIG } from '@constants';

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @returns {Promise<Object>} 注册结果
 */
export const register = async (userData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.success && response.data) {
      const { token, user } = response.data;
      
      // 保存认证信息
      if (token) {
        setAuthToken(token);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      }
      
      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    }
    
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: {
        type: 'REGISTER_ERROR',
        message: error.message || '注册失败，请重试',
      },
    };
  }
};

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Login attempt:', {
      url: API_ENDPOINTS.AUTH.LOGIN,
      credentials: { ...credentials, password: '[HIDDEN]' },
      baseURL: API_CONFIG.BASE_URL
    });
    
    const response = await apiPost(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    console.log('🔐 Login response:', response);
    
    if (response.success && response.data) {
      const { token, user } = response.data;
      
      // 保存认证信息
      if (token) {
        setAuthToken(token);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      }
      
      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: {
        type: 'LOGIN_ERROR',
        message: error.message || '登录失败，请检查用户名和密码',
      },
    };
  }
};

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiGet(API_ENDPOINTS.AUTH.USER_INFO);
    
    if (response.success && response.data) {
      const { user } = response.data;
      
      // 更新本地存储的用户信息
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      
      return {
        success: true,
        data: user,
      };
    }
    
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: {
        type: 'GET_USER_ERROR',
        message: error.message || '获取用户信息失败',
      },
    };
  }
};

/**
 * 用户登出
 * @returns {Promise<Object>} 登出结果
 */
export const logout = async () => {
  try {
    // 清除本地认证信息
    clearAuth();
    
    return {
      success: true,
      message: '登出成功',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: {
        type: 'LOGOUT_ERROR',
        message: error.message || '登出失败',
      },
    };
  }
};

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * 获取本地存储的用户信息
 * @returns {Object|null} 用户信息
 */
export const getStoredUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Parse stored user info error:', error);
    return null;
  }
};

/**
 * 验证用户名格式
 * @param {string} username - 用户名
 * @returns {Object} 验证结果
 */
export const validateUsername = (username) => {
  if (!username) {
    return {
      valid: false,
      message: '用户名不能为空',
    };
  }
  
  if (username.length < 3) {
    return {
      valid: false,
      message: '用户名至少需要3个字符',
    };
  }
  
  if (username.length > 20) {
    return {
      valid: false,
      message: '用户名不能超过20个字符',
    };
  }
  
  // 只允许字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: '用户名只能包含字母、数字和下划线',
    };
  }
  
  return {
    valid: true,
    message: '用户名格式正确',
  };
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {Object} 验证结果
 */
export const validateEmail = (email) => {
  if (!email) {
    return {
      valid: false,
      message: '邮箱不能为空',
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: '邮箱格式不正确',
    };
  }
  
  return {
    valid: true,
    message: '邮箱格式正确',
  };
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      message: '密码不能为空',
      strength: 'none',
    };
  }
  
  if (password.length < 6) {
    return {
      valid: false,
      message: '密码至少需要6个字符',
      strength: 'weak',
    };
  }
  
  if (password.length > 50) {
    return {
      valid: false,
      message: '密码不能超过50个字符',
      strength: 'weak',
    };
  }
  
  // 计算密码强度
  let strength = 'weak';
  let score = 0;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score++;
  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;
  // 包含数字
  if (/\d/.test(password)) score++;
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  // 长度大于8
  if (password.length >= 8) score++;
  
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }
  
  return {
    valid: true,
    message: '密码格式正确',
    strength,
    score,
  };
};

/**
 * 验证确认密码
 * @param {string} password - 原密码
 * @param {string} confirmPassword - 确认密码
 * @returns {Object} 验证结果
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return {
      valid: false,
      message: '请确认密码',
    };
  }
  
  if (password !== confirmPassword) {
    return {
      valid: false,
      message: '两次输入的密码不一致',
    };
  }
  
  return {
    valid: true,
    message: '密码确认正确',
  };
};

/**
 * 验证注册表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateRegisterForm = (formData) => {
  const { username, email, password, confirmPassword } = formData;
  
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return usernameValidation;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
  if (!confirmPasswordValidation.valid) {
    return confirmPasswordValidation;
  }
  
  return {
    valid: true,
    message: '表单验证通过',
  };
};

/**
 * 验证登录表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateLoginForm = (formData) => {
  const { username, password } = formData;
  
  if (!username) {
    return {
      valid: false,
      message: '请输入用户名',
    };
  }
  
  if (!password) {
    return {
      valid: false,
      message: '请输入密码',
    };
  }
  
  return {
    valid: true,
    message: '表单验证通过',
  };
};