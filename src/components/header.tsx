'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrafficCone, Info, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isPeak, setIsPeak] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkPeakTime = () => {
      const now = new Date();
      const hours = now.getHours();
      // Peak hours: 8-10 AM and 5-7 PM (17-19)
      const isPeakTime = (hours >= 8 && hours <= 10) || (hours >= 17 && hours <= 19);
      setIsPeak(isPeakTime);
    };

    checkPeakTime();
    const timer = setInterval(checkPeakTime, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <TrafficCone className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">Traffic Calculator</span>
        </Link>
        
        <div className="flex items-center gap-6">
            <nav>
                <Link
                    href="/info"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Traffic Info</span>
                </Link>
            </nav>
            {isClient && (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant={isPeak ? 'destructive' : 'default'} className={!isPeak ? 'bg-accent/80' : ''}>
                    {isPeak ? 'Peak Hours' : 'Off-Peak'}
                    </Badge>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
