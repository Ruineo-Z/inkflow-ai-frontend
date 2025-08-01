/**
 * 章节生成状态Hook
 * 使用zustand进行状态管理，提供流式章节生成功能
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  generateFirstChapter,
  generateNextChapter,
  ChapterGenerationManager,
} from '@services/chapterService.js';
import { LOADING_STATES, CHAPTER_GENERATION_EVENTS } from '@constants';

/**
 * 章节生成状态store
 */
const useChapterGenerationStore = create(
  devtools(
    (set, get) => ({
      // 状态
      isGenerating: false,
      currentChapter: null,
      generatedContent: '',
      generatedTitle: '',
      choices: [],
      error: null,
      progress: {
        stage: 'idle', // idle, starting, title, content, choices, complete
        progress: 0,
        message: '',
      },
      
      // 生成管理器实例
      generationManager: null,
      
      // 初始化生成管理器
      initManager: () => {
        const manager = new ChapterGenerationManager();
        
        // 绑定事件处理器
        manager.on('onStart', (data) => {
          set({
            isGenerating: true,
            currentChapter: null,
            generatedContent: '',
            generatedTitle: '',
            choices: [],
            error: null,
            progress: {
              stage: 'starting',
              progress: 10,
              message: '开始生成章节...',
            },
          });
        });
        
        manager.on('onTitle', (data) => {
          set({
            generatedTitle: data.title,
            progress: {
              stage: 'title',
              progress: 30,
              message: '标题生成完成，开始生成内容...',
            },
          });
        });
        
        manager.on('onContent', (data) => {
          set((state) => ({
            generatedContent: data.content,
            progress: {
              stage: 'content',
              progress: Math.min(70, state.progress.progress + 5),
              message: '正在生成内容...',
            },
          }));
        });
        
        manager.on('onComplete', (data) => {
          set({
            isGenerating: false,
            currentChapter: data.chapter,
            choices: data.choices || [],
            progress: {
              stage: 'complete',
              progress: 100,
              message: '章节生成完成',
            },
          });
        });
        
        manager.on('onError', (error) => {
          set({
            isGenerating: false,
            error: error.message || '生成章节时发生错误',
            progress: {
              stage: 'error',
              progress: 0,
              message: error.message || '生成失败',
            },
          });
        });
        
        manager.on('onProgress', (progress) => {
          set({ progress });
        });
        
        set({ generationManager: manager });
        return manager;
      },
      
      // 生成第一章
      generateFirstChapter: async (storyId) => {
        const state = get();
        let manager = state.generationManager;
        
        if (!manager) {
          manager = state.initManager();
        }
        
        try {
          const success = await manager.startGeneration(storyId, { type: 'first' });
          
          if (success) {
            return {
              success: true,
              message: '开始生成第一章',
            };
          } else {
            return {
              success: false,
              error: {
                type: 'START_GENERATION_ERROR',
                message: '开始生成第一章失败',
              },
            };
          }
        } catch (error) {
          console.error('Generate first chapter error:', error);
          set({
            error: error.message || '生成第一章失败',
            isGenerating: false,
          });
          
          return {
            success: false,
            error: {
              type: 'GENERATE_FIRST_CHAPTER_ERROR',
              message: error.message || '生成第一章失败',
            },
          };
        }
      },
      
      // 根据选择生成下一章
      generateNextChapter: async (storyId, previousChapterId, choiceIndex, choiceText) => {
        const state = get();
        let manager = state.generationManager;
        
        if (!manager) {
          manager = state.initManager();
        }
        
        try {
          const success = await manager.startGeneration(storyId, {
            type: 'continue',
            previous_chapter_id: previousChapterId,
            choice_index: choiceIndex,
            choice_text: choiceText,
          });
          
          if (success) {
            return {
              success: true,
              message: '开始生成下一章',
            };
          } else {
            return {
              success: false,
              error: {
                type: 'START_GENERATION_ERROR',
                message: '开始生成下一章失败',
              },
            };
          }
        } catch (error) {
          console.error('Generate next chapter error:', error);
          set({
            error: error.message || '生成下一章失败',
            isGenerating: false,
          });
          
          return {
            success: false,
            error: {
              type: 'GENERATE_NEXT_CHAPTER_ERROR',
              message: error.message || '生成下一章失败',
            },
          };
        }
      },
      
      // 停止生成
      stopGeneration: () => {
        const state = get();
        if (state.generationManager) {
          state.generationManager.stopGeneration();
        }
        
        set({
          isGenerating: false,
          progress: {
            stage: 'idle',
            progress: 0,
            message: '生成已停止',
          },
        });
      },
      
      // 重试生成
      retryGeneration: async () => {
        const state = get();
        if (state.generationManager) {
          const status = state.generationManager.getStatus();
          if (status.isGenerating) {
            return {
              success: false,
              error: {
                type: 'ALREADY_GENERATING',
                message: '正在生成中，无法重试',
              },
            };
          }
        }
        
        // 清除错误状态
        set({
          error: null,
          progress: {
            stage: 'idle',
            progress: 0,
            message: '',
          },
        });
        
        return {
          success: true,
          message: '已重置状态，可以重新生成',
        };
      },
      
      // 清除错误状态
      clearError: () => {
        set({ error: null });
      },
      
      // 重置状态
      reset: () => {
        const state = get();
        if (state.generationManager) {
          state.generationManager.reset();
        }
        
        set({
          isGenerating: false,
          currentChapter: null,
          generatedContent: '',
          generatedTitle: '',
          choices: [],
          error: null,
          progress: {
            stage: 'idle',
            progress: 0,
            message: '',
          },
        });
      },
      
      // 设置当前章节
      setCurrentChapter: (chapter) => {
        set({ currentChapter: chapter });
      },
      
      // 获取生成状态
      getGenerationStatus: () => {
        const state = get();
        if (state.generationManager) {
          return state.generationManager.getStatus();
        }
        return {
          isGenerating: state.isGenerating,
          currentChapter: state.currentChapter,
          progress: state.progress,
        };
      },
    }),
    {
      name: 'chapter-generation-store',
      enabled: import.meta.env.DEV,
    }
  )
);

/**
 * 章节生成Hook
 * @returns {Object} 章节生成状态和方法
 */
export const useChapterGeneration = () => {
  const {
    isGenerating,
    currentChapter,
    generatedContent,
    generatedTitle,
    choices,
    error,
    progress,
    generationManager,
    initManager,
    generateFirstChapter,
    generateNextChapter,
    stopGeneration,
    retryGeneration,
    clearError,
    reset,
    setCurrentChapter,
    getGenerationStatus,
  } = useChapterGenerationStore();
  
  return {
    // 状态
    isGenerating,
    currentChapter,
    generatedContent,
    generatedTitle,
    choices,
    error,
    progress,
    
    // 计算属性
    hasError: !!error,
    isIdle: progress.stage === 'idle',
    isStarting: progress.stage === 'starting',
    isGeneratingTitle: progress.stage === 'title',
    isGeneratingContent: progress.stage === 'content',
    isComplete: progress.stage === 'complete',
    progressPercentage: progress.progress,
    progressMessage: progress.message,
    hasChoices: choices.length > 0,
    hasContent: generatedContent.length > 0,
    hasTitle: generatedTitle.length > 0,
    
    // 方法
    initManager,
    generateFirstChapter,
    generateNextChapter,
    stopGeneration,
    retryGeneration,
    clearError,
    reset,
    setCurrentChapter,
    getGenerationStatus,
  };
};

/**
 * 简化的章节生成Hook，提供更直接的API
 * @param {string} storyId - 故事ID
 * @returns {Object} 简化的章节生成接口
 */
export const useSimpleChapterGeneration = (storyId) => {
  const {
    isGenerating,
    currentChapter,
    generatedContent,
    generatedTitle,
    choices,
    error,
    progress,
    generateFirstChapter,
    generateNextChapter,
    stopGeneration,
    retryGeneration,
    clearError,
    reset,
  } = useChapterGeneration();
  
  // 生成第一章的简化方法
  const startFirstChapter = async () => {
    if (!storyId) {
      throw new Error('故事ID不能为空');
    }
    return await generateFirstChapter(storyId);
  };
  
  // 生成下一章的简化方法
  const continueStory = async (previousChapterId, choiceIndex, choiceText) => {
    if (!storyId) {
      throw new Error('故事ID不能为空');
    }
    if (!previousChapterId) {
      throw new Error('上一章节ID不能为空');
    }
    if (choiceIndex === undefined) {
      throw new Error('选择索引不能为空');
    }
    if (!choiceText) {
      throw new Error('选择文本不能为空');
    }
    
    return await generateNextChapter(storyId, previousChapterId, choiceIndex, choiceText);
  };
  
  return {
    // 状态
    isGenerating,
    currentChapter,
    content: generatedContent,
    title: generatedTitle,
    choices,
    error,
    progress: progress.progress,
    stage: progress.stage,
    message: progress.message,
    
    // 计算属性
    canGenerate: !isGenerating && !error,
    isComplete: progress.stage === 'complete',
    hasError: !!error,
    
    // 简化方法
    startFirstChapter,
    continueStory,
    stop: stopGeneration,
    retry: retryGeneration,
    clearError,
    reset,
  };
};

export default useChapterGeneration;