import { useState } from 'react'
import { storiesAPI } from '../services/api'

/**
 * 小说卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.story - 小说数据
 * @param {Function} props.onDelete - 删除回调函数
 */
export const NovelCard = ({ story, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * 处理删除小说
   */
  const handleDelete = async () => {
    if (!window.confirm('确定要删除这个小说吗？此操作不可恢复。')) {
      return
    }

    setIsDeleting(true)
    try {
      await storiesAPI.deleteStory(story.id)
      onDelete?.(story.id)
    } catch (error) {
      console.error('删除小说失败:', error)
      alert('删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  /**
   * 格式化日期
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * 获取状态显示文本
   * @param {string} status - 状态
   * @returns {string} 显示文本
   */
  const getStatusText = (status) => {
    const statusMap = {
      active: '进行中',
      completed: '已完成',
      paused: '已暂停'
    }
    return statusMap[status] || status
  }

  /**
   * 获取状态样式
   * @param {string} status - 状态
   * @returns {string} CSS类名
   */
  const getStatusStyle = (status) => {
    const styleMap = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800'
    }
    return styleMap[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {story.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(story.status)}`}>
          {getStatusText(story.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">风格：</span>
          <span className="ml-1">{story.style}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">章节：</span>
          <span className="ml-1">{story.current_chapter_number} 章</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">创建：</span>
          <span className="ml-1">{formatDate(story.created_at)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="btn-primary flex-1"
          onClick={() => {
            // TODO: 导航到小说详情页
            console.log('查看小说:', story.id)
          }}
        >
          继续阅读
        </button>
        <button
          className="btn-secondary px-3"
          onClick={handleDelete}
          disabled={isDeleting}
          title="删除小说"
        >
          {isDeleting ? '删除中...' : '删除'}
        </button>
      </div>
    </div>
  )
}
