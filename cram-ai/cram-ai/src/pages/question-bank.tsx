import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Brain, 
  GraduationCap, 
  Briefcase,
  CheckCircle,
  Clock,
  BarChart3,
  BookOpen,
  Target,
  TrendingUp,
  Play,
  ExternalLink,
  Settings,
  Home,
  User,
  Bell,
  Sun,
  Moon,
  ArrowRight,
  Award,
  Activity,
  FileText,
  Users,
  Zap
} from 'lucide-react';

interface QuestionBankStats {
  totalQuestions: number;
  completedTests: number;
  averageScore: number;
  studyHours: number;
}

interface RecentActivity {
  id: number;
  title: string;
  type: 'exam' | 'practice' | 'review';
  score?: number;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
}

interface CoreFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
}

const QuestionBank: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState<'student' | 'professional'>('student');
  const [selectedCategory, setSelectedCategory] = useState<string>('civil-service');

  // Mock data for question bank statistics
  const [stats, setStats] = useState<QuestionBankStats>({
    totalQuestions: 10000,
    completedTests: 156,
    averageScore: 85,
    studyHours: 24
  });

  // Student mode features
  const studentFeatures: CoreFeature[] = [
    {
      id: 'civil-service',
      title: '公务员考试题库',
      description: '全面覆盖国考、省考题型',
      icon: GraduationCap,
      color: 'text-blue-600',
      enabled: true
    },
    {
      id: 'knowledge-test',
      title: '学科知识测验',
      description: '各学科专业知识评估',
      icon: BookOpen,
      color: 'text-green-600',
      enabled: true
    },
    {
      id: 'smart-analysis',
      title: '智能答案解析',
      description: 'AI驱动的详细解题分析',
      icon: Brain,
      color: 'text-purple-600',
      enabled: true
    },
    {
      id: 'progress-tracking',
      title: '学习进度追踪',
      description: '个性化学习路径规划',
      icon: TrendingUp,
      color: 'text-orange-600',
      enabled: true
    }
  ];

  // Professional mode features
  const professionalFeatures: CoreFeature[] = [
    {
      id: 'certification',
      title: '职业资格认证',
      description: '各行业资格考试题库',
      icon: Award,
      color: 'text-blue-600',
      enabled: true
    },
    {
      id: 'industry-knowledge',
      title: '行业知识测评',
      description: '专业领域知识评估',
      icon: Briefcase,
      color: 'text-green-600',
      enabled: true
    },
    {
      id: 'skill-assessment',
      title: '技能水平评估',
      description: '综合能力测试分析',
      icon: Target,
      color: 'text-purple-600',
      enabled: true
    },
    {
      id: 'learning-suggestions',
      title: '持续学习建议',
      description: 'AI个性化学习推荐',
      icon: Zap,
      color: 'text-orange-600',
      enabled: true
    }
  ];

  // Recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      title: '公务员模拟考试',
      type: 'exam',
      score: 85,
      status: 'completed',
      date: '2小时前'
    },
    {
      id: 2,
      title: '行政能力测验',
      type: 'practice',
      status: 'in-progress',
      date: '进行中'
    },
    {
      id: 3,
      title: '申论写作练习',
      type: 'review',
      status: 'pending',
      date: '待开始'
    }
  ];

  const currentFeatures = userType === 'student' ? studentFeatures : professionalFeatures;

  const handleStartTest = () => {
    navigate('/exam-interface');
  };

  const handleViewStats = () => {
    // Navigate to detailed statistics page
    console.log('View detailed statistics');
  };

  const handleViewRules = () => {
    // Navigate to exam rules page
    console.log('View exam rules');
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50/30 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-200/20'
        }`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI智能题库系统
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                NEW
              </Badge>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                首页
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                控制台
              </Button>
              <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Brain className="w-4 h-4 mr-2" />
                智能题库
              </Button>
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* User Type Switcher */}
            <div className={`flex items-center rounded-lg p-1 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Button
                variant={userType === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserType('student')}
                className="flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                学生模式
              </Button>
              <Button
                variant={userType === 'professional' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserType('professional')}
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                专业人士
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 dark:hover:bg-gray-700">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            
            <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-gray-700">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                智能题库系统
              </h1>
              <p className={`text-lg mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI驱动的个性化学习与测评平台
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Type Features */}
            <Card className={`border-0 shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {userType === 'student' ? (
                    <>
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      学生模式特色
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-6 h-6 text-purple-600" />
                      专业人士特色
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentFeatures.map((feature) => (
                    <div key={feature.id} className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer ${
                      isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-100 to-purple-100'
                        }`}>
                          <feature.icon className={`w-5 h-5 ${feature.color}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <h3 className="font-semibold">{feature.title}</h3>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Functions */}
            <Card className={`border-0 shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                  核心功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">公务员考试题库</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">智能答案解析</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">学习进度追踪</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">个性化推荐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className={`border-0 shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' :
                          activity.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score && (
                          <span className={`font-bold ${
                            activity.score >= 80 ? 'text-green-600' : 
                            activity.score >= 60 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {activity.score}分
                          </span>
                        )}
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {activity.status === 'completed' ? '已完成' :
                           activity.status === 'in-progress' ? '进行中' : '待开始'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card className={`border-0 shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <CardTitle>智能题库系统</CardTitle>
                  <Badge className="bg-blue-100 text-blue-700">AI驱动</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">题库总数</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalQuestions.toLocaleString()}+
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500">完成测试</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.completedTests}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-500">平均分数</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.averageScore}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-500">学习时长</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.studyHours}h
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleStartTest}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    开始智能测验
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleViewStats}
                      className="flex items-center gap-2 hover:bg-blue-50"
                    >
                      <BarChart3 className="w-4 h-4" />
                      查看统计
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleViewRules}
                      className="flex items-center gap-2 hover:bg-blue-50"
                    >
                      <FileText className="w-4 h-4" />
                      题库规览
                    </Button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span>本月进度</span>
                    <span>{stats.averageScore}%</span>
                  </div>
                  <Progress value={stats.averageScore} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    支持单选、多选、判断、问答等多种题型
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className={`border-0 shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  快速访问
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 hover:bg-blue-50"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  返回控制台
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 hover:bg-green-50"
                >
                  <Users className="w-4 h-4 text-green-500" />
                  学习社区
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 hover:bg-purple-50"
                >
                  <Settings className="w-4 h-4 text-purple-500" />
                  系统设置
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;