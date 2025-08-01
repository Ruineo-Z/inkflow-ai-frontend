import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  VStack, 
  Button, 
  Heading, 
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

/**
 * 首页组件 - 极简版
 */
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const shadowColor = useColorModeValue('xl', 'dark-lg');

  return (
    <Box 
      minH="calc(100vh - 64px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <Box
        bg={cardBg}
        p={8}
        borderRadius="2xl"
        boxShadow={shadowColor}
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        backdropFilter="blur(10px)"
        w="full"
        maxW="400px"
      >
        <VStack spacing={6}>
          <VStack spacing={3} textAlign="center">
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
              bgClip="text"
              fontWeight="bold"
            >
              InkFlow AI
            </Heading>
            <Text 
              fontSize="md" 
              color={useColorModeValue('gray.600', 'gray.300')}
              maxW="300px"
            >
              {user ? '欢迎回来！开始您的创作之旅' : 'AI驱动的故事创作平台'}
            </Text>
          </VStack>
          
          <Flex 
            gap={4} 
            direction={{ base: 'column', sm: 'row' }}
            w="full"
            justify="center"
          >
            {user ? (
              <>
                <Button 
                  colorScheme="blue"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  flex={1}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  进入控制台
                </Button>
                <Button 
                  colorScheme="green"
                  size="lg"
                  onClick={() => navigate('/create-story')}
                  flex={1}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  创作故事
                </Button>
              </>
            ) : (
              <>
                <Button 
                  colorScheme="purple"
                  size="lg"
                  onClick={() => navigate('/register')}
                  flex={1}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  开始使用
                </Button>
                <Button 
                  variant="outline"
                  colorScheme="gray"
                  size="lg"
                  onClick={() => navigate('/login')}
                  flex={1}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  登录
                </Button>
              </>
            )}
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;