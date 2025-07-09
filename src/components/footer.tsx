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
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <nav className="mb-4 flex justify-center gap-x-6" aria-label="Footer navigation">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/info" className="text-sm hover:text-primary transition-colors">
              Traffic Info
            </Link>
        </nav>
        <p className="flex items-center justify-center gap-1.5 text-sm">
          <Copyright className="h-4 w-4" /> {currentYear} Traffic Calculator
        </p>
        <p className="text-xs mt-2">
          Made with ❤️ by Neeraj Thammali
        </p>
      </div>
    </footer>
  );
}
