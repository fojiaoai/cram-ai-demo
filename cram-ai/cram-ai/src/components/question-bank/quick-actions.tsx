/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 19:08:34
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 19:08:39
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Play, BarChart3, FileText } from 'lucide-react';

interface QuickActionsProps {
  isDarkMode: boolean;
  isLoading: boolean;
  onStartTest: () => void;
  onViewStats: () => void;
  onViewRules: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isDarkMode,
  isLoading,
  onStartTest,
  onViewStats,
  onViewRules
}) => {
  return (
    <Card className={`border-0 shadow-xl overflow-hidden animate-fade-in-up delay-300 ${
      isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          Quick Start Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={onStartTest}
            disabled={isLoading}
            className="h-20 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-2">
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Play className="w-6 h-6" />
              )}
              <span className="font-semibold">Start Test</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onViewStats}
            className="h-20 border-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">View Stats</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onViewRules}
            className="h-20 border-2 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              <span className="font-semibold">Exam Rules</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};