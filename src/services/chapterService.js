/**
 * 章节生成服务
 * 提供章节生成相关的API调用功能，包括流式生成
 */

import { apiPost, createSSEConnection } from './api.js';
import { API_ENDPOINTS, CHAPTER_GENERATION_EVENTS } from '@constants';

/**
 * 流式生成章节
 * @param {string} storyId - 故事ID
 * @param {Object} options - 生成选项
 * @param {string} options.type - 生成类型 ('first' | 'continue')
 * @param {string} options.previous_chapter_id - 上一章节ID (continue时必需)
 * @param {number} options.choice_index - 选择索引 (continue时必需)
 * @param {string} options.choice_text - 选择文本 (continue时必需)
 * @param {Function} onEvent - 事件回调函数
 * @param {Function} onError - 错误回调函数
 * @returns {Promise<Object>} 包含控制方法的对象
 */
export const generateChapterStream = async (storyId, options, onEvent, onError) => {
  try {
    // 构建请求数据
    const requestData = {
      type: options.type || 'first',
    };
    
    // 如果是继续生成，添加必要的参数
    if (options.type === 'continue') {
      if (!options.previous_chapter_id) {
        throw new Error('继续生成章节时必须提供上一章节ID');
      }
      if (options.choice_index === undefined) {
        throw new Error('继续生成章节时必须提供选择索引');
      }
      if (!options.choice_text) {
        throw new Error('继续生成章节时必须提供选择文本');
      }
      
      requestData.previous_chapter_id = options.previous_chapter_id;
      requestData.choice_index = options.choice_index;
      requestData.choice_text = options.choice_text;
    }
    
    // 创建SSE连接
    const sseConnection = await createSSEConnection(
      API_ENDPOINTS.CHAPTERS.GENERATE_STREAM(storyId),
      requestData,
      {
        onMessage: (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // 根据事件类型调用回调
            switch (data.type) {
              case CHAPTER_GENERATION_EVENTS.START:
                onEvent?.({
                  type: 'start',
                  data: {
                    chapter_id: data.chapter_id,
                    message: '开始生成章节...',
                  },
                });
                break;
                
              case CHAPTER_GENERATION_EVENTS.TITLE:
                onEvent?.({
                  type: 'title',
                  data: {
                    chapter_id: data.chapter_id,
                    title: data.title,
                  },
                });
                break;
                
              case CHAPTER_GENERATION_EVENTS.CONTENT:
                onEvent?.({
                  type: 'content',
                  data: {
                    chapter_id: data.chapter_id,
                    content: data.content,
                    is_complete: data.is_complete || false,
                  },
                });
                break;
                
              case CHAPTER_GENERATION_EVENTS.COMPLETE:
                onEvent?.({
                  type: 'complete',
                  data: {
                    chapter_id: data.chapter_id,
                    chapter: data.chapter,
                    choices: data.choices,
                    message: '章节生成完成',
                  },
                });
                break;
                
              case CHAPTER_GENERATION_EVENTS.ERROR:
                onError?.({
                  type: 'GENERATION_ERROR',
                  message: data.error || '生成章节时发生错误',
                  details: data,
                });
                break;
                
              default:
                console.warn('Unknown SSE event type:', data.type);
                break;
            }
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError);
            onError?.({
              type: 'PARSE_ERROR',
              message: '解析服务器响应失败',
              details: parseError,
            });
          }
        },
        
        onError: (error) => {
          console.error('SSE connection error:', error);
          onError?.({
            type: 'CONNECTION_ERROR',
            message: '连接服务器失败',
            details: error,
          });
        },
        
        onClose: () => {
          console.log('SSE connection closed');
        },
      }
    );
    
    return {
      success: true,
      connection: sseConnection,
      // 提供停止生成的方法
      stop: () => {
        if (sseConnection && sseConnection.close) {
          sseConnection.close();
        }
      },
    };
    
  } catch (error) {
    console.error('Generate chapter stream error:', error);
    return {
      success: false,
      error: {
        type: 'STREAM_SETUP_ERROR',
        message: error.message || '设置章节生成流失败',
        details: error,
      },
    };
  }
};

/**
 * 生成第一章
 * @param {string} storyId - 故事ID
 * @param {Function} onEvent - 事件回调函数
 * @param {Function} onError - 错误回调函数
 * @returns {Promise<Object>} 生成结果
 */
export const generateFirstChapter = async (storyId, onEvent, onError) => {
  return generateChapterStream(
    storyId,
    { type: 'first' },
    onEvent,
    onError
  );
};

/**
 * 根据选择生成下一章
 * @param {string} storyId - 故事ID
 * @param {string} previousChapterId - 上一章节ID
 * @param {number} choiceIndex - 选择索引
 * @param {string} choiceText - 选择文本
 * @param {Function} onEvent - 事件回调函数
 * @param {Function} onError - 错误回调函数
 * @returns {Promise<Object>} 生成结果
 */
export const generateNextChapter = async (
  storyId,
  previousChapterId,
  choiceIndex,
  choiceText,
  onEvent,
  onError
) => {
  return generateChapterStream(
    storyId,
    {
      type: 'continue',
      previous_chapter_id: previousChapterId,
      choice_index: choiceIndex,
      choice_text: choiceText,
    },
    onEvent,
    onError
  );
};

/**
 * 非流式生成章节（备用方案）
 * @param {string} storyId - 故事ID
 * @param {Object} options - 生成选项
 * @returns {Promise<Object>} API响应
 */
export const generateChapter = async (storyId, options) => {
  try {
    const requestData = {
      type: options.type || 'first',
    };
    
    if (options.type === 'continue') {
      requestData.previous_chapter_id = options.previous_chapter_id;
      requestData.choice_index = options.choice_index;
      requestData.choice_text = options.choice_text;
    }
    
    const response = await apiPost(
      API_ENDPOINTS.CHAPTERS.GENERATE(storyId),
      requestData
    );
    
    return {
      success: true,
      data: response.data,
      message: '章节生成成功',
    };
  } catch (error) {
    console.error('Generate chapter error:', error);
    return {
      success: false,
      error: {
        type: 'GENERATE_CHAPTER_ERROR',
        message: error.message || '生成章节失败',
        details: error.response?.data,
      },
    };
  }
};

/**
 * 章节生成状态管理类
 */
export class ChapterGenerationManager {
  constructor() {
    this.currentConnection = null;
    this.isGenerating = false;
    this.currentChapter = null;
    this.generationProgress = {
      stage: 'idle', // idle, starting, title, content, choices, complete
      progress: 0,
      message: '',
    };
    this.eventHandlers = {
      onStart: [],
      onTitle: [],
      onContent: [],
      onComplete: [],
      onError: [],
      onProgress: [],
    };
  }
  
  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  on(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    }
  }
  
  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  off(event, handler) {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(handler);
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    }
  }
  
  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }
  
  /**
   * 更新生成进度
   * @param {string} stage - 当前阶段
   * @param {number} progress - 进度百分比
   * @param {string} message - 进度消息
   */
  updateProgress(stage, progress, message) {
    this.generationProgress = {
      stage,
      progress,
      message,
    };
    this.emit('onProgress', this.generationProgress);
  }
  
  /**
   * 开始生成章节
   * @param {string} storyId - 故事ID
   * @param {Object} options - 生成选项
   * @returns {Promise<boolean>} 是否成功开始生成
   */
  async startGeneration(storyId, options) {
    if (this.isGenerating) {
      console.warn('章节生成已在进行中');
      return false;
    }
    
    this.isGenerating = true;
    this.currentChapter = null;
    this.updateProgress('starting', 0, '准备生成章节...');
    
    try {
      const result = await generateChapterStream(
        storyId,
        options,
        (event) => this.handleGenerationEvent(event),
        (error) => this.handleGenerationError(error)
      );
      
      if (result.success) {
        this.currentConnection = result.connection;
        return true;
      } else {
        this.isGenerating = false;
        this.handleGenerationError(result.error);
        return false;
      }
    } catch (error) {
      this.isGenerating = false;
      this.handleGenerationError({
        type: 'START_GENERATION_ERROR',
        message: error.message || '开始生成章节失败',
        details: error,
      });
      return false;
    }
  }
  
  /**
   * 停止生成章节
   */
  stopGeneration() {
    if (this.currentConnection) {
      this.currentConnection.close();
      this.currentConnection = null;
    }
    this.isGenerating = false;
    this.updateProgress('idle', 0, '生成已停止');
  }
  
  /**
   * 处理生成事件
   * @param {Object} event - 生成事件
   */
  handleGenerationEvent(event) {
    switch (event.type) {
      case 'start':
        this.updateProgress('title', 10, '开始生成标题...');
        this.emit('onStart', event.data);
        break;
        
      case 'title':
        this.updateProgress('content', 30, '标题生成完成，开始生成内容...');
        this.emit('onTitle', event.data);
        break;
        
      case 'content':
        this.updateProgress('content', 70, '正在生成内容...');
        this.emit('onContent', event.data);
        break;
        
      case 'complete':
        this.isGenerating = false;
        this.currentConnection = null;
        this.currentChapter = event.data.chapter;
        this.updateProgress('complete', 100, '章节生成完成');
        this.emit('onComplete', event.data);
        break;
        
      default:
        console.warn('Unknown generation event type:', event.type);
        break;
    }
  }
  
  /**
   * 处理生成错误
   * @param {Object} error - 错误信息
   */
  handleGenerationError(error) {
    this.isGenerating = false;
    this.currentConnection = null;
    this.updateProgress('error', 0, error.message || '生成失败');
    this.emit('onError', error);
  }
  
  /**
   * 获取当前状态
   * @returns {Object} 当前状态
   */
  getStatus() {
    return {
      isGenerating: this.isGenerating,
      currentChapter: this.currentChapter,
      progress: this.generationProgress,
    };
  }
  
  /**
   * 重置状态
   */
  reset() {
    this.stopGeneration();
    this.currentChapter = null;
    this.generationProgress = {
      stage: 'idle',
      progress: 0,
      message: '',
    };
  }
}

// 导出单例实例
export const chapterGenerationManager = new ChapterGenerationManager();