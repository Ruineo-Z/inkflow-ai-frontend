/**
 * 表单验证工具函数
 */

/**
 * 验证邮箱格式
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: '邮箱不能为空' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证用户名
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: '用户名不能为空' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: '用户名至少需要3个字符' };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: '用户名不能超过20个字符' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字、下划线和中文字符' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证密码强度
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: '密码不能为空' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: '密码至少需要6个字符' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: '密码不能超过50个字符' };
  }
  
  // 检查密码强度
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthScore = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (strengthScore < 2) {
    return { 
      isValid: false, 
      message: '密码强度太弱，建议包含大小写字母、数字和特殊字符' 
    };
  }
  
  return { isValid: true, message: '', strength: strengthScore };
};

/**
 * 验证确认密码
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: '请确认密码' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '两次输入的密码不一致' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证故事标题
 */
export const validateStoryTitle = (title) => {
  if (!title || !title.trim()) {
    return { isValid: false, message: '故事标题不能为空' };
  }
  
  if (title.trim().length < 2) {
    return { isValid: false, message: '故事标题至少需要2个字符' };
  }
  
  if (title.trim().length > 100) {
    return { isValid: false, message: '故事标题不能超过100个字符' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证故事描述
 */
export const validateStoryDescription = (description) => {
  if (!description || !description.trim()) {
    return { isValid: false, message: '故事描述不能为空' };
  }
  
  if (description.trim().length < 10) {
    return { isValid: false, message: '故事描述至少需要10个字符' };
  }
  
  if (description.trim().length > 500) {
    return { isValid: false, message: '故事描述不能超过500个字符' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证故事类型
 */
export const validateStoryCategory = (category) => {
  if (!category) {
    return { isValid: false, message: '请选择故事类型' };
  }
  
  const validCategories = [
    'fantasy', 'romance', 'mystery', 'adventure', 
    'horror', 'comedy', 'drama', 'sci-fi', 'other'
  ];
  
  if (!validCategories.includes(category)) {
    return { isValid: false, message: '请选择有效的故事类型' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证标签
 */
export const validateTags = (tags) => {
  if (!Array.isArray(tags)) {
    return { isValid: false, message: '标签格式不正确' };
  }
  
  if (tags.length > 10) {
    return { isValid: false, message: '标签数量不能超过10个' };
  }
  
  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      return { isValid: false, message: '标签不能为空' };
    }
    
    if (tag.trim().length > 20) {
      return { isValid: false, message: '单个标签不能超过20个字符' };
    }
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证章节数量
 */
export const validateChapterCount = (count) => {
  if (!count) {
    return { isValid: false, message: '请输入章节数量' };
  }
  
  const numCount = parseInt(count, 10);
  
  if (isNaN(numCount) || numCount < 1) {
    return { isValid: false, message: '章节数量必须是大于0的整数' };
  }
  
  if (numCount > 50) {
    return { isValid: false, message: '章节数量不能超过50章' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证手机号码
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: '手机号码不能为空' };
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '请输入有效的手机号码' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证URL
 */
export const validateUrl = (url) => {
  if (!url) {
    return { isValid: false, message: 'URL不能为空' };
  }
  
  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: '请输入有效的URL地址' };
  }
};

/**
 * 验证年龄
 */
export const validateAge = (age) => {
  if (!age) {
    return { isValid: false, message: '年龄不能为空' };
  }
  
  const numAge = parseInt(age, 10);
  
  if (isNaN(numAge) || numAge < 1 || numAge > 150) {
    return { isValid: false, message: '请输入有效的年龄（1-150）' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证文件大小
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, message: '请选择文件' };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { isValid: false, message: `文件大小不能超过${maxSizeMB}MB` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 验证文件类型
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) {
    return { isValid: false, message: '请选择文件' };
  }
  
  if (allowedTypes.length === 0) {
    return { isValid: true, message: '' };
  }
  
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  const isValidType = allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return fileName.endsWith(type);
    }
    return fileType.includes(type);
  });
  
  if (!isValidType) {
    return { 
      isValid: false, 
      message: `只支持以下文件类型：${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * 批量验证
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];
    
    for (const validator of validators) {
      const result = validator(value, data);
      
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break; // 只显示第一个错误
      }
    }
  }
  
  return { isValid, errors };
};

/**
 * 获取密码强度文本
 */
export const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 1:
      return { text: '弱', color: 'text-red-500' };
    case 2:
      return { text: '中等', color: 'text-yellow-500' };
    case 3:
      return { text: '强', color: 'text-green-500' };
    case 4:
      return { text: '很强', color: 'text-green-600' };
    default:
      return { text: '未知', color: 'text-gray-500' };
  }
};

export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateStoryTitle,
  validateStoryDescription,
  validateStoryCategory,
  validateTags,
  validateChapterCount,
  validatePhone,
  validateUrl,
  validateAge,
  validateFileSize,
  validateFileType,
  validateForm,
  getPasswordStrengthText
};