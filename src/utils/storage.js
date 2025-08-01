/**
 * 本地存储工具函数
 */

// 存储键名常量
const STORAGE_KEYS = {
  AUTH_TOKEN: 'inkflow_auth_token',
  USER_PREFERENCES: 'inkflow_user_preferences',
  READING_HISTORY: 'inkflow_reading_history',
  DRAFT_STORY: 'inkflow_draft_story',
  THEME: 'inkflow_theme'
};

/**
 * 获取存储的认证令牌
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('获取存储的令牌失败:', error);
    return null;
  }
};

/**
 * 设置认证令牌
 */
export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (error) {
    console.error('设置令牌失败:', error);
  }
};

/**
 * 移除认证令牌
 */
export const removeStoredToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('移除令牌失败:', error);
  }
};

/**
 * 获取用户偏好设置
 */
export const getUserPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('获取用户偏好设置失败:', error);
    return {};
  }
};

/**
 * 设置用户偏好设置
 */
export const setUserPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('设置用户偏好设置失败:', error);
  }
};

/**
 * 获取阅读历史
 */
export const getReadingHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.READING_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('获取阅读历史失败:', error);
    return [];
  }
};

/**
 * 添加阅读历史记录
 */
export const addReadingHistory = (storyData) => {
  try {
    const history = getReadingHistory();
    const existingIndex = history.findIndex(item => item.storyId === storyData.storyId);
    
    if (existingIndex !== -1) {
      // 更新现有记录
      history[existingIndex] = {
        ...history[existingIndex],
        ...storyData,
        lastReadAt: new Date().toISOString()
      };
    } else {
      // 添加新记录
      history.unshift({
        ...storyData,
        lastReadAt: new Date().toISOString()
      });
    }
    
    // 限制历史记录数量
    const limitedHistory = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('添加阅读历史失败:', error);
  }
};

/**
 * 清除阅读历史
 */
export const clearReadingHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.READING_HISTORY);
  } catch (error) {
    console.error('清除阅读历史失败:', error);
  }
};

/**
 * 获取草稿故事
 */
export const getDraftStory = () => {
  try {
    const draft = localStorage.getItem(STORAGE_KEYS.DRAFT_STORY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('获取草稿故事失败:', error);
    return null;
  }
};

/**
 * 保存草稿故事
 */
export const saveDraftStory = (storyData) => {
  try {
    const draft = {
      ...storyData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.DRAFT_STORY, JSON.stringify(draft));
  } catch (error) {
    console.error('保存草稿故事失败:', error);
  }
};

/**
 * 清除草稿故事
 */
export const clearDraftStory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_STORY);
  } catch (error) {
    console.error('清除草稿故事失败:', error);
  }
};

/**
 * 获取主题设置
 */
export const getTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch (error) {
    console.error('获取主题设置失败:', error);
    return 'light';
  }
};

/**
 * 设置主题
 */
export const setTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('设置主题失败:', error);
  }
};

/**
 * 通用存储函数
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`设置存储项 ${key} 失败:`, error);
  }
};

/**
 * 通用获取函数
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`获取存储项 ${key} 失败:`, error);
    return defaultValue;
  }
};

/**
 * 通用移除函数
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`移除存储项 ${key} 失败:`, error);
  }
};

/**
 * 清除所有应用相关的存储
 */
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('清除所有存储失败:', error);
  }
};

/**
 * 检查本地存储是否可用
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export default {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getUserPreferences,
  setUserPreferences,
  getReadingHistory,
  addReadingHistory,
  clearReadingHistory,
  getDraftStory,
  saveDraftStory,
  clearDraftStory,
  getTheme,
  setTheme,
  setItem,
  getItem,
  removeItem,
  clearAllStorage,
  isStorageAvailable
};