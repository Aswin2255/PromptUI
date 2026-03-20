'use client';

import {
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Plus,
  Send,
  Mic,
  Paperclip,
  ChevronDown,
  Key,
  Loader2,
} from 'lucide-react';

interface Model {
  id: string;
  label: string;
}

const MODELS: Model[] = [
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { id: 'o1', label: 'o1' },
  { id: 'o1-mini', label: 'o1 mini' },
];

interface ChatInputBoxProps {
  /** Pass true when the chat history is non-empty (makes the box full-width) */
  hasMessages?: boolean;
  onSend?: (message: string, files: string[]) => void;
}

export default function PromptinputBox({
  hasMessages = false,
  onSend,
}: ChatInputBoxProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* auto-grow textarea */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || isPending) return;
    setIsPending(true);
    onSend?.(message, attachedFiles);
    /* Simulate async — replace with your real send logic */
    setTimeout(() => {
      setMessage('');
      setAttachedFiles([]);
      setIsPending(false);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, 800);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map((f) => f.name);
    setAttachedFiles((prev) => [...prev, ...names]);
    e.target.value = '';
  };

  const removeFile = (name: string) =>
    setAttachedFiles((prev) => prev.filter((f) => f !== name));

  const canSend = (!!message.trim() || attachedFiles.length > 0) && !isPending;

  return (
    <TooltipProvider delayDuration={300}>
      {/* ── Fixed bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pb-5 pt-10 bg-gradient-to-t from-[#212121] via-[#212121]/95 to-transparent pointer-events-none">
        {/* Input card — pointer-events back on so it's clickable */}
        <div
          className={cn(
            'w-full pointer-events-auto',
            'rounded-2xl border border-white/[0.08] bg-[#2f2f2f] shadow-2xl',
            'transition-[border-color] duration-200 focus-within:border-white/20',
            !hasMessages && 'max-w-2xl',
          )}
        >
          {/* ── Attached file chips ── */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {attachedFiles.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1.5 pr-1 text-xs font-normal bg-white/[0.07] text-[#acacac] border border-white/10"
                >
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="max-w-[120px] truncate">{name}</span>
                  <button
                    onClick={() => removeFile(name)}
                    className="ml-0.5 px-0.5 text-sm leading-none text-[#777] hover:text-red-400 transition-colors rounded-full"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* ── Textarea ── */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            rows={1}
            className={cn(
              'resize-none border-none bg-transparent px-4 pb-2 pt-3.5 shadow-none',
              'text-[15px] leading-relaxed text-[#ececec] placeholder:text-[#8e8ea0]',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              'overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10',
              hasMessages
                ? 'min-h-[44px] max-h-[200px]'
                : 'min-h-[60px] max-h-[200px]',
            )}
          />

          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
            {/* Left: attach + model picker */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-[#8e8ea0] hover:text-[#ececec] hover:bg-white/[0.08]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-[#1a1a1a] border-white/10 text-[#aaa] text-xs"
                >
                  Attach files
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl px-2.5 text-xs font-medium text-[#8e8ea0] hover:text-[#ececec] hover:bg-white/[0.08]"
                  >
                    <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shrink-0" />
                    {selectedModel.label}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-52 rounded-xl border-white/10 bg-[#2f2f2f] shadow-2xl"
                >
                  <DropdownMenuLabel className="text-xs font-normal text-[#666]">
                    Select model
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/[0.07]" />

                  {MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        'gap-2 rounded-lg text-sm text-[#ececec] cursor-pointer',
                        'focus:bg-white/[0.07] focus:text-[#ececec]',
                        model.id === selectedModel.id && 'bg-emerald-500/10',
                      )}
                    >
                      <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shrink-0" />
                      <span className="flex-1">{model.label}</span>
                      {model.id === selectedModel.id && (
                        <span className="text-xs text-emerald-400">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator className="bg-white/[0.07]" />
                  <DropdownMenuItem className="gap-2 rounded-lg text-sm text-[#8e8ea0] cursor-pointer focus:bg-white/[0.07] focus:text-[#acacac]">
                    <Key className="h-3.5 w-3.5" />
                    Add model / API key
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: mic + send */}
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-[#8e8ea0] hover:text-[#ececec] hover:bg-white/[0.08]"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-[#1a1a1a] border-white/10 text-[#aaa] text-xs"
                >
                  Voice input
                </TooltipContent>
              </Tooltip>

              <Button
                size="icon"
                disabled={!canSend}
                onClick={handleSend}
                className={cn(
                  'h-8 w-8 rounded-xl transition-all duration-150 active:scale-95',
                  canSend
                    ? 'bg-[#ececec] text-[#212121] hover:bg-white'
                    : 'bg-white/10 text-[#555] cursor-not-allowed opacity-100',
                )}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="pointer-events-auto text-[11px] text-[#555] select-none">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </TooltipProvider>
  );
}
