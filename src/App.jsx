import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

/**
 * 主应用组件
 */
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  // 应用启动时初始化认证状态
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div className="App">
      {isAuthenticated ? (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ) : (
        <AuthPage />
      )}
    </div>
  )
}

export default App
