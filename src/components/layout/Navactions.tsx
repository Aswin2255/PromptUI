'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '../ui/switch';

export function NavActions() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-2 cursor-pointer">
        <Sun className="h-4 w-4 text-muted-foreground" />
        {mounted && (
          <Switch
            className="cursor-pointer"
            id="theme-toggle"
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
        )}
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
