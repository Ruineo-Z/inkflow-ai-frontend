/**
 * 故事管理状态Hook
 * 使用zustand进行状态管理，提供故事CRUD操作
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  getStoryChapters,
  getChapterById,
  getStoryChoices,
  validateStoryData,
  formatStoryData,
  formatChapterData,
} from '@services/storyService.js';
import { LOADING_STATES, SUCCESS_MESSAGES } from '@constants';

/**
 * 故事状态store
 */
const useStoriesStore = create(
  devtools(
    (set, get) => ({
      // 状态
      stories: [],
      currentStory: null,
      currentChapter: null,
      chapters: [],
      choices: [],
      loading: LOADING_STATES.IDLE,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: '',
        style: '',
        sort: 'updated_at',
      },
      
      // 获取故事列表
      fetchStories: async (params = {}) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const currentFilters = get().filters;
          const queryParams = {
            ...currentFilters,
            ...params,
          };
          
          const response = await getStories(queryParams);
          
          if (response.success) {
            // 确保response.data存在且有stories数组
            const stories = response.data?.stories || response.data || [];
            const formattedStories = Array.isArray(stories) ? stories.map(formatStoryData) : [];
            
            set({
              stories: formattedStories,
              pagination: {
                page: response.data?.page || 1,
                limit: response.data?.limit || 20,
                total: response.data?.total || 0,
                totalPages: response.data?.total_pages || 1,
              },
              loading: LOADING_STATES.SUCCESS,
              error: null,
            });
            
            return {
              success: true,
              data: formattedStories,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '获取故事列表失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Fetch stories error:', error);
          const errorMessage = error.message || '获取故事列表失败';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'FETCH_STORIES_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 创建新故事
      createStory: async (storyData) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          // 验证故事数据
          const validation = validateStoryData(storyData);
          if (!validation.isValid) {
            set({
              loading: LOADING_STATES.ERROR,
              error: '数据验证失败',
            });
            
            return {
              success: false,
              error: {
                type: 'VALIDATION_ERROR',
                message: '数据验证失败',
                details: validation.errors,
              },
            };
          }
          
          const response = await createStory(storyData);
          
          if (response.success) {
            const formattedStory = formatStoryData(response.data);
            
            // 将新故事添加到列表开头
            set((state) => ({
              stories: [formattedStory, ...state.stories],
              currentStory: formattedStory,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            }));
            
            return {
              success: true,
              data: formattedStory,
              message: SUCCESS_MESSAGES.STORY_CREATED,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '创建故事失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Create story error:', error);
          const errorMessage = error.message || '创建故事失败';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'CREATE_STORY_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 获取故事详情
      fetchStoryById: async (storyId) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const response = await getStoryById(storyId);
          
          if (response.success) {
            const formattedStory = formatStoryData(response.data);
            
            set({
              currentStory: formattedStory,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            });
            
            return {
              success: true,
              data: formattedStory,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '获取故事详情失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Fetch story by id error:', error);
          const errorMessage = error.message || '获取故事详情失败';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'FETCH_STORY_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 更新故事
      updateStory: async (storyId, updateData) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const response = await updateStory(storyId, updateData);
          
          if (response.success) {
            const formattedStory = formatStoryData(response.data);
            
            // 更新故事列表中的对应项
            set((state) => ({
              stories: state.stories.map(story => 
                story.id === storyId ? formattedStory : story
              ),
              currentStory: state.currentStory?.id === storyId ? formattedStory : state.currentStory,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            }));
            
            return {
              success: true,
              data: formattedStory,
              message: SUCCESS_MESSAGES.STORY_UPDATED,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '更新故事失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Update story error:', error);
          const errorMessage = error.message || '更新故事失败';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'UPDATE_STORY_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 删除故事
      deleteStory: async (storyId) => {
        set({ loading: LOADING_STATES.LOADING, error: null });
        
        try {
          const response = await deleteStory(storyId);
          
          if (response.success) {
            // 从故事列表中移除
            set((state) => ({
              stories: state.stories.filter(story => story.id !== storyId),
              currentStory: state.currentStory?.id === storyId ? null : state.currentStory,
              loading: LOADING_STATES.SUCCESS,
              error: null,
            }));
            
            return {
              success: true,
              message: SUCCESS_MESSAGES.STORY_DELETED,
            };
          } else {
            set({
              loading: LOADING_STATES.ERROR,
              error: response.error?.message || '删除故事失败',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Delete story error:', error);
          const errorMessage = error.message || '删除故事失败';
          
          set({
            loading: LOADING_STATES.ERROR,
            error: errorMessage,
          });
          
          return {
            success: false,
            error: {
              type: 'DELETE_STORY_ERROR',
              message: errorMessage,
            },
          };
        }
      },
      
      // 获取故事章节列表
      fetchChapters: async (storyId) => {
        try {
          const response = await getStoryChapters(storyId);
          
          if (response.success) {
            const formattedChapters = response.data.map(formatChapterData);
            
            set({
              chapters: formattedChapters,
            });
            
            return {
              success: true,
              data: formattedChapters,
            };
          } else {
            return response;
          }
        } catch (error) {
          console.error('Fetch chapters error:', error);
          return {
            success: false,
            error: {
              type: 'FETCH_CHAPTERS_ERROR',
              message: error.message || '获取章节列表失败',
            },
          };
        }
      },
      
      // 获取章节详情
      fetchChapterById: async (storyId, chapterId) => {
        try {
          const response = await getChapterById(storyId, chapterId);
          
          if (response.success) {
            const formattedChapter = formatChapterData(response.data);
            
            set({
              currentChapter: formattedChapter,
            });
            
            return {
              success: true,
              data: formattedChapter,
            };
          } else {
            return response;
          }
        } catch (error) {
          console.error('Fetch chapter by id error:', error);
          return {
            success: false,
            error: {
              type: 'FETCH_CHAPTER_ERROR',
              message: error.message || '获取章节详情失败',
            },
          };
        }
      },
      
      // 获取选择历史
      fetchChoices: async (storyId) => {
        try {
          const response = await getStoryChoices(storyId);
          
          if (response.success) {
            set({
              choices: response.data,
            });
            
            return {
              success: true,
              data: response.data,
            };
          } else {
            return response;
          }
        } catch (error) {
          console.error('Fetch choices error:', error);
          return {
            success: false,
            error: {
              type: 'FETCH_CHOICES_ERROR',
              message: error.message || '获取选择历史失败',
            },
          };
        }
      },
      
      // 设置筛选条件
      setFilters: (newFilters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
          },
        }));
      },
      
      // 重置筛选条件
      resetFilters: () => {
        set({
          filters: {
            search: '',
            style: '',
            sort: 'updated_at',
          },
        });
      },
      
      // 设置当前故事
      setCurrentStory: (story) => {
        set({ currentStory: story });
      },
      
      // 设置当前章节
      setCurrentChapter: (chapter) => {
        set({ currentChapter: chapter });
      },
      
      // 添加新章节到列表
      addChapter: (chapter) => {
        const formattedChapter = formatChapterData(chapter);
        set((state) => ({
          chapters: [...state.chapters, formattedChapter],
          currentChapter: formattedChapter,
        }));
      },
      
      // 清除错误状态
      clearError: () => {
        set({ error: null });
      },
      
      // 重置状态
      reset: () => {
        set({
          stories: [],
          currentStory: null,
          currentChapter: null,
          chapters: [],
          choices: [],
          loading: LOADING_STATES.IDLE,
          error: null,
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
          filters: {
            search: '',
            style: '',
            sort: 'updated_at',
          },
        });
      },
    }),
    {
      name: 'stories-store',
      enabled: import.meta.env.DEV,
    }
  )
);

/**
 * 故事管理Hook
 * @returns {Object} 故事状态和方法
 */
export const useStories = () => {
  const {
    stories,
    currentStory,
    currentChapter,
    chapters,
    choices,
    loading,
    error,
    pagination,
    filters,
    fetchStories,
    createStory,
    fetchStoryById,
    updateStory,
    deleteStory,
    fetchChapters,
    fetchChapterById,
    fetchChoices,
    setFilters,
    resetFilters,
    setCurrentStory,
    setCurrentChapter,
    addChapter,
    clearError,
    reset,
  } = useStoriesStore();
  
  return {
    // 状态
    stories,
    currentStory,
    currentChapter,
    chapters,
    choices,
    loading,
    error,
    pagination,
    filters,
    
    // 计算属性
    isLoading: loading === LOADING_STATES.LOADING,
    isIdle: loading === LOADING_STATES.IDLE,
    isSuccess: loading === LOADING_STATES.SUCCESS,
    isError: loading === LOADING_STATES.ERROR,
    hasStories: stories.length > 0,
    hasChapters: chapters.length > 0,
    
    // 方法
    fetchStories,
    createStory,
    fetchStoryById,
    updateStory,
    deleteStory,
    fetchChapters,
    fetchChapterById,
    fetchChoices,
    setFilters,
    resetFilters,
    setCurrentStory,
    setCurrentChapter,
    addChapter,
    clearError,
    reset,
  };
};

export default useStories;