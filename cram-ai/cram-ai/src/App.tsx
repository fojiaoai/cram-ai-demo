/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-07-30 22:34:52
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-07 16:33:44
 */
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { FullPageLoader } from '@/components/ui/loading-spinner';
import './globals.css';
import './components/dashboard/animations.css';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/landing-page'));
const AuthPage = React.lazy(() => import('./pages/auth-page'));
const Dashboard = React.lazy(() => import('./pages/dashboard-optimized'));
const QuestionBank = React.lazy(() => import('./pages/question-bank-optimized'));
const AIAnalysisInterface = React.lazy(() => import('./pages/ai-analysis-interface'));
const UnifiedAnalysisInterface = React.lazy(() => import('./pages/unified-analysis-interface'));
const ExamInterface = React.lazy(() => import('./pages/exam-interface'));
const AnalysisResults = React.lazy(() => import('./pages/analysis-results'));
const Community = React.lazy(() => import('./pages/community'));
const Creators = React.lazy(() => import('./pages/creators'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background font-sans antialiased">
          <OfflineIndicator />
          <Suspense fallback={<FullPageLoader text="Loading application..." />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/ai-analysis" element={<AIAnalysisInterface />} />
              <Route path="/unified-analysis" element={<UnifiedAnalysisInterface />} />
              <Route path="/exam-interface" element={<ExamInterface />} />
              <Route path="/analysis-results" element={<AnalysisResults />} />
              <Route path="/community" element={<Community />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
