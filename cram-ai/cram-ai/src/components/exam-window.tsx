import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Target,
  Award,
  Clock,
  Users,
  TrendingUp,
  Play,
  FileText,
  BarChart3
} from 'lucide-react';

const ExamWindow: React.FC = () => {
  const handleOpenExamWindow = () => {
    // Open exam interface in current window with hash routing
    window.open('/exam-interface', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
  };

  const examStats = [
    { label: '题库总数', value: '10,000+', icon: FileText, color: 'text-blue-600' },
    { label: '完成测试', value: '156', icon: Target, color: 'text-green-600' },
    { label: '平均分数', value: '85%', icon: Award, color: 'text-orange-600' },
    { label: '学习时长', value: '24h', icon: Clock, color: 'text-purple-600' }
  ];

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          智能题库系统
          <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
            AI驱动
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {examStats.map((stat, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </span>
              </div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            核心功能
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              公务员考试题库
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              智能答案解析
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              学习进度追踪
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              个性化推荐
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleOpenExamWindow}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            开始智能测验
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              查看统计
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              题库浏览
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            最近活动
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">公务员模拟考试</span>
              <span className="text-green-600 font-medium">85分</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">行政能力测验</span>
              <span className="text-blue-600 font-medium">进行中</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">申论写作练习</span>
              <span className="text-gray-500">待开始</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamWindow;