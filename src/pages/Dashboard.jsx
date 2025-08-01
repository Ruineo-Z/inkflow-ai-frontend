import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStories } from '../hooks/useStories';
import { Button, Card, CardBody, CardTitle, CardText, Spinner } from '../components/ui';
import { formatDate, formatNumber } from '../utils';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { stories, loading, error, fetchStories } = useStories();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <Spinner size="lg" />
            <p className="ml-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                欢迎回来，{user?.name || '用户'}！
              </h1>
              <p className="text-gray-600">开始创作你的互动故事</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => navigate('/create-story')}
                className="btn-primary"
              >
                创建新故事
              </Button>
              <Button
                onClick={logout}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="simple-card">
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">总故事数</p>
                <p className="text-gray-900 text-xl font-semibold">{stories.length}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="simple-card">
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">进行中</p>
                <p className="text-gray-900 text-xl font-semibold">
                  {stories.filter(story => story.status === 'draft').length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="simple-card">
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">已完成</p>
                <p className="text-gray-900 text-xl font-semibold">
                  {stories.filter(story => story.status === 'published').length}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 快速操作 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/create-story')}
              className="btn-primary p-4 text-left"
            >
              <div>
                <div className="font-semibold">创建新故事</div>
                <div className="text-sm opacity-80">开始你的创作之旅</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/my-stories')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 text-left transition-colors"
            >
              <div>
                <div className="font-semibold">我的故事</div>
                <div className="text-sm opacity-80">查看所有作品</div>
              </div>
            </Button>
          </div>
        </div>

        {/* 最近的故事 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">最近的故事</h2>
            <Link to="/my-stories" className="text-blue-600 hover:text-blue-800 text-sm">
              查看全部 →
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              加载故事失败：{error}
            </div>
          )}
          
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.slice(0, 6).map((story) => (
                <Card key={story.id} className="simple-card hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-gray-900 font-semibold text-sm line-clamp-2 flex-1">
                        {story.title}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded text-xs ${
                        story.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {story.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    
                    <CardText className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {story.description}
                    </CardText>
                    
                    <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
                      <span>{formatDate(story.updatedAt)}</span>
                      <span>{formatNumber(story.viewCount || 0)} 阅读</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/story/${story.id}/edit`)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 flex-1"
                      >
                        编辑
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/story/${story.id}`)}
                        className="btn-primary text-xs px-3 py-1 flex-1"
                      >
                        查看
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="simple-card text-center py-8">
              <CardBody>
                <div className="text-4xl mb-3">📝</div>
                <CardTitle className="text-gray-900 text-lg mb-2">还没有故事</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  开始创作你的第一个互动故事吧！
                </CardText>
                <Button 
                  onClick={() => navigate('/create-story')}
                  className="btn-primary"
                >
                  创建故事
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;