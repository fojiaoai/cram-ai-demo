import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Target, BarChart3, PieChart, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

interface DataDashboardProps {
  todayQuestions: number;
  accuracyRate: number;
  averageTime: number;
  totalTime: number;
  questionTypes: Array<{
    type: string;
    count: number;
    color: string;
  }>;
  subjectDistribution: Array<{
    subject: string;
    count: number;
    color: string;
  }>;
  accuracyByType: Array<{
    type: string;
    accuracy: number;
  }>;
}

export const DataDashboard: React.FC<DataDashboardProps> = ({
  todayQuestions,
  accuracyRate,
  averageTime,
  totalTime,
  questionTypes,
  subjectDistribution,
  accuracyByType
}) => {
  const { t } = useTranslation();
  
  const metrics: DashboardMetric[] = [
    {
      label: t('exam.dashboard.todayQuestions'),
      value: todayQuestions,
      unit: t('exam.dashboard.units.questions'),
      trend: 'down',
      trendValue: '5%'
    },
    {
      label: t('exam.dashboard.todayAccuracy'),
      value: accuracyRate,
      unit: t('exam.dashboard.units.percent'),
      trend: 'up',
      trendValue: '5.2%'
    },
    {
      label: t('exam.dashboard.averageTime'),
      value: averageTime,
      unit: t('exam.dashboard.units.seconds'),
      trend: 'up',
      trendValue: '7.2%'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">{metric.label}</span>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{metric.trendValue}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && <span className="text-sm text-gray-400">{metric.unit}</span>}
              </div>
              <div className="text-xs text-gray-400 mt-1">{t('exam.dashboard.difficultyDistribution')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Time */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{t('exam.dashboard.timeAnalysis')}</span>
            <div className="flex items-center gap-1 text-xs text-red-400">
              <TrendingDown className="h-3 w-3" />
              <span>5%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{totalTime}</span>
            <span className="text-sm text-gray-400">{t('exam.dashboard.units.minutes')}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{t('exam.dashboard.difficultyDistribution')}</div>
          {/* Mini chart placeholder */}
          <div className="mt-3 h-8 flex items-end gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-600 flex-1 rounded-sm"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Types */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            {t('exam.dashboard.subjectBreakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {questionTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm text-gray-300 flex-1">{type.type}</span>
                <span className="text-sm font-medium">{type.count}</span>
              </div>
            ))}
          </div>
          
          {/* Pie Chart Visualization */}
          <div className="mt-4 flex justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {questionTypes.map((type, index) => {
                  const total = questionTypes.reduce((sum, t) => sum + t.count, 0);
                  const percentage = (type.count / total) * 100;
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -index * (circumference / questionTypes.length);
                  
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={type.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('exam.dashboard.monthlyStats')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {subjectDistribution.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="text-sm text-gray-300">{subject.subject}</span>
                  </div>
                  <span className="text-sm font-medium">{subject.count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: subject.color,
                      width: `${(subject.count / Math.max(...subjectDistribution.map(s => s.count))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predicted Score */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700 text-white">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-blue-300 mb-2">{t('exam.dashboard.performanceAnalysis')}</div>
            <div className="text-3xl font-bold mb-1">61.90</div>
            <div className="text-sm text-blue-300">{t('exam.dashboard.units.points')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy by Type */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('exam.dashboard.improvementSuggestions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {accuracyByType.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{item.type}</span>
                  <span className="text-sm font-medium">{item.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.accuracy > 0 ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.abs(item.accuracy)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expand Button */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white cursor-pointer hover:bg-gray-700/50 transition-colors">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <TrendingDown className="h-4 w-4 rotate-180" />
            <span>{t('dashboard.viewAll')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};