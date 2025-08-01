import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStories } from '../hooks/useStories';
import { useChapterGeneration } from '../hooks/useChapterGeneration';
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Card, 
  CardBody, 
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from '../components/ui';

/**
 * 故事创建页面组件
 */
const CreateStory = () => {
  const navigate = useNavigate();
  const { createStory, loading: storyLoading } = useStories();
  const { 
    generateFirstChapter, 
    loading: generationLoading, 
    progress, 
    title: generatedTitle,
    content: generatedContent,
    error: generationError,
    reset: resetGeneration
  } = useChapterGeneration();
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    tags: [],
    prompt: '',
    isPublic: true
  });
  
  // 错误状态
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  // 预览模态框状态
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  
  // 生成模态框状态
  const [generationModalOpen, setGenerationModalOpen] = useState(false);
  
  // 可选的故事类型
  const genreOptions = [
    { value: 'fantasy', label: '奇幻' },
    { value: 'scifi', label: '科幻' },
    { value: 'adventure', label: '冒险' },
    { value: 'mystery', label: '悬疑' },
    { value: 'horror', label: '恐怖' },
    { value: 'romance', label: '爱情' },
    { value: 'historical', label: '历史' },
    { value: 'comedy', label: '喜剧' },
    { value: 'drama', label: '戏剧' },
    { value: 'thriller', label: '惊悚' },
    { value: 'crime', label: '犯罪' },
    { value: 'action', label: '动作' },
    { value: 'other', label: '其他' }
  ];
  
  // 可选的标签
  const tagOptions = [
    { value: 'magic', label: '魔法' },
    { value: 'space', label: '太空' },
    { value: 'future', label: '未来' },
    { value: 'medieval', label: '中世纪' },
    { value: 'dystopian', label: '反乌托邦' },
    { value: 'utopian', label: '乌托邦' },
    { value: 'supernatural', label: '超自然' },
    { value: 'detective', label: '侦探' },
    { value: 'war', label: '战争' },
    { value: 'postapocalyptic', label: '后启示录' },
    { value: 'cyberpunk', label: '赛博朋克' },
    { value: 'steampunk', label: '蒸汽朋克' },
    { value: 'mythology', label: '神话' },
    { value: 'urban', label: '都市' },
    { value: 'youngadult', label: '青少年' },
    { value: 'children', label: '儿童' },
    { value: 'adult', label: '成人' },
    { value: 'psychological', label: '心理' },
    { value: 'philosophical', label: '哲学' },
    { value: 'political', label: '政治' },
    { value: 'educational', label: '教育' },
    { value: 'interactive', label: '互动' }
  ];
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // 清除提交错误
    if (submitError) {
      setSubmitError('');
    }
  };
  
  // 处理标签变化
  const handleTagsChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions.map(option => option.value)
    }));
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入故事标题';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请输入故事描述';
    }
    
    if (!formData.genre) {
      newErrors.genre = '请选择故事类型';
    }
    
    if (!formData.prompt.trim()) {
      newErrors.prompt = '请输入故事提示';
    } else if (formData.prompt.length < 20) {
      newErrors.prompt = '故事提示太短，请提供更详细的描述';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理预览
  const handlePreview = () => {
    if (validateForm()) {
      setPreviewModalOpen(true);
    }
  };
  
  // 处理生成第一章
  const handleGenerateFirstChapter = async () => {
    if (validateForm()) {
      setGenerationModalOpen(true);
      try {
        await generateFirstChapter(formData);
      } catch (error) {
        console.error('生成章节失败:', error);
      }
    }
  };
  
  // 处理创建故事
  const handleCreateStory = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const storyData = {
        ...formData,
        firstChapter: {
          title: generatedTitle,
          content: generatedContent
        }
      };
      
      const createdStory = await createStory(storyData);
      setGenerationModalOpen(false);
      resetGeneration();
      navigate(`/story/${createdStory.id}`);
    } catch (error) {
      setSubmitError(error.message || '创建故事失败，请稍后重试');
    }
  };
  
  // 处理取消
  const handleCancel = () => {
    if (window.confirm('确定要取消创建吗？所有输入的内容将丢失。')) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="page create-story-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">创建新故事</h1>
          <p className="page-subtitle">
            填写故事信息，AI将帮助您生成第一章内容
          </p>
        </div>
      </div>
      
      {/* 创建表单 */}
      <div className="create-story-form">
        <Card>
          <CardBody>
            <form>
              {/* 全局错误提示 */}
              {submitError && (
                <div className="error-message global-error">
                  {submitError}
                </div>
              )}
              
              {/* 基本信息 */}
              <div className="form-section">
                <h2 className="section-title">基本信息</h2>
                
                <Input
                  type="text"
                  name="title"
                  label="故事标题"
                  placeholder="输入一个吸引人的标题"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                />
                
                <Textarea
                  name="description"
                  label="故事描述"
                  placeholder="简要描述您的故事内容和特点"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  rows={3}
                  maxLength={200}
                  showCount
                  required
                />
                
                <Select
                  name="genre"
                  label="故事类型"
                  placeholder="选择一个主要类型"
                  options={genreOptions}
                  value={formData.genre}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, genre: value }));
                  }}
                  error={errors.genre}
                  required
                />
                
                <Select
                  name="tags"
                  label="标签"
                  placeholder="选择相关标签（可多选）"
                  options={tagOptions}
                  value={formData.tags}
                  onChange={handleTagsChange}
                  multiple
                  helpText="最多选择5个标签"
                />
              </div>
              
              {/* 故事提示 */}
              <div className="form-section">
                <h2 className="section-title">故事提示</h2>
                <p className="section-description">
                  详细描述您的故事背景、主要角色和情节走向，AI将根据您的提示生成第一章内容。
                </p>
                
                <Textarea
                  name="prompt"
                  label="故事提示"
                  placeholder="描述您的故事世界、主要角色、情节走向等..."
                  value={formData.prompt}
                  onChange={handleChange}
                  error={errors.prompt}
                  rows={6}
                  maxLength={2000}
                  showCount
                  helpText="提示越详细，生成的内容越符合您的期望"
                  required
                />
              </div>
              
              {/* 发布设置 */}
              <div className="form-section">
                <h2 className="section-title">发布设置</h2>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="checkbox"
                    />
                    <span className="checkbox-text">
                      公开发布（其他用户可以阅读您的故事）
                    </span>
                  </label>
                </div>
              </div>
              
              {/* 表单操作 */}
              <div className="form-actions">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleCancel}
                  disabled={storyLoading || generationLoading}
                >
                  取消
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePreview}
                  disabled={storyLoading || generationLoading}
                >
                  预览
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerateFirstChapter}
                  loading={generationLoading}
                  disabled={storyLoading || generationLoading}
                >
                  生成第一章
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
      
      {/* 预览模态框 */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        size="lg"
      >
        <ModalHeader>
          故事预览
        </ModalHeader>
        <ModalBody>
          <div className="story-preview">
            <h2 className="preview-title">{formData.title}</h2>
            <div className="preview-meta">
              <span className="preview-genre">{genreOptions.find(g => g.value === formData.genre)?.label || formData.genre}</span>
              <div className="preview-tags">
                {formData.tags.map(tag => (
                  <span key={tag} className="preview-tag">
                    {tagOptions.find(t => t.value === tag)?.label || tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="preview-description">{formData.description}</p>
            <div className="preview-prompt">
              <h3>故事提示：</h3>
              <p>{formData.prompt}</p>
            </div>
            <div className="preview-settings">
              <p><strong>发布状态：</strong> {formData.isPublic ? '公开' : '私密'}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setPreviewModalOpen(false)}
          >
            返回编辑
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerateFirstChapter}
          >
            生成第一章
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* 生成模态框 */}
      <Modal
        isOpen={generationModalOpen}
        onClose={() => {
          if (!generationLoading) {
            setGenerationModalOpen(false);
            resetGeneration();
          }
        }}
        size="lg"
        closeOnEsc={!generationLoading}
        closeOnOverlayClick={!generationLoading}
      >
        <ModalHeader>
          {generationLoading ? '正在生成第一章...' : '第一章已生成'}
        </ModalHeader>
        <ModalBody>
          {generationLoading ? (
            <div className="generation-loading">
              <Spinner size="lg" />
              <div className="generation-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="generation-status">
                {progress < 30 && '正在分析故事提示...'}
                {progress >= 30 && progress < 60 && '正在构思情节...'}
                {progress >= 60 && progress < 90 && '正在生成内容...'}
                {progress >= 90 && '即将完成...'}
              </p>
            </div>
          ) : generationError ? (
            <div className="generation-error">
              <p className="error-message">
                生成章节时出错：{generationError}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  resetGeneration();
                  handleGenerateFirstChapter();
                }}
              >
                重试
              </Button>
            </div>
          ) : (
            <div className="generated-chapter">
              <h2 className="chapter-title">{generatedTitle}</h2>
              <div className="chapter-content">
                {generatedContent.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        {!generationLoading && !generationError && (
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setGenerationModalOpen(false);
                resetGeneration();
              }}
            >
              重新生成
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateStory}
              loading={storyLoading}
              disabled={storyLoading}
            >
              {storyLoading ? '创建中...' : '创建故事'}
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
};

export default CreateStory;