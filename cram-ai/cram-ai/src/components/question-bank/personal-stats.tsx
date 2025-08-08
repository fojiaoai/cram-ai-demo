/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 19:08:45
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 19:08:51
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Flame } from 'lucide-react';

interface QuestionBankStats {
  totalQuestions: number;
  completedTests: number;
  averageScore: number;
  studyHours: number;
  streak: number;
  rank: number;
  totalUsers: number;
}

interface PersonalStatsProps {
  isDarkMode: boolean;
  stats: QuestionBankStats;
}

export const PersonalStats: React.FC<PersonalStatsProps> = ({ isDarkMode, stats }) => {
  return (
    <div className="space-y-6">
      {/* Personal Statistics */}
      <Card className={`border-0 shadow-xl overflow-hidden animate-fade-in-up delay-400 ${
        isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            Personal Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-blue-600 font-semibold">{stats.averageScore}%</span>
            </div>
            <Progress value={stats.averageScore} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-blue-600">{stats.studyHours}h</div>
              <div className="text-xs text-gray-500">Study Time</div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-green-600">#{stats.rank}</div>
              <div className="text-xs text-gray-500">Global Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Streak */}
      <Card className={`border-0 shadow-xl overflow-hidden animate-fade-in-up delay-500 ${
        isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.streak}</div>
            <div className="text-sm text-gray-500 mb-4">Days in a row</div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${
                    i < stats.streak % 7 
                      ? 'bg-gradient-to-r from-orange-400 to-red-400' 
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};