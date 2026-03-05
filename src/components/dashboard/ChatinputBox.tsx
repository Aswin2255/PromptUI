'use client';

import { useState, useRef } from 'react';
import { Paperclip, Plus, Send, ChevronDown, Key, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const MODELS = [
  {
    id: 'claude-sonnet-4-20250514',
    label: 'Claude Sonnet 4',
    provider: 'Anthropic',
    color: 'bg-orange-500',
  },
  {
    id: 'claude-opus-4',
    label: 'Claude Opus 4',
    provider: 'Anthropic',
    color: 'bg-orange-600',
  },
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', color: 'bg-green-500' },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    provider: 'OpenAI',
    color: 'bg-green-400',
  },
  {
    id: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    provider: 'Google',
    color: 'bg-blue-500',
  },
];

export default function ChatInputBox() {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const removeFile = (name: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f !== name));
  };

  const handleSend = () => {
    if (!message.trim() && attachedFiles.length === 0) return;
    // Handle send logic
    setMessage('');
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh]">
      {/* Greeting / Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          What can I help you with?
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a model, attach files, and start chatting.
        </p>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-sm">
        {/* Attached files */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {attachedFiles.map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="gap-1 pr-1 text-xs font-normal"
              >
                <Paperclip className="h-3 w-3" />
                {name}
                <button
                  onClick={() => removeFile(name)}
                  className="ml-1 rounded-full hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Textarea */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          className={cn(
            'min-h-[100px] resize-none border-none bg-transparent px-4 pt-4 pb-2',
            'text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none',
          )}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
          <div className="flex items-center gap-1">
            {/* Attach file */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Model selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span
                    className={cn('h-2 w-2 rounded-full', selectedModel.color)}
                  />
                  {selectedModel.label}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  Select model
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className="gap-2 text-sm"
                  >
                    <span className={cn('h-2 w-2 rounded-full', model.color)} />
                    <span className="flex-1">{model.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.provider}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setAddModelOpen(true)}
                  className="gap-2 text-sm text-muted-foreground"
                >
                  <Key className="h-3.5 w-3.5" />
                  Add model / API key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Send button */}
          <Button
            size="icon"
            className="h-8 w-8 rounded-lg"
            disabled={!message.trim() && attachedFiles.length === 0}
            onClick={handleSend}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Add Model / API Key Dialog */}
      <Dialog open={addModelOpen} onOpenChange={setAddModelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Add Model & API Key
            </DialogTitle>
            <DialogDescription>
              Connect a new provider by entering your API key.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Select onValueChange={setNewProvider}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="google">Google (Gemini)</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="custom">Custom / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input
                id="apikey"
                type="password"
                placeholder="sk-••••••••••••••••"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModelOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newProvider || !newApiKey}
              onClick={() => {
                // Handle save API key logic
                setAddModelOpen(false);
                setNewApiKey('');
                setNewProvider('');
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
