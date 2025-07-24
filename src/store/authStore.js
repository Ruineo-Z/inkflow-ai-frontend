import { create } from 'zustand'

/**
 * 认证状态管理Store
 * 管理用户登录状态、用户信息和认证相关操作
 */
export const useAuthStore = create((set, get) => ({
  // 状态
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // 操作
  /**
   * 设置加载状态
   * @param {boolean} loading - 加载状态
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * 设置错误信息
   * @param {string|null} error - 错误信息
   */
  setError: (error) => set({ error }),

  /**
   * 用户登录
   * @param {Object} authData - 认证数据
   * @param {Object} authData.user - 用户信息
   * @param {string} authData.token - 认证令牌
   */
  login: (authData) => {
    const { user, token } = authData
    
    // 保存到localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    // 更新状态
    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    })
  },

  /**
   * 用户登出
   */
  logout: () => {
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 重置状态
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  /**
   * 从localStorage初始化认证状态
   */
  initializeAuth: () => {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        set({
          user,
          token,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error)
      // 清除可能损坏的数据
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  /**
   * 更新用户信息
   * @param {Object} userData - 用户数据
   */
  updateUser: (userData) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      set({ user: updatedUser })
    }
  },

  /**
   * 检查是否已认证
   * @returns {boolean} 认证状态
   */
  checkAuth: () => {
    const { token, isAuthenticated } = get()
    return !!(token && isAuthenticated)
  },
}))

/**
 * 认证相关的选择器
 */
export const authSelectors = {
  /**
   * 获取当前用户
   */
  getUser: () => useAuthStore.getState().user,
  
  /**
   * 获取认证状态
   */
  getIsAuthenticated: () => useAuthStore.getState().isAuthenticated,
  
  /**
   * 获取加载状态
   */
  getIsLoading: () => useAuthStore.getState().isLoading,
  
  /**
   * 获取错误信息
   */
  getError: () => useAuthStore.getState().error,
}
