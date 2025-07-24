import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authAPI, storiesAPI } from '../api'

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('authAPI', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          message: '用户注册成功',
          user: { username: 'testuser', user_id: 'ABC123' },
          token: 'test-token'
        }
      }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse.data)
      })

      const result = await authAPI.register('testuser')
      
      expect(result).toEqual(mockResponse.data)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:20001/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser' })
        })
      )
    })

    it('should login user successfully', async () => {
      const mockResponse = {
        data: {
          message: '登录成功',
          user: { username: 'testuser', user_id: 'ABC123' },
          token: 'test-token'
        }
      }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse.data)
      })

      const result = await authAPI.login('ABC123')
      
      expect(result).toEqual(mockResponse.data)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:20001/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user_id: 'ABC123' })
        })
      )
    })
  })

  describe('storiesAPI', () => {
    it('should get user stories successfully', async () => {
      localStorage.setItem('token', 'test-token')

      const mockResponse = {
        success: true,
        data: { stories: [] }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await storiesAPI.getStories()

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:20001/api/stories/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      )
    })

    it('should create story successfully', async () => {
      const storyData = { style: '修仙', title: '测试小说' }
      const mockResponse = {
        success: true,
        data: { story: { id: 'story-123', ...storyData } }
      }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await storiesAPI.createStory(storyData)
      
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:20001/api/stories/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(storyData)
        })
      )
    })
  })
})
