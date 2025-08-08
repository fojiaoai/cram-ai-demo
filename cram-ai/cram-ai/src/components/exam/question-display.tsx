import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flag, Lightbulb, ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'essay' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
  timeSpent?: number;
  flagged?: boolean;
}

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userAnswer?: string | string[];
  isFlagged: boolean;
  showExplanation?: boolean;
  onAnswerChange: (answer: string | string[]) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave?: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  userAnswer,
  isFlagged,
  showExplanation = false,
  onAnswerChange,
  onFlag,
  onPrevious,
  onNext,
  onSave,
  canGoPrevious,
  canGoNext
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 border-green-600';
      case 'medium': return 'text-yellow-600 border-yellow-600';
      case 'hard': return 'text-red-600 border-red-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              题目 {currentIndex + 1} / {totalQuestions}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-sm ${getDifficultyColor(question.difficulty)}`}
            >
              {getDifficultyText(question.difficulty)}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {question.points} 分
            </Badge>
            <Badge variant="outline" className="text-sm">
              {question.category}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlag}
              className={isFlagged ? 'text-red-600' : ''}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold leading-relaxed text-gray-900 dark:text-white">
            {question.question}
          </h2>
          
          {/* Answer Options */}
          <div className="space-y-4">
            {question.type === 'single' && question.options && (
              <RadioGroup
                value={userAnswer as string || ''}
                onValueChange={(value) => onAnswerChange(value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {question.type === 'multiple' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Checkbox 
                      id={`option-${index}`}
                      checked={(userAnswer as string[] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = (userAnswer as string[]) || [];
                        if (checked) {
                          onAnswerChange([...currentAnswers, option]);
                        } else {
                          onAnswerChange(currentAnswers.filter(a => a !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'true-false' && (
              <RadioGroup
                value={userAnswer as string || ''}
                onValueChange={(value) => onAnswerChange(value)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="cursor-pointer text-base">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-sm font-medium mr-3 text-green-700 dark:text-green-300">
                      ✓
                    </span>
                    正确
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="cursor-pointer text-base">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-sm font-medium mr-3 text-red-700 dark:text-red-300">
                      ✗
                    </span>
                    错误
                  </Label>
                </div>
              </RadioGroup>
            )}
            
            {question.type === 'essay' && (
              <div className="space-y-2">
                <Label htmlFor="essay-answer" className="text-base font-medium">
                  请在下方输入您的答案：
                </Label>
                <Textarea
                  id="essay-answer"
                  placeholder="请在此输入您的答案..."
                  value={userAnswer as string || ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="min-h-32 resize-none text-base"
                />
                <div className="text-sm text-gray-500 text-right">
                  {(userAnswer as string || '').length} 字符
                </div>
              </div>
            )}
          </div>
          
          {/* Show explanation */}
          {showExplanation && question.explanation && (
            <div className="mt-6 p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                解析
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            上一题
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onFlag}
              className={`${
                isFlagged
                  ? 'text-red-600 border-red-600 bg-red-50 dark:bg-red-900/20'
                  : ''
              }`}
            >
              <Flag className="h-4 w-4" />
              {isFlagged ? '取消标记' : '标记'}
            </Button>
            
            {onSave && (
              <Button
                variant="outline"
                onClick={onSave}
              >
                <Save className="h-4 w-4" />
                保存
              </Button>
            )}
          </div>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            下一题
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};