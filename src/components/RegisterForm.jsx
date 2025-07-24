import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/api'

/**
 * 注册表单组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onModeChange - 模式切换回调函数
 */
export const RegisterForm = ({ onModeChange }) => {
  const [username, setUsername] = useState('')
  const [validationError, setValidationError] = useState('')
  
  const login = useAuthStore((state) => state.login)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setError = useAuthStore((state) => state.setError)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  /**
   * 验证用户名格式
   * @param {string} name - 用户名
   * @returns {boolean} 验证结果
   */
  const validateUsername = (name) => {
    if (!name.trim()) {
      setValidationError('请输入用户名')
      return false
    }
    
    if (name.length < 3 || name.length > 20) {
      setValidationError('用户名长度应在3-20个字符之间')
      return false
    }
    
    // 只允许字母、数字和下划线
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(name)) {
      setValidationError('用户名只能包含字母、数字和下划线')
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
    
    if (!validateUsername(username)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.register(username)
      login(response)
    } catch (err) {
      setError(err.message || '注册失败，请重试')
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
    setUsername(value)
    
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
        <h2 className="text-2xl font-bold text-gray-900">注册</h2>
        <p className="text-gray-600 mt-2">创建您的 InkFlow AI 账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="请输入用户名（3-20个字符）"
            className="input-field"
            disabled={isLoading}
            maxLength={20}
          />
          {validationError && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            只能包含字母、数字和下划线
          </p>
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
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          已有账号？{' '}
          <button
            type="button"
            onClick={() => onModeChange?.('login')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
  )
}
