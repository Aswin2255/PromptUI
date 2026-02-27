'use client';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <>
      <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">
                  L
                </span>
              </div>
              <span className="font-semibold text-foreground tracking-tight text-sm">
                LLMCHAT
              </span>
            </div>

            {/* Right side: theme toggle + name */}
            <div className="flex items-center gap-5">
              {/* Theme Toggle */}
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
          </div>
        </div>
      </nav>
    </>
  );
}
