import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { authAPI } from '../services/api';
import { getStoredToken, setStoredToken, removeStoredToken } from '../utils/storage';

/**
 * 认证状态初始值
 */
const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null
};

/**
 * 认证状态动作类型
 */
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

/**
 * 认证状态reducer
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

/**
 * 认证上下文
 */
const AuthContext = createContext(null);

/**
 * 认证提供者组件
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  /**
   * 初始化认证状态
   */
  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const token = getStoredToken();
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }
      
      // 验证token有效性
      const response = await authAPI.getCurrentUser();
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: response.data.user,
          token
        }
      });
    } catch (error) {
      console.error('初始化认证失败:', error);
      removeStoredToken();
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  
  /**
   * 用户登录
   */
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      setStoredToken(token);
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, token }
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '登录失败，请重试';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 用户注册
   */
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      setStoredToken(token);
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, token }
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请重试';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 用户登出
   */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      removeStoredToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);
  
  /**
   * 更新用户信息
   */
  const updateUser = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: updatedUser,
          token: state.token
        }
      });
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '更新失败，请重试';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, [state.token]);
  
  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);
  
  /**
   * 检查是否已认证
   */
  const isAuthenticated = useCallback(() => {
    return !!(state.user && state.token);
  }, [state.user, state.token]);
  
  /**
   * 检查用户权限
   */
  const hasPermission = useCallback((permission) => {
    if (!state.user) return false;
    return state.user.permissions?.includes(permission) || state.user.role === 'admin';
  }, [state.user]);
  
  const value = {
    // 状态
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    
    // 方法
    initializeAuth,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated,
    hasPermission
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 使用认证上下文的Hook
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;