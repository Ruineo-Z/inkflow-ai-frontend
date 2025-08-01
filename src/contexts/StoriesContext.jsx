import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { storiesAPI } from '../services/api';

/**
 * 故事状态初始值
 */
const initialState = {
  stories: [],
  currentStory: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    category: '',
    status: '',
    search: ''
  }
};

/**
 * 故事状态动作类型
 */
const STORIES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_STORIES: 'SET_STORIES',
  ADD_STORY: 'ADD_STORY',
  UPDATE_STORY: 'UPDATE_STORY',
  DELETE_STORY: 'DELETE_STORY',
  SET_CURRENT_STORY: 'SET_CURRENT_STORY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  RESET_STORIES: 'RESET_STORIES'
};

/**
 * 故事状态reducer
 */
const storiesReducer = (state, action) => {
  switch (action.type) {
    case STORIES_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case STORIES_ACTIONS.SET_STORIES:
      return {
        ...state,
        stories: action.payload.stories,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null
      };
    
    case STORIES_ACTIONS.ADD_STORY:
      return {
        ...state,
        stories: [action.payload, ...state.stories],
        loading: false,
        error: null
      };
    
    case STORIES_ACTIONS.UPDATE_STORY:
      return {
        ...state,
        stories: state.stories.map(story => 
          story.id === action.payload.id ? action.payload : story
        ),
        currentStory: state.currentStory?.id === action.payload.id 
          ? action.payload 
          : state.currentStory,
        loading: false,
        error: null
      };
    
    case STORIES_ACTIONS.DELETE_STORY:
      return {
        ...state,
        stories: state.stories.filter(story => story.id !== action.payload),
        currentStory: state.currentStory?.id === action.payload 
          ? null 
          : state.currentStory,
        loading: false,
        error: null
      };
    
    case STORIES_ACTIONS.SET_CURRENT_STORY:
      return {
        ...state,
        currentStory: action.payload,
        loading: false,
        error: null
      };
    
    case STORIES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case STORIES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case STORIES_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };
    
    case STORIES_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    
    case STORIES_ACTIONS.RESET_STORIES:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

/**
 * 故事上下文
 */
const StoriesContext = createContext(null);

/**
 * 故事提供者组件
 */
export const StoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storiesReducer, initialState);
  
  /**
   * 获取故事列表
   */
  const fetchStories = useCallback(async (params = {}) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...state.filters,
        ...params
      };
      
      const response = await storiesAPI.getStories(queryParams);
      
      dispatch({
        type: STORIES_ACTIONS.SET_STORIES,
        payload: {
          stories: response.data.stories,
          pagination: response.data.pagination
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '获取故事列表失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, [state.pagination.page, state.pagination.limit, state.filters]);
  
  /**
   * 获取用户的故事
   */
  const fetchMyStories = useCallback(async (params = {}) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...params
      };
      
      const response = await storiesAPI.getMyStories(queryParams);
      
      dispatch({
        type: STORIES_ACTIONS.SET_STORIES,
        payload: {
          stories: response.data.stories,
          pagination: response.data.pagination
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '获取我的故事失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, [state.pagination.page, state.pagination.limit]);
  
  /**
   * 获取单个故事详情
   */
  const fetchStory = useCallback(async (storyId) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      const response = await storiesAPI.getStory(storyId);
      
      dispatch({
        type: STORIES_ACTIONS.SET_CURRENT_STORY,
        payload: response.data.story
      });
      
      return { success: true, data: response.data.story };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '获取故事详情失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 创建新故事
   */
  const createStory = useCallback(async (storyData) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      const response = await storiesAPI.createStory(storyData);
      
      dispatch({
        type: STORIES_ACTIONS.ADD_STORY,
        payload: response.data.story
      });
      
      return { success: true, data: response.data.story };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '创建故事失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 更新故事
   */
  const updateStory = useCallback(async (storyId, storyData) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      const response = await storiesAPI.updateStory(storyId, storyData);
      
      dispatch({
        type: STORIES_ACTIONS.UPDATE_STORY,
        payload: response.data.story
      });
      
      return { success: true, data: response.data.story };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '更新故事失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 删除故事
   */
  const deleteStory = useCallback(async (storyId) => {
    try {
      dispatch({ type: STORIES_ACTIONS.SET_LOADING, payload: true });
      
      await storiesAPI.deleteStory(storyId);
      
      dispatch({
        type: STORIES_ACTIONS.DELETE_STORY,
        payload: storyId
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '删除故事失败';
      dispatch({
        type: STORIES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 设置分页
   */
  const setPagination = useCallback((pagination) => {
    dispatch({
      type: STORIES_ACTIONS.SET_PAGINATION,
      payload: pagination
    });
  }, []);
  
  /**
   * 设置过滤器
   */
  const setFilters = useCallback((filters) => {
    dispatch({
      type: STORIES_ACTIONS.SET_FILTERS,
      payload: filters
    });
  }, []);
  
  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    dispatch({ type: STORIES_ACTIONS.CLEAR_ERROR });
  }, []);
  
  /**
   * 重置故事状态
   */
  const resetStories = useCallback(() => {
    dispatch({ type: STORIES_ACTIONS.RESET_STORIES });
  }, []);
  
  const value = {
    // 状态
    stories: state.stories,
    currentStory: state.currentStory,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // 方法
    fetchStories,
    fetchMyStories,
    fetchStory,
    createStory,
    updateStory,
    deleteStory,
    setPagination,
    setFilters,
    clearError,
    resetStories
  };
  
  return (
    <StoriesContext.Provider value={value}>
      {children}
    </StoriesContext.Provider>
  );
};

/**
 * 使用故事上下文的Hook
 */
export const useStoriesContext = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStoriesContext must be used within a StoriesProvider');
  }
  return context;
};

export default StoriesContext;