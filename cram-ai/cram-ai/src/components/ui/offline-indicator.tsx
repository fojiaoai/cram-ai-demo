/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 16:08:49
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 16:08:54
 */
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Alert, AlertDescription } from './alert';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 right-4 z-50 w-auto bg-red-50 border-red-200">
      <WifiOff className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  );
}

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-red-600">Offline</span>
        </>
      )}
    </div>
  );
}