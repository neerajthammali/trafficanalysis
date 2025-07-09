'use client';

import Link from 'next/link';
import { TrafficCone, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <TrafficCone className="h-6 w-6 text-primary" />
          <span className="hidden font-headline sm:inline-block">Traffic Analyzer</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/info"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            Traffic Info
          </Link>
        </nav>

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
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <TrafficCone className="h-6 w-6 text-primary" />
                    <span>Traffic Analyzer</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex h-full flex-col">
                <nav className="grid gap-4 text-base font-medium">
                  <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <TrafficCone className="h-5 w-5" />
                    Analyzer
                  </Link>
                  <Link href="/info" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Info className="h-5 w-5" />
                    Traffic Info
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
