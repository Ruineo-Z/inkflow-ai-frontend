/**
 * 故事管理服务
 * 提供故事相关的API调用功能
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { API_ENDPOINTS } from '@constants';

/**
 * 创建新故事
 * @param {Object} storyData - 故事数据
 * @param {string} storyData.title - 故事标题
 * @param {string} storyData.description - 故事描述
 * @param {string} storyData.style - 故事风格
 * @param {Object} storyData.worldview - 世界观设定
 * @returns {Promise<Object>} API响应
 */
export const createStory = async (storyData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.STORIES.CREATE, storyData);
    return {
      success: true,
      data: response.data,
      message: '故事创建成功',
    };
  } catch (error) {
    console.error('Create story error:', error);
    return {
      success: false,
      error: {
        type: 'CREATE_STORY_ERROR',
        message: error.message || '创建故事失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 获取用户的故事列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.search - 搜索关键词
 * @param {string} params.style - 故事风格筛选
 * @param {string} params.sort - 排序方式
 * @returns {Promise<Object>} API响应
 */
export const getStories = async (params = {}) => {
  try {
    const queryParams = {
      page: 1,
      limit: 20,
      ...params,
    };
    
    const response = await apiGet(API_ENDPOINTS.STORIES.LIST, { params: queryParams });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get stories error:', error);
    return {
      success: false,
      error: {
        type: 'GET_STORIES_ERROR',
        message: error.message || '获取故事列表失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 获取故事详情
 * @param {string} storyId - 故事ID
 * @returns {Promise<Object>} API响应
 */
export const getStoryById = async (storyId) => {
  try {
    const response = await apiGet(API_ENDPOINTS.STORIES.GET_BY_ID(storyId));
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get story by id error:', error);
    return {
      success: false,
      error: {
        type: 'GET_STORY_ERROR',
        message: error.message || '获取故事详情失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 更新故事信息
 * @param {string} storyId - 故事ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} API响应
 */
export const updateStory = async (storyId, updateData) => {
  try {
    const response = await apiPut(API_ENDPOINTS.STORIES.UPDATE(storyId), updateData);
    return {
      success: true,
      data: response.data,
      message: '故事更新成功',
    };
  } catch (error) {
    console.error('Update story error:', error);
    return {
      success: false,
      error: {
        type: 'UPDATE_STORY_ERROR',
        message: error.message || '更新故事失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 删除故事
 * @param {string} storyId - 故事ID
 * @returns {Promise<Object>} API响应
 */
export const deleteStory = async (storyId) => {
  try {
    await apiDelete(API_ENDPOINTS.STORIES.DELETE(storyId));
    return {
      success: true,
      message: '故事删除成功',
    };
  } catch (error) {
    console.error('Delete story error:', error);
    return {
      success: false,
      error: {
        type: 'DELETE_STORY_ERROR',
        message: error.message || '删除故事失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 获取故事的章节列表
 * @param {string} storyId - 故事ID
 * @returns {Promise<Object>} API响应
 */
export const getStoryChapters = async (storyId) => {
  try {
    const response = await apiGet(API_ENDPOINTS.CHAPTERS.LIST(storyId));
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get story chapters error:', error);
    return {
      success: false,
      error: {
        type: 'GET_CHAPTERS_ERROR',
        message: error.message || '获取章节列表失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 获取章节详情
 * @param {string} storyId - 故事ID
 * @param {string} chapterId - 章节ID
 * @returns {Promise<Object>} API响应
 */
export const getChapterById = async (storyId, chapterId) => {
  try {
    const response = await apiGet(API_ENDPOINTS.CHAPTERS.GET_BY_ID(storyId, chapterId));
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get chapter by id error:', error);
    return {
      success: false,
      error: {
        type: 'GET_CHAPTER_ERROR',
        message: error.message || '获取章节详情失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 获取故事的选择历史
 * @param {string} storyId - 故事ID
 * @returns {Promise<Object>} API响应
 */
export const getStoryChoices = async (storyId) => {
  try {
    const response = await apiGet(API_ENDPOINTS.CHOICES.GET_HISTORY(storyId));
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get story choices error:', error);
    return {
      success: false,
      error: {
        type: 'GET_CHOICES_ERROR',
        message: error.message || '获取选择历史失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 提交选择并生成下一章
 * @param {string} storyId - 故事ID
 * @param {string} chapterId - 当前章节ID
 * @param {Object} choiceData - 选择数据
 * @param {number} choiceData.choice_index - 选择索引
 * @param {string} choiceData.choice_text - 选择文本
 * @returns {Promise<Object>} API响应
 */
export const submitChoice = async (storyId, chapterId, choiceData) => {
  try {
    const response = await apiPost(
      API_ENDPOINTS.CHOICES.SUBMIT(storyId, chapterId),
      choiceData
    );
    return {
      success: true,
      data: response.data,
      message: '选择提交成功',
    };
  } catch (error) {
    console.error('Submit choice error:', error);
    return {
      success: false,
      error: {
        type: 'SUBMIT_CHOICE_ERROR',
        message: error.message || '提交选择失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 验证故事数据
 * @param {Object} storyData - 故事数据
 * @returns {Object} 验证结果
 */
export const validateStoryData = (storyData) => {
  const errors = {};
  
  // 验证标题
  if (!storyData.title || storyData.title.trim().length === 0) {
    errors.title = '故事标题不能为空';
  } else if (storyData.title.length > 100) {
    errors.title = '故事标题不能超过100个字符';
  }
  
  // 验证描述
  if (!storyData.description || storyData.description.trim().length === 0) {
    errors.description = '故事描述不能为空';
  } else if (storyData.description.length > 500) {
    errors.description = '故事描述不能超过500个字符';
  }
  
  // 验证风格
  if (!storyData.style) {
    errors.style = '请选择故事风格';
  }
  
  // 验证世界观
  if (!storyData.worldview) {
    errors.worldview = '世界观设定不能为空';
  } else {
    if (!storyData.worldview.setting || storyData.worldview.setting.trim().length === 0) {
      errors.worldview = '世界观背景设定不能为空';
    }
    
    if (storyData.worldview.setting && storyData.worldview.setting.length > 1000) {
      errors.worldview = '世界观背景设定不能超过1000个字符';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 格式化故事数据用于显示
 * @param {Object} story - 原始故事数据
 * @returns {Object} 格式化后的故事数据
 */
export const formatStoryData = (story) => {
  if (!story) return null;
  
  return {
    ...story,
    created_at: new Date(story.created_at).toLocaleDateString('zh-CN'),
    updated_at: new Date(story.updated_at).toLocaleDateString('zh-CN'),
    chapter_count: story.chapters?.length || 0,
    last_read_at: story.last_read_at ? new Date(story.last_read_at).toLocaleDateString('zh-CN') : null,
  };
};

/**
 * 格式化章节数据用于显示
 * @param {Object} chapter - 原始章节数据
 * @returns {Object} 格式化后的章节数据
 */
export const formatChapterData = (chapter) => {
  if (!chapter) return null;
  
  return {
    ...chapter,
    created_at: new Date(chapter.created_at).toLocaleDateString('zh-CN'),
    word_count: chapter.content ? chapter.content.length : 0,
    reading_time: chapter.content ? Math.ceil(chapter.content.length / 300) : 0, // 假设每分钟阅读300字
  };
};