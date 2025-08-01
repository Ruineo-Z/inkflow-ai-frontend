import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { StoriesProvider } from './contexts/StoriesContext';
import { ChapterGenerationProvider } from './contexts/ChapterGenerationContext';
import App from './App.jsx';
import './index.css';

// 创建Chakra UI主题
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

/**
 * 应用入口文件
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <StoriesProvider>
          <ChapterGenerationProvider>
            <App />
          </ChapterGenerationProvider>
        </StoriesProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
