'use client';
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatarUrl: '',
};

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden ring-2 ring-border flex-shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-primary-foreground text-xs font-semibold leading-none">
          {initials}
        </span>
      )}
    </div>
  );
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
    console.log('Logging out...');
  };

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50 overflow-visible">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">
                L
              </span>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-sm">
              LLMCHAT
            </span>
          </div>

          {/* Right side — forced to never shrink or wrap */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            <h1>hiiiiiiiiiiiiiiiii</h1>
            {/* Theme Toggle */}
          </div>
        </div>
      </div>
    </nav>
  );
}
