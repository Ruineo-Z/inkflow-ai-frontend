/**
 * InkFlow AI 前端常量定义
 * 包含API端点、故事风格、应用配置等常量
 */

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:20001/api',
  DOCS_URL: import.meta.env.VITE_API_DOCS_URL || 'http://localhost:20001/docs',
  TIMEOUT: 30000, // 30秒超时
};

// API 端点
export const API_ENDPOINTS = {
  // 用户认证
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    USER_INFO: '/auth/me',
  },
  
  // 故事管理
  STORIES: {
    LIST: '/stories',
    CREATE: '/stories',
    DETAIL: (id) => `/stories/${id}`,
    DELETE: (id) => `/stories/${id}`,
  },
  
  // 章节管理
  CHAPTERS: {
    LIST: (storyId) => `/stories/${storyId}/chapters`,
    DETAIL: (storyId, chapterId) => `/stories/${storyId}/chapters/${chapterId}`,
    GENERATE_STREAM: (storyId) => `/stories/${storyId}/chapters/generate/stream`,
  },
  
  // 选择管理
  CHOICES: {
    HISTORY: (storyId) => `/stories/${storyId}/choices`,
    SUBMIT: (storyId, chapterId) => `/stories/${storyId}/chapters/${chapterId}/choice`,
  },
  
  // 系统
  SYSTEM: {
    HEALTH: '/health',
  },
};

// 故事风格配置
export const STORY_STYLES = {
  CULTIVATION: {
    id: 'cultivation',
    name: '修仙',
    description: '仙侠修真，逆天改命，追求长生不老的修仙之路',
    icon: '⚔️',
    color: '#8B5CF6',
  },
  URBAN: {
    id: 'urban',
    name: '都市',
    description: '现代都市生活，商战情场，现实与梦想的碰撞',
    icon: '🏙️',
    color: '#3B82F6',
  },
  SCIFI: {
    id: 'scifi',
    name: '科幻',
    description: '未来科技，星际探索，人工智能与人类的博弈',
    icon: '🚀',
    color: '#06B6D4',
  },
  FANTASY: {
    id: 'fantasy',
    name: '奇幻',
    description: '魔法世界，龙与地下城，英雄的冒险传说',
    icon: '🐉',
    color: '#10B981',
  },
  MYSTERY: {
    id: 'mystery',
    name: '悬疑',
    description: '推理解谜，心理悬疑，真相背后的黑暗秘密',
    icon: '🔍',
    color: '#F59E0B',
  },
  ROMANCE: {
    id: 'romance',
    name: '言情',
    description: '浪漫爱情，情感纠葛，心动时刻的甜蜜故事',
    icon: '💕',
    color: '#EC4899',
  },
};

// 获取故事风格数组
export const STORY_STYLES_ARRAY = Object.values(STORY_STYLES);

// 应用配置
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'InkFlow AI',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: 'AI驱动的互动小说生成平台',
};

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'inkflow_auth_token',
  USER_INFO: 'inkflow_user_info',
  READING_PROGRESS: 'inkflow_reading_progress',
  THEME_PREFERENCE: 'inkflow_theme',
  FONT_SIZE: 'inkflow_font_size',
};

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STORIES: '/stories',
  STORY_CREATE: '/stories/create',
  STORY_DETAIL: '/stories/:id',
  STORY_READ: '/stories/:id/read',
  CHAPTER_DETAIL: '/stories/:id/chapters/:chapterId',
  GENERATE_CHAPTER: '/stories/:id/generate',
  CHOICE_HISTORY: '/stories/:id/choices',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

// 生成路由路径的辅助函数
export const generateRoute = {
  storyDetail: (id) => `/stories/${id}`,
  storyRead: (id) => `/stories/${id}/read`,
  chapterDetail: (storyId, chapterId) => `/stories/${storyId}/chapters/${chapterId}`,
  generateChapter: (id) => `/stories/${id}/generate`,
  choiceHistory: (id) => `/stories/${id}/choices`,
};

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  GENERATION_ERROR: '章节生成失败，请重试',
  UNKNOWN_ERROR: '未知错误，请联系客服',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  STORY_CREATED: '故事创建成功',
  STORY_DELETED: '故事删除成功',
  CHAPTER_GENERATED: '章节生成完成',
  CHOICE_SUBMITTED: '选择提交成功',
};

// 加载状态
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// 章节生成事件类型
export const GENERATION_EVENTS = {
  START: 'start',
  TITLE: 'title',
  CONTENT: 'content',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// 章节生成事件常量
export const CHAPTER_GENERATION_EVENTS = {
  GENERATION_STARTED: 'generation_started',
  GENERATION_PROGRESS: 'generation_progress',
  GENERATION_COMPLETED: 'generation_completed',
  GENERATION_FAILED: 'generation_failed',
  GENERATION_CANCELLED: 'generation_cancelled',
};

// 主题配置
export const THEMES = {
  LIGHT: {
    id: 'light',
    name: '日间模式',
    primary: '#3B82F6',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  DARK: {
    id: 'dark',
    name: '夜间模式',
    primary: '#60A5FA',
    background: '#111827',
    text: '#F9FAFB',
  },
};

// 字体大小配置
export const FONT_SIZES = {
  SMALL: { id: 'small', name: '小', size: '14px' },
  MEDIUM: { id: 'medium', name: '中', size: '16px' },
  LARGE: { id: 'large', name: '大', size: '18px' },
  EXTRA_LARGE: { id: 'extra-large', name: '特大', size: '20px' },
};