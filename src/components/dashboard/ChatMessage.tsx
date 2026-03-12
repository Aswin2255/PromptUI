'use client';
import { Bot } from 'lucide-react';
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
export default function ChatMessage() {
  const { messageDetails } = useMessage();
  const { isTyping } = useTyping();
  return (
    <>
      {messageDetails?.length && (
        <>
          {messageDetails?.map((msg) => {
            return (
              <>
                {isTyping && <TypingIndicator />}

                <h1>{msg.role}</h1>
                <p>{msg.content}</p>
              </>
            );
          })}
        </>
      )}
    </>
  );
}
