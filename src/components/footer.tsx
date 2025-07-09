'use client';

import { Copyright } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5 text-sm">
          <Copyright className="h-4 w-4" /> {currentYear} Traffic Calculator
        </p>
        <p className="text-xs mt-2">
          Made with ❤️ by the Firebase Studio Team
        </p>
      </div>
    </footer>
  );
}
