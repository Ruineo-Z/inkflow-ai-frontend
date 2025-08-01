/**
 * API 服务基础配置
 * 包含axios实例配置、请求拦截器、响应拦截器等
 */

import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS, ERROR_MESSAGES } from '@constants';

/**
 * 创建axios实例
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取存储的认证token
 */
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * 设置认证token
 */
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

/**
 * 清除认证信息
 */
const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

/**
 * 请求拦截器 - 自动添加认证token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 开发环境下打印请求信息
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
apiClient.interceptors.response.use(
  (response) => {
    // 开发环境下打印响应信息
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // 处理网络错误
    if (!error.response) {
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        type: 'NETWORK_ERROR',
        originalError: error,
      });
    }
    
    const { status, data } = error.response;
    
    // 处理不同的HTTP状态码
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // 401 - 未授权，清除本地认证信息并跳转到登录页
        clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          type: 'UNAUTHORIZED',
          status,
          data,
        });
        
      case HTTP_STATUS.FORBIDDEN:
        return Promise.reject({
          message: ERROR_MESSAGES.FORBIDDEN,
          type: 'FORBIDDEN',
          status,
          data,
        });
        
      case HTTP_STATUS.NOT_FOUND:
        return Promise.reject({
          message: ERROR_MESSAGES.NOT_FOUND,
          type: 'NOT_FOUND',
          status,
          data,
        });
        
      case HTTP_STATUS.BAD_REQUEST:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          type: 'VALIDATION_ERROR',
          status,
          data,
        });
        
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return Promise.reject({
          message: ERROR_MESSAGES.SERVER_ERROR,
          type: 'SERVER_ERROR',
          status,
          data,
        });
        
      default:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          type: 'UNKNOWN_ERROR',
          status,
          data,
        });
    }
  }
);

/**
 * API错误处理工具函数
 */
export const handleAPIError = (error) => {
  // 如果是我们自定义的错误格式
  if (error.type && error.message) {
    return {
      success: false,
      error: {
        type: error.type,
        message: error.message,
        status: error.status,
        data: error.data,
      },
    };
  }
  
  // 处理其他类型的错误
  return {
    success: false,
    error: {
      type: 'UNKNOWN_ERROR',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      originalError: error,
    },
  };
};

/**
 * 通用API请求方法
 */
export const apiRequest = async (config) => {
  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * GET请求
 */
export const apiGet = async (url, params = {}) => {
  return apiRequest({
    method: 'GET',
    url,
    params,
  });
};

/**
 * POST请求
 */
export const apiPost = async (url, data = {}) => {
  return apiRequest({
    method: 'POST',
    url,
    data,
  });
};

/**
 * PUT请求
 */
export const apiPut = async (url, data = {}) => {
  return apiRequest({
    method: 'PUT',
    url,
    data,
  });
};

/**
 * DELETE请求
 */
export const apiDelete = async (url) => {
  return apiRequest({
    method: 'DELETE',
    url,
  });
};

/**
 * 文件上传请求
 */
export const apiUpload = async (url, formData) => {
  return apiRequest({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Server-Sent Events 连接
 */
export const createSSEConnection = (url, options = {}) => {
  const token = getAuthToken();
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;
  
  // 如果有token，添加到URL参数中（因为SSE无法设置headers）
  const urlWithAuth = token 
    ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
    : fullUrl;
  
  return new EventSource(urlWithAuth, options);
};

// 导出认证相关工具函数
export { getAuthToken, setAuthToken, clearAuth };

// 导出axios实例（用于特殊情况下的直接使用）
export { apiClient };

// 认证相关API
export const authAPI = {
  // 登录
  login: async (credentials) => {
    try {
      const response = await apiPost('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '登录失败',
      };
    }
  },

  // 注册
  register: async (userData) => {
    try {
      const response = await apiPost('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '注册失败',
      };
    }
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const response = await apiGet('/auth/me');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取用户信息失败',
      };
    }
  },

  // 登出
  logout: async () => {
    try {
      await apiPost('/auth/logout');
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '登出失败',
      };
    }
  },
};

// 故事相关API
export const storiesAPI = {
  // 获取故事列表
  getStories: async (params = {}) => {
    try {
      const response = await apiGet('/stories', params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取故事列表失败',
      };
    }
  },

  // 获取我的故事
  getMyStories: async (params = {}) => {
    try {
      const response = await apiGet('/stories/my', params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取我的故事失败',
      };
    }
  },

  // 获取单个故事详情
  getStory: async (id) => {
    try {
      const response = await apiGet(`/stories/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取故事详情失败',
      };
    }
  },

  // 创建故事
  createStory: async (storyData) => {
    try {
      const response = await apiPost('/stories', storyData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '创建故事失败',
      };
    }
  },

  // 更新故事
  updateStory: async (id, storyData) => {
    try {
      const response = await apiPut(`/stories/${id}`, storyData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '更新故事失败',
      };
    }
  },

  // 删除故事
  deleteStory: async (id) => {
    try {
      await apiDelete(`/stories/${id}`);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '删除故事失败',
      };
    }
  },
};

// 章节相关API
export const chaptersAPI = {
  // 获取故事章节列表
  getChapters: async (storyId, params = {}) => {
    try {
      const response = await apiGet(`/stories/${storyId}/chapters`, params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取章节列表失败',
      };
    }
  },

  // 生成章节
  generateChapter: async (storyId, chapterData) => {
    try {
      const response = await apiPost(`/stories/${storyId}/chapters/generate`, chapterData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '生成章节失败',
      };
    }
  },

  // 获取生成进度
  getGenerationProgress: async (taskId) => {
    try {
      const response = await apiGet(`/generation/progress/${taskId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '获取生成进度失败',
      };
    }
  },

  // 取消生成
  cancelGeneration: async (taskId) => {
    try {
      await apiPost(`/generation/cancel/${taskId}`);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '取消生成失败',
      };
    }
  },
};

export default apiClient;