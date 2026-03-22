'use client';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useMessage, useTyping } from '@/lib/zustand/store';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
        <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-muted-foreground/50"
              style={{
                animation: 'typingBounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start justify-end gap-3 px-4 py-2">
      {/* Bubble */}
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed text-primary-foreground">
          {content}
        </p>
      </div>

      {/* User Avatar */}
      <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
        <AvatarFallback className="bg-muted text-muted-foreground">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
function AIMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
        <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed text-foreground">{content}</p>
      </div>
    </div>
  );
}
export default function ChatMessage() {
  const messageDetails = [
    {
      message_id: '1',
      role: 'user',
      content: 'Hi',
    },
    {
      message_id: '2',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
    {
      message_id: '3',
      role: 'user',
      content: 'I need help with my project',
    },
    {
      message_id: '4',
      role: 'assistant',
      content: 'Sure, tell me more about your project.',
    },
    {
      message_id: '3',
      role: 'user',
      content: 'I need help with my project',
    },
    {
      message_id: '4',
      role: 'assistant',
      content: 'Sure, tell me more about your project.',
    },
    {
      message_id: '3',
      role: 'user',
      content: 'I need help with my project',
    },
    {
      message_id: '4',
      role: 'assistant',
      content: 'Sure, tell me more about your project.',
    },
    {
      message_id: '3',
      role: 'user',
      content: 'I need help with my project',
    },
    {
      message_id: '4',
      role: 'assistant',
      content: 'Sure, tell me more about your project.',
    },
  ];
  return (
    <>
      {messageDetails?.length && (
        <>
          {messageDetails?.map((msg, index) => (
            <div key={index}>
              {msg.role === 'user' ? (
                <UserMessage content={msg.content} />
              ) : (
                <AIMessage content={msg.content} />
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
