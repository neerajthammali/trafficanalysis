'use client';

import Link from 'next/link';
import { Copyright } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t py-6 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <nav className="mb-4 flex justify-center gap-x-6" aria-label="Footer navigation">
            <Link href="/" className="hover:text-primary transition-colors">
              Analyzer
            </Link>
            <Link href="/info" className="hover:text-primary transition-colors">
              About
            </Link>
        </nav>
        <div className="flex items-center justify-center gap-1.5 text-xs">
          <Copyright className="h-4 w-4" /> 
          <span>{currentYear} Traffic Analyzer | Made with ❤️ by Neeraj Thammali</span>
        </div>
      </div>
    </footer>
  );
}
