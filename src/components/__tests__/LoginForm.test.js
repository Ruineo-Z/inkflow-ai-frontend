import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'

// Mock dependencies
vi.mock('../../store/authStore')
vi.mock('../../services/api')

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockSetLoading = vi.fn()
  const mockSetError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    useAuthStore.mockReturnValue({
      login: mockLogin,
      setLoading: mockSetLoading,
      setError: mockSetError,
      isLoading: false,
      error: null,
    })
  })

  it('should render login form correctly', () => {
    render(<LoginForm />)

    expect(screen.getByRole('heading', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByLabelText('用户ID')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByText('还没有账号？')).toBeInTheDocument()
    expect(screen.getByText('立即注册')).toBeInTheDocument()
  })

  it('should handle user input correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const userIdInput = screen.getByLabelText('用户ID')
    
    await user.type(userIdInput, 'ABC123DEF456')
    
    expect(userIdInput).toHaveValue('ABC123DEF456')
  })

  it('should show validation error for empty user ID', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.click(submitButton)
    
    expect(screen.getByText('请输入用户ID')).toBeInTheDocument()
  })

  it('should show validation error for invalid user ID format', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const userIdInput = screen.getByLabelText('用户ID')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(userIdInput, '123')
    await user.click(submitButton)
    
    expect(screen.getByText('用户ID格式不正确')).toBeInTheDocument()
  })

  it('should submit login successfully', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      message: '登录成功',
      user: { username: 'testuser', user_id: 'ABC123DEF456' },
      token: 'test-token'
    }
    
    authAPI.login.mockResolvedValue(mockResponse)
    
    render(<LoginForm />)
    
    const userIdInput = screen.getByLabelText('用户ID')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(userIdInput, 'ABC123DEF456')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true)
      expect(authAPI.login).toHaveBeenCalledWith('ABC123DEF456')
      expect(mockLogin).toHaveBeenCalledWith(mockResponse)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should handle login error', async () => {
    const user = userEvent.setup()
    const errorMessage = '用户不存在'
    
    authAPI.login.mockRejectedValue(new Error(errorMessage))
    
    render(<LoginForm />)
    
    const userIdInput = screen.getByLabelText('用户ID')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(userIdInput, 'ABC123DEF456')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should show loading state during submission', () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      setLoading: mockSetLoading,
      setError: mockSetError,
      isLoading: true,
      error: null,
    })
    
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: '登录中...' })
    expect(submitButton).toBeDisabled()
  })

  it('should display error message', () => {
    const errorMessage = '登录失败'
    
    useAuthStore.mockReturnValue({
      login: mockLogin,
      setLoading: mockSetLoading,
      setError: mockSetError,
      isLoading: false,
      error: errorMessage,
    })
    
    render(<LoginForm />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should switch to register mode', async () => {
    const user = userEvent.setup()
    const mockOnModeChange = vi.fn()
    
    render(<LoginForm onModeChange={mockOnModeChange} />)
    
    const registerLink = screen.getByText('立即注册')
    
    await user.click(registerLink)
    
    expect(mockOnModeChange).toHaveBeenCalledWith('register')
  })
})
