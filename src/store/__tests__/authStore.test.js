import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // 重置store状态
    useAuthStore.getState().logout()
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set loading state', () => {
    const { setLoading } = useAuthStore.getState()
    
    setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)
    
    setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('should set error state', () => {
    const { setError } = useAuthStore.getState()
    const errorMessage = '登录失败'
    
    setError(errorMessage)
    expect(useAuthStore.getState().error).toBe(errorMessage)
    
    setError(null)
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('should login successfully', () => {
    const { login } = useAuthStore.getState()
    const userData = {
      user: { username: 'testuser', user_id: 'ABC123' },
      token: 'test-token'
    }
    
    login(userData)
    
    const state = useAuthStore.getState()
    expect(state.user).toEqual(userData.user)
    expect(state.token).toBe(userData.token)
    expect(state.isAuthenticated).toBe(true)
    expect(state.error).toBeNull()
    expect(localStorage.setItem).toHaveBeenCalledWith('token', userData.token)
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(userData.user))
  })

  it('should logout successfully', () => {
    const { login, logout } = useAuthStore.getState()
    
    // 先登录
    login({
      user: { username: 'testuser', user_id: 'ABC123' },
      token: 'test-token'
    })
    
    // 然后登出
    logout()
    
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('should initialize from localStorage', () => {
    const userData = { username: 'testuser', user_id: 'ABC123' }
    const token = 'stored-token'
    
    localStorage.getItem = vi.fn((key) => {
      if (key === 'token') return token
      if (key === 'user') return JSON.stringify(userData)
      return null
    })
    
    const { initializeAuth } = useAuthStore.getState()
    initializeAuth()
    
    const state = useAuthStore.getState()
    expect(state.user).toEqual(userData)
    expect(state.token).toBe(token)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should handle invalid localStorage data', () => {
    localStorage.getItem = vi.fn((key) => {
      if (key === 'user') return 'invalid-json'
      return null
    })
    
    const { initializeAuth } = useAuthStore.getState()
    initializeAuth()
    
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
