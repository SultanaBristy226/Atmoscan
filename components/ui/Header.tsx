'use client';

import { Bell, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: Date;
}

export default function Header({ isConnected, lastUpdate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <div>
            <h1 className="text-xl font-bold">Smart Air Monitor</h1>
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Offline</span>
            </div>
          )}
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}