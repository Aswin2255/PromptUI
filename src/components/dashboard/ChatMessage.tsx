'use client';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useMessage } from '@/lib/zustand/store';
import ReactMarkdown from 'react-markdown';
import { useChathistory } from '@/hooks/useAi';
import { useParams } from 'next/navigation';

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

export function AIMessage({ content, typing = false }: AIMessageProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
        <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
        {typing ? (
          <div className="flex items-center gap-1 py-1">
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
          </div>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-w-none
            prose-p:leading-relaxed prose-p:my-1
            prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
            prose-ul:my-1 prose-li:my-0.5
            prose-strong:text-foreground
            prose-code:bg-muted-foreground/20 prose-code:px-1.5 prose-code:py-0.5
            prose-code:rounded prose-code:text-xs prose-code:before:content-none
            prose-code:after:content-none"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
export default function ChatMessage() {
  const messageDetails = useMessage((state) => state.messageDetails);
  const messageHistory = messageDetails;
  const params = useParams();
  const chatId: string = params.id;
  const { isLoading } = useChathistory(chatId);

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
