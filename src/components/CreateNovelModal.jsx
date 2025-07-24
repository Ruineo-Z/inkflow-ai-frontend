import { useState } from 'react'
import { storiesAPI } from '../services/api'

/**
 * 创建小说模态框组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOpen - 是否打开
 * @param {Function} props.onClose - 关闭回调
 * @param {Function} props.onSuccess - 成功回调
 */
export const CreateNovelModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    style: '修仙',
    title: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const styles = [
    { value: '修仙', label: '修仙' },
    { value: '武侠', label: '武侠' },
    { value: '科技', label: '科技' }
  ]

  /**
   * 处理输入变化
   * @param {Event} e - 输入事件
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除错误信息
    if (error) {
      setError('')
    }
  }

  /**
   * 处理表单提交
   * @param {Event} e - 表单事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setError('')

    try {
      const response = await storiesAPI.createStory(formData)
      onSuccess?.(response.data.story)
      handleClose()
    } catch (err) {
      setError(err.message || '创建失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 处理关闭
   */
  const handleClose = () => {
    setFormData({ style: '修仙', title: '' })
    setError('')
    setIsSubmitting(false)
    onClose?.()
  }

  /**
   * 处理背景点击
   * @param {Event} e - 点击事件
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="card max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">创建新小说</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
              小说风格
            </label>
            <select
              id="style"
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              className="input-field"
              disabled={isSubmitting}
            >
              {styles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              小说标题 <span className="text-gray-500">(可选)</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="留空将自动生成标题"
              className="input-field"
              disabled={isSubmitting}
              maxLength={50}
            />
            <p className="text-gray-500 text-xs mt-1">
              如果不填写标题，系统将根据风格自动生成
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '创建中...' : '创建小说'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
