/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 16:10:31
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 16:10:36
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

interface QuickActionCardProps {
  action: QuickAction;
  index: number;
  isDarkMode: boolean;
  isLoading?: boolean;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  action, 
  index, 
  isDarkMode, 
  isLoading = false 
}) => {
  return (
    <Card 
      className={`group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-white'
      } ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
      onClick={isLoading ? undefined : action.action}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
          action.action();
        }
      }}
      aria-label={`${action.title}: ${action.description}`}
      aria-disabled={isLoading}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}>
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <action.icon className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};