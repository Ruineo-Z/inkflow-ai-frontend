/**
 * API服务模块
 * 提供与后端API的交互功能
 */

const BASE_URL = 'http://localhost:20001/api'



/**
 * 通用API请求函数
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} API响应数据
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}



/**
 * 认证相关API
 */
export const authAPI = {
  /**
   * 用户注册
   * @param {string} username - 用户名
   * @returns {Promise<Object>} 注册结果
   */
  register: async (username) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })
  },

  /**
   * 用户登录
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 登录结果
   */
  login: async (userId) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    })
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 用户信息
   */
  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  /**
   * 验证Token
   * @returns {Promise<Object>} 验证结果
   */
  verifyToken: async () => {
    return apiRequest('/auth/verify', { method: 'POST' })
  },
}

/**
 * 故事相关API
 */
export const storiesAPI = {
  /**
   * 获取用户所有故事
   * @returns {Promise<Object>} 故事列表
   */
  getStories: async () => {
    return apiRequest('/stories/')
  },

  /**
   * 创建新故事
   * @param {Object} storyData - 故事数据
   * @param {string} storyData.style - 故事风格
   * @param {string} [storyData.title] - 故事标题
   * @returns {Promise<Object>} 创建结果
   */
  createStory: async (storyData) => {
    return apiRequest('/stories/', {
      method: 'POST',
      body: JSON.stringify(storyData),
    })
  },

  /**
   * 获取故事详情
   * @param {string} storyId - 故事ID
   * @returns {Promise<Object>} 故事详情
   */
  getStory: async (storyId) => {
    return apiRequest(`/stories/${storyId}`)
  },

  /**
   * 删除故事
   * @param {string} storyId - 故事ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteStory: async (storyId) => {
    return apiRequest(`/stories/${storyId}`, { method: 'DELETE' })
  },

  /**
   * 获取故事章节列表
   * @param {string} storyId - 故事ID
   * @returns {Promise<Object>} 章节列表
   */
  getChapters: async (storyId) => {
    return apiRequest(`/stories/${storyId}/chapters`)
  },

  /**
   * 生成新章节
   * @param {string} storyId - 故事ID
   * @returns {Promise<Object>} 新章节
   */
  generateChapter: async (storyId) => {
    return apiRequest(`/stories/${storyId}/chapters`, { method: 'POST' })
  },
}

/**
 * 章节相关API
 */
export const chaptersAPI = {
  /**
   * 获取章节详情
   * @param {string} chapterId - 章节ID
   * @returns {Promise<Object>} 章节详情
   */
  getChapter: async (chapterId) => {
    return apiRequest(`/chapters/${chapterId}`)
  },

  /**
   * 获取章节选择选项
   * @param {string} chapterId - 章节ID
   * @returns {Promise<Object>} 选择选项
   */
  getChoices: async (chapterId) => {
    return apiRequest(`/chapters/${chapterId}/choices`)
  },

  /**
   * 提交选择并生成下一章节
   * @param {string} chapterId - 章节ID
   * @param {Object} choiceData - 选择数据
   * @returns {Promise<Object>} 下一章节
   */
  submitChoice: async (chapterId, choiceData) => {
    return apiRequest(`/chapters/${chapterId}/choices`, {
      method: 'POST',
      body: JSON.stringify(choiceData),
    })
  },
}

// 为了向后兼容，导出一个模拟的 apiClient 对象
export const apiClient = {
  defaults: { baseURL: BASE_URL },
  interceptors: {
    request: { handlers: [{ fulfilled: (config) => config }] }
  }
}
