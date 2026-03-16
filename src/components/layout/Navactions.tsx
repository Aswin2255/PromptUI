'use client';

import * as React from 'react';
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '../ui/switch';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatarUrl: '',
};

export function NavActions() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const handleLogout = () => {
    setDropdownOpen(false);
    console.log('Logging out...'); // Replace with your signOut()
  };

  const initials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Theme Toggle */}
      <div className="flex items-center gap-2">
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

      {/* Avatar + Dropdown */}
      {mounted && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full hover:bg-accent px-1 py-1 transition-colors focus:outline-none"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-2 ring-border flex-shrink-0 overflow-hidden">
              {mockUser.avatarUrl ? (
                <img
                  src={mockUser.avatarUrl}
                  alt={mockUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary-foreground text-xs font-semibold leading-none">
                  {initials}
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-popover shadow-md z-[999] overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border bg-muted/40">
                <p className="text-sm font-medium text-foreground truncate">
                  {mockUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {mockUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
