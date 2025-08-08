/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 16:10:08
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 16:10:13
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down';
}

interface StatsCardProps {
  stat: StatItem;
  index: number;
  isDarkMode: boolean;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  stat, 
  index, 
  isDarkMode, 
  onClick 
}) => {
  return (
    <Card 
      className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer animate-fade-in-up ${
        isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`${stat.label}: ${stat.value}, ${stat.change} change`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {stat.label}
            </p>
            <p className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </p>
            <p className={`text-xs flex items-center gap-1 ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.change} this month
            </p>
          </div>
          <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-100 to-purple-100'
          }`}>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};