'use client';

import { ArrowUpRight, Link, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type ChatMessage = {
  chatsession_id: string;
  content: string;
  role: 'user' | 'ai';
  model: string;
  createdAt: string;
};

export function NavFavorites({
  favorites,
  isLoading,
}: {
  favorites: ChatMessage[];
  isLoading: boolean;
}) {
  console.log(favorites);
  const { isMobile } = useSidebar();

  // Group messages by chatsession_id
  const sessions = Object.values(
    favorites.reduce(
      (acc, msg) => {
        if (!acc[msg.chatsession_id]) {
          acc[msg.chatsession_id] = [];
        }
        acc[msg.chatsession_id].push(msg);
        return acc;
      },
      {} as Record<string, ChatMessage[]>,
    ),
  ).map((group) => {
    const userMsg = group.find((m) => m.role === 'user');
    const anyMsg = group[0];
    return {
      chatsession_id: anyMsg.chatsession_id,
      title: userMsg?.content ?? 'Untitled Chat',
      createdAt: anyMsg.createdAt,
    };
  });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Chats</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading
          ? // Skeleton loaders
            Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-36 rounded bg-muted animate-pulse" />
                </div>
              </SidebarMenuItem>
            ))
          : sessions.map((session) => (
              <SidebarMenuItem key={session.chatsession_id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/chat/${session.chatsession_id}`}
                    className="flex items-center gap-2"
                  >
                    <span>💬</span>
                    <span className="truncate">
                      {session.title.slice(0, 30)}...
                    </span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Link className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>Open in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash2 className="text-red-500" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
