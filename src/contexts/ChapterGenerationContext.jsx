import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { chaptersAPI } from '../services/api';

/**
 * 章节生成状态初始值
 */
const initialState = {
  isGenerating: false,
  progress: 0,
  currentStep: '',
  generatedChapters: [],
  error: null,
  generationId: null,
  estimatedTime: 0,
  startTime: null
};

/**
 * 章节生成状态动作类型
 */
const GENERATION_ACTIONS = {
  START_GENERATION: 'START_GENERATION',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  ADD_GENERATED_CHAPTER: 'ADD_GENERATED_CHAPTER',
  COMPLETE_GENERATION: 'COMPLETE_GENERATION',
  SET_ERROR: 'SET_ERROR',
  RESET_GENERATION: 'RESET_GENERATION',
  SET_ESTIMATED_TIME: 'SET_ESTIMATED_TIME'
};

/**
 * 章节生成状态reducer
 */
const generationReducer = (state, action) => {
  switch (action.type) {
    case GENERATION_ACTIONS.START_GENERATION:
      return {
        ...state,
        isGenerating: true,
        progress: 0,
        currentStep: '开始生成...',
        generatedChapters: [],
        error: null,
        generationId: action.payload.generationId,
        estimatedTime: action.payload.estimatedTime || 0,
        startTime: Date.now()
      };
    
    case GENERATION_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        progress: action.payload
      };
    
    case GENERATION_ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };
    
    case GENERATION_ACTIONS.ADD_GENERATED_CHAPTER:
      return {
        ...state,
        generatedChapters: [...state.generatedChapters, action.payload]
      };
    
    case GENERATION_ACTIONS.COMPLETE_GENERATION:
      return {
        ...state,
        isGenerating: false,
        progress: 100,
        currentStep: '生成完成',
        generatedChapters: action.payload.chapters || state.generatedChapters
      };
    
    case GENERATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        isGenerating: false,
        error: action.payload
      };
    
    case GENERATION_ACTIONS.RESET_GENERATION:
      return {
        ...initialState
      };
    
    case GENERATION_ACTIONS.SET_ESTIMATED_TIME:
      return {
        ...state,
        estimatedTime: action.payload
      };
    
    default:
      return state;
  }
};

/**
 * 章节生成上下文
 */
const ChapterGenerationContext = createContext(null);

/**
 * 章节生成提供者组件
 */
export const ChapterGenerationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(generationReducer, initialState);
  
  /**
   * 开始生成章节
   */
  const startGeneration = useCallback(async (storyData) => {
    try {
      // 生成唯一的生成ID
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 估算生成时间（基于章节数量）
      const estimatedTime = (storyData.chapterCount || 5) * 30; // 每章节约30秒
      
      dispatch({
        type: GENERATION_ACTIONS.START_GENERATION,
        payload: {
          generationId,
          estimatedTime
        }
      });
      
      // 调用API开始生成
      const response = await chaptersAPI.generateChapters({
        ...storyData,
        generationId
      });
      
      // 开始轮询生成进度
      pollGenerationProgress(generationId);
      
      return { success: true, generationId };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '开始生成章节失败';
      dispatch({
        type: GENERATION_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);
  
  /**
   * 轮询生成进度
   */
  const pollGenerationProgress = useCallback(async (generationId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await chaptersAPI.getGenerationProgress(generationId);
        const { progress, currentStep, chapters, status, error } = response.data;
        
        // 更新进度
        dispatch({
          type: GENERATION_ACTIONS.UPDATE_PROGRESS,
          payload: progress
        });
        
        // 更新当前步骤
        if (currentStep) {
          dispatch({
            type: GENERATION_ACTIONS.SET_CURRENT_STEP,
            payload: currentStep
          });
        }
        
        // 添加新生成的章节
        if (chapters && chapters.length > 0) {
          chapters.forEach(chapter => {
            dispatch({
              type: GENERATION_ACTIONS.ADD_GENERATED_CHAPTER,
              payload: chapter
            });
          });
        }
        
        // 检查是否完成或出错
        if (status === 'completed') {
          clearInterval(pollInterval);
          dispatch({
            type: GENERATION_ACTIONS.COMPLETE_GENERATION,
            payload: { chapters }
          });
        } else if (status === 'failed' || error) {
          clearInterval(pollInterval);
          dispatch({
            type: GENERATION_ACTIONS.SET_ERROR,
            payload: error || '生成过程中出现错误'
          });
        }
      } catch (error) {
        console.error('轮询生成进度失败:', error);
        // 继续轮询，不中断
      }
    }, 2000); // 每2秒轮询一次
    
    // 设置超时，避免无限轮询
    setTimeout(() => {
      clearInterval(pollInterval);
      if (state.isGenerating) {
        dispatch({
          type: GENERATION_ACTIONS.SET_ERROR,
          payload: '生成超时，请重试'
        });
      }
    }, 300000); // 5分钟超时
  }, [state.isGenerating]);
  
  /**
   * 取消生成
   */
  const cancelGeneration = useCallback(async () => {
    try {
      if (state.generationId) {
        await chaptersAPI.cancelGeneration(state.generationId);
      }
    } catch (error) {
      console.error('取消生成失败:', error);
    } finally {
      dispatch({ type: GENERATION_ACTIONS.RESET_GENERATION });
    }
  }, [state.generationId]);
  
  /**
   * 重置生成状态
   */
  const resetGeneration = useCallback(() => {
    dispatch({ type: GENERATION_ACTIONS.RESET_GENERATION });
  }, []);
  
  /**
   * 获取剩余时间
   */
  const getRemainingTime = useCallback(() => {
    if (!state.isGenerating || !state.startTime || !state.estimatedTime) {
      return 0;
    }
    
    const elapsed = (Date.now() - state.startTime) / 1000;
    const progressRatio = state.progress / 100;
    const estimatedTotal = state.estimatedTime;
    
    if (progressRatio === 0) {
      return estimatedTotal;
    }
    
    const estimatedRemaining = (estimatedTotal * (1 - progressRatio));
    return Math.max(0, Math.round(estimatedRemaining));
  }, [state.isGenerating, state.startTime, state.estimatedTime, state.progress]);
  
  /**
   * 格式化时间
   */
  const formatTime = useCallback((seconds) => {
    if (seconds < 60) {
      return `${seconds}秒`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  }, []);
  
  /**
   * 获取生成统计信息
   */
  const getGenerationStats = useCallback(() => {
    return {
      totalChapters: state.generatedChapters.length,
      progress: state.progress,
      isGenerating: state.isGenerating,
      currentStep: state.currentStep,
      remainingTime: getRemainingTime(),
      formattedRemainingTime: formatTime(getRemainingTime()),
      elapsedTime: state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0
    };
  }, [state, getRemainingTime, formatTime]);
  
  const value = {
    // 状态
    isGenerating: state.isGenerating,
    progress: state.progress,
    currentStep: state.currentStep,
    generatedChapters: state.generatedChapters,
    error: state.error,
    generationId: state.generationId,
    estimatedTime: state.estimatedTime,
    
    // 方法
    startGeneration,
    cancelGeneration,
    resetGeneration,
    getRemainingTime,
    formatTime,
    getGenerationStats
  };
  
  return (
    <ChapterGenerationContext.Provider value={value}>
      {children}
    </ChapterGenerationContext.Provider>
  );
};

/**
 * 使用章节生成上下文的Hook
 */
export const useChapterGenerationContext = () => {
  const context = useContext(ChapterGenerationContext);
  if (!context) {
    throw new Error('useChapterGenerationContext must be used within a ChapterGenerationProvider');
  }
  return context;
};

export default ChapterGenerationContext;