import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import router from './router';

/**
 * 应用主组件
 */
function App() {
  const { initAuth } = useAuth();
  
  // 初始化认证状态
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  return (
    <div className="app-container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
