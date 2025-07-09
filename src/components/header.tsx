'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrafficCone, Info, Clock, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

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
    const timer = setInterval(checkPeakTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const PeakHoursDisplay = () => {
    if (!isClient) {
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Badge variant={isPeak ? 'destructive' : 'default'} className={!isPeak ? 'bg-accent/80' : ''}>
          {isPeak ? 'Peak Hours' : 'Off-Peak'}
        </Badge>
      </div>
    );
  };

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <TrafficCone className="h-6 w-6 text-primary" />
          <span className="hidden font-headline sm:inline-block">Traffic Calculator</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <nav>
            <Link
              href="/info"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
              Traffic Info
            </Link>
          </nav>
          <PeakHoursDisplay />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex h-full flex-col">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link href="/" className="flex items-center gap-2 font-bold">
                    <TrafficCone className="h-6 w-6 text-primary" />
                    <span>Calculator</span>
                  </Link>
                  <Link href="/info" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Info className="h-5 w-5" />
                    Traffic Info
                  </Link>
                </nav>
                <div className="mt-auto pb-4">
                  <PeakHoursDisplay />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
