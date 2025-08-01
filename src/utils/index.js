/**
 * 工具函数统一导出文件
 */

import { STORAGE_KEYS } from '@constants';

// 导出存储相关工具
export * from './storage';

// 导出验证相关工具
export * from './validation';

/**
 * 类名组合工具函数
 * 用于条件性地组合CSS类名
 */
export const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
};

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式类型
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'default') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'relative':
      if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor(diff / (1000 * 60));
          return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
      } else if (days === 1) {
        return '昨天';
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return dateObj.toLocaleDateString('zh-CN');
      }
      
    case 'time':
      return dateObj.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      
    case 'datetime':
      return dateObj.toLocaleString('zh-CN');
      
    case 'short':
      return dateObj.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      });
      
    default:
      return dateObj.toLocaleDateString('zh-CN');
  }
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化数字
 * @param {number} num - 数字
 * @param {string} type - 格式类型
 * @returns {string} 格式化后的数字字符串
 */
export const formatNumber = (num, type = 'default') => {
  if (num === undefined || num === null) return '0';
  
  switch (type) {
    case 'compact':
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
      
    case 'percentage':
      return (num * 100).toFixed(1) + '%';
      
    case 'currency':
      return '¥' + num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
    default:
      return num.toLocaleString('zh-CN');
  }
};

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + suffix;
};

/**
 * 计算阅读时间
 * @param {string} text - 文本内容
 * @param {number} wordsPerMinute - 每分钟阅读字数
 * @returns {number} 阅读时间（分钟）
 */
export const calculateReadingTime = (text, wordsPerMinute = 300) => {
  if (!text) return 0;
  const wordCount = text.length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * 检查对象是否为空
 * @param {*} obj - 要检查的对象
 * @returns {boolean} 是否为空
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 设置存储项
   * @param {string} key - 键名
   * @param {*} value - 值
   */
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  /**
   * 获取存储项
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  /**
   * 移除存储项
   * @param {string} key - 键名
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  /**
   * 清空所有存储
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
  
  /**
   * 检查是否支持本地存储
   * @returns {boolean} 是否支持
   */
  isSupported: () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * 用户偏好设置工具
 */
export const preferences = {
  /**
   * 获取主题设置
   * @returns {string} 主题名称
   */
  getTheme: () => {
    return storage.get(STORAGE_KEYS.THEME, 'light');
  },
  
  /**
   * 设置主题
   * @param {string} theme - 主题名称
   */
  setTheme: (theme) => {
    storage.set(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  
  /**
   * 获取字体大小设置
   * @returns {string} 字体大小
   */
  getFontSize: () => {
    return storage.get(STORAGE_KEYS.FONT_SIZE, 'medium');
  },
  
  /**
   * 设置字体大小
   * @param {string} fontSize - 字体大小
   */
  setFontSize: (fontSize) => {
    storage.set(STORAGE_KEYS.FONT_SIZE, fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  },
  
  /**
   * 获取阅读偏好
   * @returns {Object} 阅读偏好设置
   */
  getReadingPreferences: () => {
    return storage.get(STORAGE_KEYS.READING_PREFERENCES, {
      autoScroll: false,
      nightMode: false,
      fontSize: 'medium',
      lineHeight: 'normal',
    });
  },
  
  /**
   * 设置阅读偏好
   * @param {Object} preferences - 阅读偏好设置
   */
  setReadingPreferences: (preferences) => {
    const current = storage.get(STORAGE_KEYS.READING_PREFERENCES, {});
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.READING_PREFERENCES, updated);
  },
};

/**
 * URL工具
 */
export const urlUtils = {
  /**
   * 获取URL参数
   * @param {string} name - 参数名
   * @param {string} url - URL字符串
   * @returns {string|null} 参数值
   */
  getParam: (name, url = window.location.href) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(name);
  },
  
  /**
   * 设置URL参数
   * @param {string} name - 参数名
   * @param {string} value - 参数值
   * @param {boolean} replace - 是否替换当前历史记录
   */
  setParam: (name, value, replace = false) => {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    
    if (replace) {
      window.history.replaceState({}, '', url.toString());
    } else {
      window.history.pushState({}, '', url.toString());
    }
  },
  
  /**
   * 移除URL参数
   * @param {string} name - 参数名
   * @param {boolean} replace - 是否替换当前历史记录
   */
  removeParam: (name, replace = false) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    
    if (replace) {
      window.history.replaceState({}, '', url.toString());
    } else {
      window.history.pushState({}, '', url.toString());
    }
  },
};

/**
 * 验证工具
 */
export const validators = {
  /**
   * 验证邮箱
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * 验证用户名
   * @param {string} username - 用户名
   * @returns {boolean} 是否有效
   */
  username: (username) => {
    if (!username || username.length < 3 || username.length > 20) {
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username);
  },
  
  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {Object} 验证结果
   */
  password: (password) => {
    const result = {
      isValid: false,
      strength: 'weak',
      issues: [],
    };
    
    if (!password) {
      result.issues.push('密码不能为空');
      return result;
    }
    
    if (password.length < 8) {
      result.issues.push('密码长度至少8位');
    }
    
    if (!/[a-z]/.test(password)) {
      result.issues.push('密码需包含小写字母');
    }
    
    if (!/[A-Z]/.test(password)) {
      result.issues.push('密码需包含大写字母');
    }
    
    if (!/\d/.test(password)) {
      result.issues.push('密码需包含数字');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.issues.push('密码需包含特殊字符');
    }
    
    // 计算强度
    const score = 5 - result.issues.length;
    if (score >= 4) {
      result.strength = 'strong';
      result.isValid = true;
    } else if (score >= 2) {
      result.strength = 'medium';
      result.isValid = password.length >= 8;
    } else {
      result.strength = 'weak';
      result.isValid = false;
    }
    
    return result;
  },
};

/**
 * 错误处理工具
 */
export const errorUtils = {
  /**
   * 格式化错误消息
   * @param {Error|string|Object} error - 错误对象
   * @returns {string} 格式化后的错误消息
   */
  formatMessage: (error) => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return '发生未知错误';
  },
  
  /**
   * 记录错误
   * @param {Error|string|Object} error - 错误对象
   * @param {string} context - 错误上下文
   */
  log: (error, context = '') => {
    const message = errorUtils.formatMessage(error);
    const timestamp = new Date().toISOString();
    
    console.error(`[${timestamp}] ${context}: ${message}`, error);
    
    // 在生产环境中，可以发送错误到监控服务
    if (import.meta.env.PROD) {
      // TODO: 发送错误到监控服务
    }
  },
};