import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { StoryReader } from './StoryReader'
import { storiesAPI } from '../services/api'

/**
 * 主仪表板页面
 */
export const Dashboard = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [stories, setStories] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' | 'reader'
  const [selectedStoryId, setSelectedStoryId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    logout()
  }

  /**
   * 加载用户故事列表
   */
  const loadStories = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await storiesAPI.getStories()
      console.log('Load Stories Response:', response) // 调试日志
      const stories = response.data?.stories || response.data || []
      console.log('Stories:', stories) // 调试日志
      setStories(stories)
    } catch (err) {
      console.error('Load stories error:', err)
      setError(err.message || '加载故事列表失败')
      setStories([]) // 确保stories始终是数组
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStory = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleSubmitStory = async (storyData) => {
    try {
      const response = await storiesAPI.createStory(storyData)
      console.log('API Response:', response) // 调试日志
      const newStory = response.data?.story || response.data
      console.log('New Story:', newStory) // 调试日志
      if (newStory) {
        setStories(prev => [newStory, ...(prev || [])])
      }
      setIsCreateModalOpen(false)
      alert('小说创建成功！')
      // 重新加载故事列表以确保数据同步
      loadStories()
    } catch (error) {
      console.error('Create story error:', error)
      alert('创建失败：' + error.message)
    }
  }

  const handleReadStory = (storyId) => {
    setSelectedStoryId(storyId)
    setCurrentView('reader')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedStoryId(null)
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadStories()
  }, [])

  // 如果是阅读模式，显示阅读器
  if (currentView === 'reader' && selectedStoryId) {
    return (
      <StoryReader
        storyId={selectedStoryId}
        onBack={handleBackToDashboard}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* 头部导航 */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>InkFlow AI</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                欢迎，{user?.username || '用户'}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>我的小说</h2>
            <p style={{ color: '#4b5563', marginTop: '0.25rem' }}>
              {stories && stories.length > 0 ? `共 ${stories.length} 部小说` : '还没有创建小说'}
            </p>
          </div>

          <button
            onClick={handleCreateStory}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>创建新小说</span>
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
            <button
              onClick={loadStories}
              style={{ color: '#dc2626', fontSize: '0.875rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              重新加载
            </button>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
            <div style={{ width: '2rem', height: '2rem', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>加载中...</span>
          </div>
        )}

        {/* 小说列表 */}
        {!isLoading && !error && (
          <>
            {stories && stories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {stories.map(story => (
              <div key={story.id} className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  {story.title}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                  <p>风格：{story.style}</p>
                  <p>章节：{story.current_chapter_number} 章</p>
                  <p>状态：{story.status === 'active' ? '进行中' : story.status}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => handleReadStory(story.id)}
                  >
                    继续阅读
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setStories(prev => prev.filter(s => s.id !== story.id))
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <svg style={{ margin: '0 auto', height: '3rem', width: '3rem', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>还没有小说</h3>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>开始创建您的第一部AI交互式小说吧！</p>
            <div style={{ marginTop: '1.5rem' }}>
              <button onClick={handleCreateStory} className="btn-primary">
                创建新小说
              </button>
            </div>
          </div>
            )}
          </>
        )}
      </main>

      {/* 创建小说模态框 */}
      {isCreateModalOpen && (
        <CreateNovelModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitStory}
        />
      )}
    </div>
  )
}

// 简单的创建小说模态框组件
const CreateNovelModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    style: '修仙',
    title: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>创建新小说</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              小说风格
            </label>
            <select
              value={formData.style}
              onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
              className="input-field"
            >
              <option value="修仙">修仙</option>
              <option value="武侠">武侠</option>
              <option value="科技">科技</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              小说标题 (可选)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="留空将自动生成标题"
              className="input-field"
              maxLength={50}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              取消
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              创建小说
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
