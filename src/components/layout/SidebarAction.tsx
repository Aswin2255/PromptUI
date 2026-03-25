'use client';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SidebarActions() {
  const router = useRouter();
  return (
    <div className="px-2 py-2 space-y-1">
      <button
        onClick={() => router.push('/')}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
      >
        <Plus className="size-4" />
        New Chat
      </button>

      <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent">
        <Search className="size-4" />
        Search
      </button>
    </div>
  );
}
