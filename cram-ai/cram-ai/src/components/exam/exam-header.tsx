/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-08 10:47:14
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-08 16:13:30
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ExamHeaderProps {
  examTitle: string;
  examType: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: string;
  completedQuestions: number;
  onBack?: () => void;
  onSettings?: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  examType,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  completedQuestions,
  onBack,
  onSettings
}) => {
  const { t } = useTranslation();
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  return (
    <Card className="w-full p-4 mb-6 border-0 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{examTitle}</h1>
            <Badge variant="secondary" className="mt-1">
              {examType}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium text-blue-600">{timeRemaining}</span>
          </div>
          {onSettings && (
            <Button variant="ghost" size="sm" onClick={onSettings} className="p-2">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {t('exam.question')} {currentQuestion} {t('exam.of')} {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">
            {t('exam.completed')}: {completedQuestions}/{totalQuestions}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      <Progress value={progressPercentage} className="h-2" />
    </Card>
  );
};