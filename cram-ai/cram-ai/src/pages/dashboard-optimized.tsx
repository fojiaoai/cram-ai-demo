import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/language-switcher';
import { StatsCard } from '@/components/dashboard/stats-card';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { ContentItemComponent } from '@/components/dashboard/content-item';
import { DashboardSkeleton, InsightCardSkeleton, StatsCardSkeleton, QuickActionSkeleton, ContentItemSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NavigationBar from '@/components/navigation-bar';
import { useTheme } from '@/components/theme-provider';

// Lazy load heavy components
const UploadDemo = React.lazy(() => import('@/components/upload-demo'));

import { 
  Brain, 
  Upload, 
  Video, 
  Globe, 
  FileText, 
  Search,
  Bell,
  Sun,
  Moon,
  User,
  TrendingUp,
  BookOpen,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Plus,
  Filter,
  ArrowRight,
  TrendingDown,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  Lightbulb,
  Award
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down';
}

interface ContentItem {
  id: number;
  title: string;
  type: 'document' | 'video' | 'web';
  progress: number;
  insights: number;
  lastAccessed: string;
  confidence: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface InsightItem {
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export default function DashboardOptimized() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // State management
  const [userType, setUserType] = useState<'student' | 'professional'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('userType') as 'student' | 'professional') || 'student';
    }
    return 'student';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState('content');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [actionLoadingStates, setActionLoadingStates] = useState<Record<string, boolean>>({});

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Optimized data with useMemo for better performance
  const studentData = useMemo(() => ({
    stats: [
      { 
        label: t('dashboard.stats.learningHours'), 
        value: '24', 
        change: '+3', 
        icon: Clock, 
        color: 'text-blue-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.completedCourses'), 
        value: '8', 
        change: '+2', 
        icon: BookOpen, 
        color: 'text-green-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.currentStreak'), 
        value: '12', 
        change: '+1', 
        icon: Target, 
        color: 'text-orange-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.aiInsights'), 
        value: '156', 
        change: '+24', 
        icon: Brain, 
        color: 'text-purple-600',
        trend: 'up' as const
      }
    ] as StatItem[],
    recentContent: [
      {
        id: 1,
        title: '高等数学微积分基础',
        type: 'document' as const,
        progress: 85,
        insights: 12,
        lastAccessed: '2小时前',
        confidence: 94,
        status: 'in-progress' as const
      },
      {
        id: 2,
        title: '英语四级听力训练',
        type: 'video' as const,
        progress: 60,
        insights: 8,
        lastAccessed: '1天前',
        confidence: 87,
        status: 'in-progress' as const
      },
      {
        id: 3,
        title: '计算机网络原理',
        type: 'web' as const,
        progress: 100,
        insights: 15,
        lastAccessed: '2天前',
        confidence: 91,
        status: 'completed' as const
      }
    ] as ContentItem[],
    insights: [
      {
        type: 'recommendation',
        title: t('dashboard.insights.student.recommendation'),
        description: t('dashboard.insights.student.recommendationDesc'),
        icon: Lightbulb,
        color: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        priority: 'high' as const
      },
      {
        type: 'progress',
        title: t('dashboard.insights.student.progress'),
        description: t('dashboard.insights.student.progressDesc'),
        icon: TrendingUp,
        color: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        priority: 'medium' as const
      },
      {
        type: 'reminder',
        title: t('dashboard.insights.student.reminder'),
        description: t('dashboard.insights.student.reminderDesc'),
        icon: Bell,
        color: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
        priority: 'high' as const
      }
    ] as InsightItem[]
  }), [t]);

  const professionalData = useMemo(() => ({
    stats: [
      { 
        label: t('dashboard.stats.analysisHours'), 
        value: '42', 
        change: '+8', 
        icon: BarChart3, 
        color: 'text-blue-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.completedProjects'), 
        value: '15', 
        change: '+3', 
        icon: Briefcase, 
        color: 'text-green-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.currentStreak'), 
        value: '28', 
        change: '+2', 
        icon: Target, 
        color: 'text-orange-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.aiInsights'), 
        value: '324', 
        change: '+45', 
        icon: Brain, 
        color: 'text-purple-600',
        trend: 'up' as const
      }
    ] as StatItem[],
    recentContent: [
      {
        id: 1,
        title: '2025年AI行业发展报告',
        type: 'document' as const,
        progress: 100,
        insights: 28,
        lastAccessed: '1小时前',
        confidence: 96,
        status: 'completed' as const
      },
      {
        id: 2,
        title: 'TechCrunch AI创业分析',
        type: 'video' as const,
        progress: 75,
        insights: 18,
        lastAccessed: '3小时前',
        confidence: 89,
        status: 'in-progress' as const
      },
      {
        id: 3,
        title: '机器学习最新研究论文',
        type: 'web' as const,
        progress: 90,
        insights: 22,
        lastAccessed: '1天前',
        confidence: 93,
        status: 'in-progress' as const
      }
    ] as ContentItem[],
    insights: [
      {
        type: 'trend',
        title: t('dashboard.insights.professional.trend'),
        description: t('dashboard.insights.professional.trendDesc'),
        icon: TrendingUp,
        color: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        priority: 'high' as const
      },
      {
        type: 'skill',
        title: t('dashboard.insights.professional.skill'),
        description: t('dashboard.insights.professional.skillDesc'),
        icon: Award,
        color: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        priority: 'medium' as const
      },
      {
        type: 'opportunity',
        title: t('dashboard.insights.professional.opportunity'),
        description: t('dashboard.insights.professional.opportunityDesc'),
        icon: Sparkles,
        color: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
        priority: 'high' as const
      }
    ] as InsightItem[]
  }), [t]);

  const currentData = userType === 'student' ? studentData : professionalData;

  // Optimized quick actions with loading states
  const quickActions = useMemo(() => [
    {
      title: t('dashboard.quickActions.uploadFile'),
      description: t('dashboard.quickActions.uploadFileDesc'),
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      action: () => handleQuickAction('upload', () => {
        navigate('/unified-analysis?autostart=1&type=url')
      })
    },
    {
      title: t('dashboard.quickActions.analyzeVideo'),
      description: t('dashboard.quickActions.analyzeVideoDesc'),
      icon: Video,
      color: 'from-red-500 to-pink-500',
      action: () => handleQuickAction('video', () => {
        navigate('/unified-analysis?autostart=1&type=video')
      })
    },
    {
      title: t('dashboard.quickActions.webContent'),
      description: t('dashboard.quickActions.webContentDesc'),
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      action: () => handleQuickAction('web', () => {
        navigate('/unified-analysis?autostart=1&type=url')
      })
    },
    {
      title: t('dashboard.quickActions.aiAnalysis'),
      description: t('dashboard.quickActions.aiAnalysisDesc'),
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      action: () => handleQuickAction('ai', () => {
        navigate('/question-bank');
      })
    }
  ], [t, navigate]);

  // Optimized filtered content with debouncing
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return currentData.recentContent;
    return currentData.recentContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentData.recentContent, searchQuery]);

  // Optimized event handlers
  const handleThemeToggle = useCallback(() => {
    // This function is no longer needed as theme is managed by useTheme
  }, []);

  const handleUserTypeChange = useCallback((type: 'student' | 'professional') => {
    setUserType(type);
    setMobileMenuOpen(false);
  }, []);

  const handleNotificationClick = useCallback(() => {
    setNotifications(0);
    console.log('Notifications clicked');
  }, []);

  const handleQuickAction = useCallback((actionId: string, action: () => void) => {
    setActionLoadingStates(prev => ({ ...prev, [actionId]: true }));
    setTimeout(() => {
      action();
      setActionLoadingStates(prev => ({ ...prev, [actionId]: false }));
    }, 1000);
  }, []);

  const handleContentItemClick = useCallback((item: ContentItem) => {
    console.log('Content item clicked:', item);
    // Navigate to content detail page
  }, []);

  const handleStatClick = useCallback((stat: StatItem) => {
    console.log('Stat clicked:', stat);
    // Navigate to detailed analytics
  }, []);

  // Show loading skeleton while data is loading
  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 text-gray-900'
      }`}>
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-1000 ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/30'
          }`} />
          <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-1000 ${
            isDarkMode ? 'bg-purple-500/10' : 'bg-purple-200/30'
          }`} />
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 transition-colors duration-1000 ${
            isDarkMode ? 'bg-cyan-500/5' : 'bg-cyan-200/20'
          }`} />
        </div>

        {/* Unified Navigation Bar */}
        <NavigationBar />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  {t('dashboard.welcome')} 
                  <span className="text-2xl animate-wave">👋</span>
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(`dashboard.welcomeMessage.${userType}`)}
                </p>
                {!isOnline && (
                  <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    You're currently offline. Some features may be limited.
                  </div>
                )}
              </div>
              <div className="text-center md:text-right">
                <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userType === 'student' ? '今日学习' : '今日分析'}
                </div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {userType === 'student' ? '3.2h' : '5.8h'}
                </div>
                <div className="text-xs text-green-600 flex items-center justify-center md:justify-end gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% vs 昨天
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <ErrorBoundary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentData.stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  stat={stat}
                  index={index}
                  isDarkMode={isDarkMode}
                  onClick={() => handleStatClick(stat)}
                />
              ))}
            </div>
          </ErrorBoundary>

          {/* Quick Actions */}
          <ErrorBoundary>
            <Card className={`mb-8 border-0 shadow-xl overflow-hidden animate-fade-in-up ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-lg">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  {t('dashboard.quickActions.title')}
                  <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300">
                    AI
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {quickActions.map((action, index) => (
                    <QuickActionCard
                      key={index}
                      action={action}
                      index={index}
                      isDarkMode={isDarkMode}
                      isLoading={actionLoadingStates[['upload', 'video', 'web', 'ai'][index]]}
                    />
                  ))}
                </div>

                {/* Upload Demo Component with Suspense */}
                <div className="mt-6">
                  <Suspense fallback={<div className="h-32 flex items-center justify-center"><LoadingSpinner text="Loading upload component..." /></div>}>
                    <UploadDemo />
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>

          {/* Main Content Tabs */}
          <ErrorBoundary>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className={`grid w-full grid-cols-3 ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
              }`}>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('dashboard.tabs.recentContent')}
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  {t('dashboard.tabs.aiInsights')}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('dashboard.tabs.analytics')}
                </TabsTrigger>
              </TabsList>

              {/* Recent Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card className={`border-0 shadow-xl ${
                  isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        {t('dashboard.recentContent.title')}
                      </CardTitle>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {t('common.filter')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredContent.length > 0 ? (
                        filteredContent.map((item) => (
                          <ContentItemComponent
                            key={item.id}
                            item={item}
                            isDarkMode={isDarkMode}
                            onClick={() => handleContentItemClick(item)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No content found matching your search.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentData.insights.map((insight, index) => (
                    <Card 
                      key={index} 
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${insight.color} ${
                        isDarkMode ? 'backdrop-blur-sm' : 'backdrop-blur-sm'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-white/20">
                            <insight.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {t(`dashboard.insights.priority.${insight.priority}`)}
                              </Badge>
                            </div>
                            <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                            <Button size="sm" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                              {t('dashboard.insights.viewDetails')}
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={`border-0 shadow-xl ${
                    isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        {t('dashboard.analytics.contentDistribution')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: 'document', count: 45, color: 'bg-blue-500' },
                          { type: 'video', count: 32, color: 'bg-red-500' },
                          { type: 'web', count: 28, color: 'bg-green-500' }
                        ].map((item) => (
                          <div key={item.type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm font-medium capitalize">{item.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{item.count}</span>
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${item.color}`} 
                                  style={{ width: `${(item.count / 105) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-0 shadow-xl ${
                    isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        {t('dashboard.analytics.weeklyActivity')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                          const activity = [85, 92, 78, 95, 88, 45, 32][index];
                          return (
                            <div key={day} className="flex items-center justify-between">
                              <span className="text-sm font-medium w-8">{day}</span>
                              <div className="flex-1 mx-3">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                                    style={{ width: `${activity}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm text-gray-500 w-8 text-right">{activity}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className={`p-6 rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-3">
                <LoadingSpinner />
                <span className="text-sm font-medium">{t('common.loading')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
