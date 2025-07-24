import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { storiesAPI, chaptersAPI } from '../services/api'

/**
 * 小说阅读页面
 */
export const StoryReader = ({ storyId, onBack }) => {
  const user = useAuthStore((state) => state.user)
  const [story, setStory] = useState(null)
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [choices, setChoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [customChoice, setCustomChoice] = useState('')

  /**
   * 加载故事和章节数据
   */
  const loadStoryData = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // 加载故事信息
      const storyResponse = await storiesAPI.getStory(storyId)
      setStory(storyResponse.data.story)
      
      // 加载章节列表
      const chaptersResponse = await storiesAPI.getChapters(storyId)
      const chaptersList = chaptersResponse.data.chapters
      setChapters(chaptersList)
      
      // 如果没有章节，生成第一章
      if (chaptersList.length === 0) {
        await generateFirstChapter()
      } else {
        // 显示最新章节
        const latestChapter = chaptersList[chaptersList.length - 1]
        setCurrentChapter(latestChapter)
        
        // 加载该章节的选择选项
        const choicesResponse = await chaptersAPI.getChoices(latestChapter.id)
        setChoices(choicesResponse.data.choices)
      }
    } catch (err) {
      setError(err.message || '加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 生成第一章
   */
  const generateFirstChapter = async () => {
    setIsGenerating(true)
    try {
      const response = await storiesAPI.generateChapter(storyId)
      const newChapter = response.data.chapter
      const newChoices = response.data.choices || []
      
      setChapters([newChapter])
      setCurrentChapter(newChapter)
      setChoices(newChoices)
    } catch (err) {
      setError(err.message || '生成章节失败')
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * 提交选择并生成下一章
   */
  const handleSubmitChoice = async (choiceId = null, customText = null) => {
    if (!currentChapter) return
    
    setIsGenerating(true)
    setError('')
    
    try {
      const choiceData = choiceId 
        ? { choice_id: choiceId }
        : { custom_choice: customText }
      
      const response = await chaptersAPI.submitChoice(currentChapter.id, choiceData)
      const nextChapter = response.data.next_chapter
      const nextChoices = response.data.choices || []
      
      // 更新章节列表
      setChapters(prev => [...prev, nextChapter])
      setCurrentChapter(nextChapter)
      setChoices(nextChoices)
      setCustomChoice('')
    } catch (err) {
      setError(err.message || '生成下一章失败')
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * 处理自定义选择提交
   */
  const handleCustomChoiceSubmit = () => {
    if (customChoice.trim()) {
      handleSubmitChoice(null, customChoice.trim())
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    if (storyId) {
      loadStoryData()
    }
  }, [storyId])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '2rem', height: '2rem', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* 头部导航 */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={onBack}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#4b5563'
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回
              </button>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                {story?.title || '小说阅读'}
              </h1>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              第 {currentChapter?.chapter_number || 0} 章
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {currentChapter && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              {currentChapter.title}
            </h2>
            <div style={{ 
              fontSize: '1.125rem', 
              lineHeight: '1.75', 
              color: '#374151',
              whiteSpace: 'pre-wrap'
            }}>
              {currentChapter.content}
            </div>
          </div>
        )}

        {/* 选择选项 */}
        {choices.length > 0 && !isGenerating && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              选择你的行动：
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {choices.map((choice, index) => (
                <button
                  key={choice.id}
                  onClick={() => handleSubmitChoice(choice.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6'
                    e.target.style.borderColor = '#3b82f6'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.borderColor = '#d1d5db'
                  }}
                >
                  {index + 1}. {choice.text}
                </button>
              ))}
            </div>

            {/* 自定义选择 */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                或者输入你的自定义选择：
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={customChoice}
                  onChange={(e) => setCustomChoice(e.target.value)}
                  placeholder="输入你想要的行动..."
                  className="input-field"
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomChoiceSubmit()
                    }
                  }}
                />
                <button
                  onClick={handleCustomChoiceSubmit}
                  disabled={!customChoice.trim()}
                  className="btn-primary"
                  style={{ opacity: customChoice.trim() ? 1 : 0.5 }}
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 生成中状态 */}
        {isGenerating && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '2rem', height: '2rem', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>正在生成下一章节...</p>
          </div>
        )}
      </main>
    </div>
  )
}
