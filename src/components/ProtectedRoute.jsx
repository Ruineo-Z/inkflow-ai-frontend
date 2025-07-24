import { useAuthStore } from '../store/authStore'

/**
 * 路由保护组件
 * 只有已认证用户才能访问受保护的路由
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return null // 或者返回加载组件
  }

  return children
}
