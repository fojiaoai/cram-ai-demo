import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NavigationBar from '@/components/navigation-bar'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Search,
  Filter,
  TrendingUp,
  Users,
  Star,
  Eye,
  ThumbsUp,
  Clock,
  Tag
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Community() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const communityPosts = [
    {
      id: 1,
      author: {
        name: "张明",
        avatar: "/avatars/avatar1.svg",
        badge: "AI专家"
      },
      title: "如何使用AI分析视频内容提升学习效率",
      content: "分享我使用Cram AI分析教学视频的经验，通过智能摘要和关键点提取，学习效率提升了300%...",
      tags: ["AI分析", "学习技巧", "视频处理"],
      stats: {
        likes: 156,
        comments: 23,
        views: 1240,
        bookmarks: 45
      },
      timestamp: "2小时前",
      type: "经验分享"
    },
    {
      id: 2,
      author: {
        name: "李华",
        avatar: "/avatars/avatar2.svg",
        badge: "内容创作者"
      },
      title: "PDF文档智能分析最佳实践",
      content: "整理了一套完整的PDF文档分析流程，包括预处理、关键信息提取、智能问答生成等步骤...",
      tags: ["PDF分析", "文档处理", "最佳实践"],
      stats: {
        likes: 89,
        comments: 12,
        views: 856,
        bookmarks: 34
      },
      timestamp: "5小时前",
      type: "教程"
    },
    {
      id: 3,
      author: {
        name: "王芳",
        avatar: "/avatars/avatar3.svg",
        badge: "研究员"
      },
      title: "AI驱动的内容分析在学术研究中的应用",
      content: "探讨如何将AI内容分析技术应用到学术研究中，提高文献综述和数据分析的效率...",
      tags: ["学术研究", "文献分析", "AI应用"],
      stats: {
        likes: 203,
        comments: 31,
        views: 1890,
        bookmarks: 67
      },
      timestamp: "1天前",
      type: "研究分享"
    }
  ]

  const trendingTopics = [
    { name: "AI分析技巧", count: 1234 },
    { name: "视频学习", count: 856 },
    { name: "文档处理", count: 645 },
    { name: "学习效率", count: 523 },
    { name: "内容创作", count: 412 }
  ]

  const featuredCreators = [
    {
      name: "AI教学专家",
      avatar: "/avatars/avatar1.svg",
      followers: "12.5K",
      specialty: "AI技术教学"
    },
    {
      name: "学习方法达人",
      avatar: "/avatars/avatar2.svg",
      followers: "8.9K",
      specialty: "高效学习法"
    },
    {
      name: "内容分析师",
      avatar: "/avatars/avatar3.svg",
      followers: "15.2K",
      specialty: "数据分析"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Community Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                社区广场
              </h1>
              <p className="text-gray-600">
                与其他用户分享经验，探讨AI分析技巧，共同成长
              </p>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="latest" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="latest">最新</TabsTrigger>
                <TabsTrigger value="trending">热门</TabsTrigger>
                <TabsTrigger value="following">关注</TabsTrigger>
                <TabsTrigger value="bookmarked">收藏</TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-6">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">
                                {post.author.name}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {post.author.badge}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{post.timestamp}</span>
                              <Badge variant="outline" className="text-xs">
                                {post.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.stats.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.stats.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.stats.comments}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            点赞
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            评论
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            分享
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending">
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">热门内容</h3>
                  <p className="text-gray-500">热门内容正在加载中...</p>
                </div>
              </TabsContent>

              <TabsContent value="following">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">关注动态</h3>
                  <p className="text-gray-500">关注更多创作者来查看他们的最新动态</p>
                </div>
              </TabsContent>

              <TabsContent value="bookmarked">
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">我的收藏</h3>
                  <p className="text-gray-500">收藏感兴趣的内容，方便随时查看</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        #{topic.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {topic.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  推荐创作者
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredCreators.map((creator, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {creator.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {creator.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-900">
                          {creator.followers}
                        </p>
                        <Button variant="outline" size="sm" className="mt-1">
                          关注
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  发布新内容
                </Button>
                <Button className="w-full" variant="outline">
                  创建话题
                </Button>
                <Button className="w-full" variant="outline">
                  邀请朋友
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}