/**
 * 用户认证状态管理Hook
 * 使用zustand进行状态管理，提供登录、注册、登出等功能
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated,
  getStoredUserInfo,
} from '@services/authService.js';
import { SUCCESS_MESSAGES, LOADING_STATES } from '@constants';

/**
 * 认证状态store
 */
const useAuthStore = create(
  devtools(
    (set, get) => ({
      // 状态
      user: null,
      isAuthenticated: false,
      loading: LOADING_STATES.IDLE,
      error: null,
      
      // 初始化认证状态
      initAuth: async () => {
        set({ loading: LOADING_STATES.LOADING });
        
        try {
          // 检查本地是否有认证信息
          const hasAuth = isAuthenticated();
          
          if (hasAuth) {
            const storedUser = getStoredUserInfo();
            
            if (storedUser) {
              // 尝试获取最新的用户信息
              try {
                const response = await getCurrentUser();
                
                if (response.success) {
                  set({
                    user: response.data,
                    isAuthenticated: true,
                    loading: LOADING_STATES.SUCCESS,
                    error: null,
                  });
                } else {
                  // 如果获取用户信息失败（比如token过期），清除认证状态
                  set({
                    user: null,
                    isAuthenticated: false,
                    loading: LOADING_STATES.SUCCESS,
                    error: null,
                  });
                }
              } catch (apiError) {
                // API调用失败（比如网络错误或401），清除认证状态
                set({
                  user: null,
                  isAuthenticated: false,
                  loading: LOADING_STATES.SUCCESS,
                  error: null,
                });
              }
            } else {
              // 没有本地用户信息，清除认证状态
              set({
                user: null,
                isAuthenticated: false,
                loading: LOADING_STATES.SUCCESS,
                error: null,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            });
          }
        } catch (error) {
          console.error('初始化认证状态出错:', error);
          set({
            user: null,
            isAuthenticated: false,
            loading: LOADING_STATES.SUCCESS, // 即使出错也要设置为SUCCESS，避免一直loading
            error: null, // 初始化错误不显示给用户
          });
        }
      },
      
      // 用户登录
      login: async (credentials) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const response = await loginService(credentials);
          
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            });
            
            return {
              success: true,
              message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
              data: response.data,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '登录失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage = error.message || '登录失败，请重试';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'LOGIN_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 用户注册
      register: async (userData) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const response = await registerService(userData);
          
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            });
            
            return {
              success: true,
              message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
              data: response.data,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '注册失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Register error:', error);
          const errorMessage = error.message || '注册失败，请重试';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'REGISTER_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 用户登出
      logout: async () => {
        set({ loading: LOADING_STATES.LOADING });
        
        try {
          await logoutService();
          
          set({
            user: null,
            isAuthenticated: false,
            loading: LOADING_STATES.SUCCESS,
            error: null,
          });
          
          return {
            success: true,
            message: '登出成功',
          };
        } catch (error) {
          console.error('Logout error:', error);
          
          // 即使登出失败，也要清除本地状态
          set({
            user: null,
            isAuthenticated: false,
            loading: LOADING_STATES.ERROR,
            error: error.message || '登出失败',
          });
          
          return {
            success: false,
            error: {
              type: 'LOGOUT_ERROR',
              message: error.message || '登出失败',
            },
          };
        }
      },
      
      // 刷新用户信息
      refreshUser: async () => {
        if (!get().isAuthenticated) {
          return {
            success: false,
            error: {
              type: 'NOT_AUTHENTICATED',
              message: '用户未登录',
            },
          };
        }
        
        try {
          const response = await getCurrentUser();
          
          if (response.success) {
            set({
              user: response.data,
              error: null,
            });
            
            return {
              success: true,
              data: response.data,
            };
          } else {
            return response;
          }
        } catch (error) {
          console.error('Refresh user error:', error);
          return {
            success: false,
            error: {
              type: 'REFRESH_USER_ERROR',
              message: error.message || '刷新用户信息失败',
            },
          };
        }
      },
      
      // 清除错误状态
      clearError: () => {
        set({ error: null });
      },
      
      // 重置状态
      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: LOADING_STATES.IDLE,
          error: null,
        });
      },
    }),
    {
      name: 'auth-store',
      enabled: import.meta.env.DEV,
    }
  )
);

/**
 * 认证Hook
 * @returns {Object} 认证状态和方法
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    initAuth,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    reset,
  } = useAuthStore();
  
  return {
    // 状态
    user,
    isAuthenticated,
    loading,
    error,
    
    // 计算属性
    isLoading: loading === LOADING_STATES.LOADING,
    isIdle: loading === LOADING_STATES.IDLE,
    isSuccess: loading === LOADING_STATES.SUCCESS,
    isError: loading === LOADING_STATES.ERROR,
    
    // 方法
    initAuth,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    reset,
  };
};

export default useAuth;