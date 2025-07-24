import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/api'

/**
 * 登录表单组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onModeChange - 模式切换回调函数
 */
export const LoginForm = ({ onModeChange }) => {
  const [userId, setUserId] = useState('')
  const [validationError, setValidationError] = useState('')
  
  const login = useAuthStore((state) => state.login)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setError = useAuthStore((state) => state.setError)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  /**
   * 验证用户ID格式
   * @param {string} id - 用户ID
   * @returns {boolean} 验证结果
   */
  const validateUserId = (id) => {
    if (!id.trim()) {
      setValidationError('请输入用户ID')
      return false
    }
    
    // 用户ID应该是12位字符
    if (id.length !== 12) {
      setValidationError('用户ID格式不正确')
      return false
    }
    
    setValidationError('')
    return true
  }

  /**
   * 处理表单提交
   * @param {Event} e - 表单事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateUserId(userId)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(userId)
      login(response)
    } catch (err) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 处理输入变化
   * @param {Event} e - 输入事件
   */
  const handleInputChange = (e) => {
    const value = e.target.value
    setUserId(value)
    
    // 清除验证错误
    if (validationError) {
      setValidationError('')
    }
    
    // 清除API错误
    if (error) {
      setError(null)
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">登录</h2>
        <p className="text-gray-600 mt-2">欢迎回到 InkFlow AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            用户ID
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={handleInputChange}
            placeholder="请输入您的12位用户ID"
            className="input-field"
            disabled={isLoading}
            maxLength={12}
          />
          {validationError && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          还没有账号？{' '}
          <button
            type="button"
            onClick={() => onModeChange?.('register')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            立即注册
          </button>
        </p>
      </div>
    </div>
  )
}
