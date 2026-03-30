'use client';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useMessage } from '@/lib/zustand/store';

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
interface AIMessageProps {
  content: string;
  typing?: boolean;
}

function AIMessage({ content, typing = false }: AIMessageProps) {
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
        {typing ? (
          <div className="flex items-center gap-1 py-1">
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{content}</p>
        )}
      </div>
    </div>
  );
}
export default function ChatMessage() {
  const { messageDetails } = useMessage();
  const messageHistory = messageDetails;
  console.log(messageHistory);

  return (
    <div className="mx-4 mb-6 h-[60vh] container overflow-hidden rounded-2xl  bg-background shadow-sm">
      <div className="h-full overflow-y-auto p-3">
        {messageHistory?.length ? (
          <div className="flex flex-col gap-2">
            {messageHistory.map((msg) => (
              <div key={msg.chatsession_id}>
                {msg.role === 'user' ? (
                  <UserMessage content={msg.message} />
                ) : (
                  <AIMessage content={msg.message} typing={msg.typing} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
