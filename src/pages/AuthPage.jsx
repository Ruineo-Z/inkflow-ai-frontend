import { useState } from 'react'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'

/**
 * 认证页面组件
 * 包含登录和注册功能的切换
 */
export const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm onModeChange={setMode} />
        ) : (
          <RegisterForm onModeChange={setMode} />
        )}
      </div>
    </div>
  )
}
