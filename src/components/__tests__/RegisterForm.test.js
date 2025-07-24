import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'

// Mock dependencies
vi.mock('../../store/authStore')
vi.mock('../../services/api')

describe('RegisterForm', () => {
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

  it('should render register form correctly', () => {
    render(<RegisterForm />)

    expect(screen.getByRole('heading', { name: '注册' })).toBeInTheDocument()
    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument()
    expect(screen.getByText('已有账号？')).toBeInTheDocument()
    expect(screen.getByText('立即登录')).toBeInTheDocument()
  })

  it('should handle user input correctly', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText('用户名')
    
    await user.type(usernameInput, 'testuser')
    
    expect(usernameInput).toHaveValue('testuser')
  })

  it('should show validation error for empty username', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: '注册' })
    
    await user.click(submitButton)
    
    expect(screen.getByText('请输入用户名')).toBeInTheDocument()
  })

  it('should show validation error for short username', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText('用户名')
    const submitButton = screen.getByRole('button', { name: '注册' })
    
    await user.type(usernameInput, 'ab')
    await user.click(submitButton)
    
    expect(screen.getByText('用户名长度应在3-20个字符之间')).toBeInTheDocument()
  })

  it('should show validation error for invalid username characters', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText('用户名')
    const submitButton = screen.getByRole('button', { name: '注册' })
    
    await user.type(usernameInput, 'test@user')
    await user.click(submitButton)
    
    expect(screen.getByText('用户名只能包含字母、数字和下划线')).toBeInTheDocument()
  })

  it('should submit registration successfully', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      message: '用户注册成功',
      user: { username: 'testuser', user_id: 'ABC123DEF456' },
      token: 'test-token'
    }
    
    authAPI.register.mockResolvedValue(mockResponse)
    
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText('用户名')
    const submitButton = screen.getByRole('button', { name: '注册' })
    
    await user.type(usernameInput, 'testuser')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true)
      expect(authAPI.register).toHaveBeenCalledWith('testuser')
      expect(mockLogin).toHaveBeenCalledWith(mockResponse)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should handle registration error', async () => {
    const user = userEvent.setup()
    const errorMessage = '用户名已存在'
    
    authAPI.register.mockRejectedValue(new Error(errorMessage))
    
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText('用户名')
    const submitButton = screen.getByRole('button', { name: '注册' })
    
    await user.type(usernameInput, 'testuser')
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
    
    render(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: '注册中...' })
    expect(submitButton).toBeDisabled()
  })

  it('should switch to login mode', async () => {
    const user = userEvent.setup()
    const mockOnModeChange = vi.fn()
    
    render(<RegisterForm onModeChange={mockOnModeChange} />)
    
    const loginLink = screen.getByText('立即登录')
    
    await user.click(loginLink)
    
    expect(mockOnModeChange).toHaveBeenCalledWith('login')
  })
})
