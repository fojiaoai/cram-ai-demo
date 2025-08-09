import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import NavigationBar from '@/components/navigation-bar'
import { 
  Upload, 
  BarChart3, 
  Users, 
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  FileText,
  Video,
  Image,
  Music,
  Plus,
  Settings,
  Download,
  Share2
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Creators() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('dashboard')

  const creatorStats = {
    totalViews: 125430,
    totalLikes: 8920,
    totalFollowers: 2340,
    totalContent: 156,
    monthlyGrowth: 15.2
  }

  const recentContent = [
    {
      id: 1,
      title: "AI视频分析完整教程",
      type: "video",
      views: 12450,
      likes: 890,
      comments: 67,
      uploadDate: "2025-01-15",
      status: "published",
      thumbnail: "/placeholder.svg?height=120&width=200"
    },
    {
      id: 2,
      title: "PDF文档智能处理指南",
      type: "document",
      views: 8920,
      likes: 654,
      comments: 43,
      uploadDate: "2025-01-12",
      status: "published",
      thumbnail: "/placeholder.svg?height=120&width=200"
    },
    {
      id: 3,
      title: "音频内容分析技巧",
      type: "audio",
      views: 6780,
      likes: 432,
      comments: 28,
      uploadDate: "2025-01-10",
      status: "draft",
      thumbnail: "/placeholder.svg?height=120&width=200"
    }
  ]

  const analyticsData = [
    { month: "1月", views: 8500, likes: 650 },
    { month: "2月", views: 12300, likes: 890 },
    { month: "3月", views: 15600, likes: 1200 },
    { month: "4月", views: 18900, likes: 1450 },
    { month: "5月", views: 22100, likes: 1680 },
    { month: "6月", views: 25400, likes: 1920 }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'audio':
        return <Music className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">已发布</Badge>
      case 'draft':
        return <Badge variant="secondary">草稿</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">待审核</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Creator Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/avatar1.svg" />
                    <AvatarFallback>创</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI教学专家</h1>
                    <p className="text-gray-600 mb-2">专注于AI技术教学和内容分析</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {creatorStats.totalFollowers.toLocaleString()} 关注者
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {creatorStats.totalViews.toLocaleString()} 总观看
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {creatorStats.totalContent} 内容
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      +{creatorStats.monthlyGrowth}% 本月增长
                    </span>
                  </div>
                  <Button variant="outline">编辑资料</Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">概览</TabsTrigger>
                <TabsTrigger value="content">内容管理</TabsTrigger>
                <TabsTrigger value="analytics">数据分析</TabsTrigger>
                <TabsTrigger value="upload">上传内容</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">总观看量</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {creatorStats.totalViews.toLocaleString()}
                          </p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="mt-4">
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2">较上月 +12%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">总点赞数</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {creatorStats.totalLikes.toLocaleString()}
                          </p>
                        </div>
                        <Heart className="h-8 w-8 text-red-500" />
                      </div>
                      <div className="mt-4">
                        <Progress value={68} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2">较上月 +8%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">关注者</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {creatorStats.totalFollowers.toLocaleString()}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="mt-4">
                        <Progress value={82} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2">较上月 +15%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">内容数量</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {creatorStats.totalContent}
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="mt-4">
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2">本月新增 6</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>最近内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentContent.slice(0, 3).map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={content.thumbnail} 
                              alt={content.title}
                              className="w-16 h-10 object-cover rounded"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(content.type)}
                                <h4 className="font-medium text-gray-900">{content.title}</h4>
                                {getStatusBadge(content.status)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {content.views.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1" />
                                  {content.likes}
                                </span>
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {content.comments}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {content.uploadDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Management Tab */}
              <TabsContent value="content" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">内容管理</h2>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="搜索内容..." className="w-64" />
                    <Button variant="outline">筛选</Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {recentContent.map((content) => (
                    <Card key={content.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={content.thumbnail} 
                              alt={content.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getTypeIcon(content.type)}
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {content.title}
                                </h3>
                                {getStatusBadge(content.status)}
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">观看量</p>
                                  <p className="font-medium">{content.views.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">点赞数</p>
                                  <p className="font-medium">{content.likes}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">评论数</p>
                                  <p className="font-medium">{content.comments}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">上传日期</p>
                                  <p className="font-medium">{content.uploadDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">编辑</Button>
                            <Button variant="outline" size="sm">分析</Button>
                            <Button variant="ghost" size="sm">删除</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">数据分析</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>观看量趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {analyticsData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-blue-500 rounded-t w-8 mb-2"
                              style={{ height: `${(data.views / 25400) * 200}px` }}
                            />
                            <span className="text-xs text-gray-500">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>点赞量趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {analyticsData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-red-500 rounded-t w-8 mb-2"
                              style={{ height: `${(data.likes / 1920) * 200}px` }}
                            />
                            <span className="text-xs text-gray-500">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>内容表现排行</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentContent.map((content, index) => (
                        <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{content.title}</h4>
                              <p className="text-sm text-gray-500">
                                {content.views.toLocaleString()} 观看 · {content.likes} 点赞
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              +{Math.floor(Math.random() * 20 + 5)}%
                            </p>
                            <p className="text-xs text-gray-500">较上周</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Upload Content Tab */}
              <TabsContent value="upload" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">上传内容</h2>
                
                <Card>
                  <CardContent className="p-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        拖拽文件到此处或点击上传
                      </h3>
                      <p className="text-gray-500 mb-4">
                        支持视频、音频、文档等多种格式
                      </p>
                      <Button>选择文件</Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Video className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">视频内容</h3>
                      <p className="text-sm text-gray-500">上传视频文件进行AI分析</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">文档资料</h3>
                      <p className="text-sm text-gray-500">上传PDF、Word等文档</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Music className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">音频文件</h3>
                      <p className="text-sm text-gray-500">上传音频进行内容分析</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}