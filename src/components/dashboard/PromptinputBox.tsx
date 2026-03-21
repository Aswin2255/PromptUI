'use client';

// ── Theme CSS (inject via a <style> tag or your global CSS file) ──
// Paste the block below into your globals.css if preferred.
const THEME_STYLES = `
  :root {
    --bg-page:        #ffffff;
    --bg-card:        #f4f4f4;
    --border:         rgba(0, 0, 0, 0.08);
    --border-focus:   rgba(0, 0, 0, 0.18);
    --text-primary:   #111111;
    --text-secondary: #666666;
    --text-placeholder: #aaaaaa;
    --chip-bg:        rgba(0, 0, 0, 0.05);
    --chip-border:    rgba(0, 0, 0, 0.08);
    --dropdown-bg:    #ffffff;
    --item-hover:     rgba(0, 0, 0, 0.05);
    --item-active:    rgba(16, 185, 129, 0.08);
    --scrollbar-thumb: rgba(0, 0, 0, 0.12);
  }

  textarea::placeholder { color: var(--text-placeholder); }

  .dark {
    --bg-page:        #212121;
    --bg-card:        #2f2f2f;
    --border:         rgba(255, 255, 255, 0.08);
    --border-focus:   rgba(255, 255, 255, 0.20);
    --text-primary:   #ececec;
    --text-secondary: #8e8ea0;
    --text-placeholder: #8e8ea0;
    --chip-bg:        rgba(255, 255, 255, 0.07);
    --chip-border:    rgba(255, 255, 255, 0.10);
    --dropdown-bg:    #2f2f2f;
    --item-hover:     rgba(255, 255, 255, 0.07);
    --item-active:    rgba(16, 185, 129, 0.10);
    --scrollbar-thumb: rgba(255, 255, 255, 0.10);
  }
`;

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
import { Plus, Paperclip, ChevronDown, Key } from 'lucide-react';

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

export default function PromptinputBox({ onSend }: ChatInputBoxProps) {
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

  return (
    <TooltipProvider delayDuration={300}>
      {/* ── Theme styles ── */}
      <style dangerouslySetInnerHTML={{ __html: THEME_STYLES }} />

      {/* ── Fixed bottom bar ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 px-4 pb-5 w-full max-w-2xl pointer-events-none">
        {/* Input card */}
        <div
          className="w-full pointer-events-auto rounded-2xl transition-[border-color] duration-200"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
          onFocus={() => {}}
        >
          {/* ── Attached file chips ── */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {attachedFiles.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1.5 pr-1 text-xs font-normal"
                  style={{
                    background: 'var(--chip-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--chip-border)',
                  }}
                >
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="max-w-30 truncate">{name}</span>
                  <button
                    onClick={() => removeFile(name)}
                    className="ml-0.5 px-0.5 text-sm leading-none hover:text-red-400 transition-colors rounded-full"
                    style={{ color: 'var(--text-secondary)' }}
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
              'text-[15px] leading-relaxed',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              'overflow-y-auto scrollbar-thin scrollbar-track-transparent',
              'min-h-15 max-h-50',
            )}
            style={{
              color: 'var(--text-primary)',
              // placeholder color via CSS variable trick
            }}
          />

          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
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
                    className="h-8 w-8 rounded-xl transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-xs"
                  style={{
                    background: 'var(--dropdown-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Attach files
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl px-2.5 text-xs font-medium transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="h-1.75 w-1.75 rounded-full bg-emerald-400 shrink-0" />
                    {selectedModel.label}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-52 rounded-xl shadow-2xl"
                  style={{
                    background: 'var(--dropdown-bg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <DropdownMenuLabel
                    className="text-xs font-normal"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Select model
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator
                    style={{ background: 'var(--border)' }}
                  />

                  {MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className="gap-2 rounded-lg text-sm cursor-pointer"
                      style={{
                        color: 'var(--text-primary)',
                        background:
                          model.id === selectedModel.id
                            ? 'var(--item-active)'
                            : undefined,
                      }}
                    >
                      <span className="h-1.75 w-1.75 rounded-full bg-emerald-400 shrink-0" />
                      <span className="flex-1">{model.label}</span>
                      {model.id === selectedModel.id && (
                        <span className="text-xs text-emerald-400">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator
                    style={{ background: 'var(--border)' }}
                  />
                  <DropdownMenuItem
                    className="gap-2 rounded-lg text-sm cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Key className="h-3.5 w-3.5" />
                    Add model / API key
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
