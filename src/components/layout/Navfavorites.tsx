'use client';

import Link from 'next/link';
import { ArrowUpRight, MoreHorizontal, Trash2 } from 'lucide-react';
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
import { ChatItem } from '@/lib/zustand/store';

export function NavFavorites({
  chats,
  isloading,
}: {
  chats: ChatItem[];
  isloading: boolean;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Chats</SidebarGroupLabel>

      <SidebarMenu>
        {isloading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-36 rounded bg-muted animate-pulse" />
                </div>
              </SidebarMenuItem>
            ))
          : chats?.map((chat) => (
              <SidebarMenuItem key={chat._id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/chat/${chat._id}`}
                    className="flex items-center gap-2"
                  >
                    <span>💬</span>
                    <span className="truncate">{chat.title.slice(0, 30)}</span>
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
