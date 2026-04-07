import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu, Shield, Lock } from 'lucide-react';

const CLOUD_MODELS = [
  'gpt-4o',
  'gpt-4.1',
  'claude-3.7-sonnet',
  'gemini-2.5-pro',
];

interface Model {
  modelname: string;
  url: string;
  apikey?: string;
  type: 'local' | 'cloud';
}

interface AddModelDialogProps {
  addModelOpen: boolean;
  setAddModelOpen: (open: boolean) => void;
  onSave?: (model: Model) => void;
}

export function AddModelDialog({
  addModelOpen,
  setAddModelOpen,
  onSave,
}: AddModelDialogProps) {
  const [modelType, setModelType] = useState<'local' | 'cloud'>('cloud');
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');

  const isFormValid = Boolean(modelName && (modelType === 'local' || apiKey));

  const handleModelTypeChange = (type: 'local' | 'cloud') => {
    setModelType(type);
    setModelName('');
  };

  const handleSave = () => {
    const modelData: Model = {
      modelname: modelName,
      url: '',
      apikey: modelType === 'cloud' ? apiKey : '',
      type: modelType,
    };

    onSave?.(modelData);
    handleReset();
  };

  const handleReset = () => {
    setAddModelOpen(false);
    setModelName('');
    setApiKey('');
    setModelType('cloud');
  };

  return (
    <Dialog open={addModelOpen} onOpenChange={setAddModelOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Add Model
          </DialogTitle>
          <DialogDescription>Enter the model details below.</DialogDescription>
        </DialogHeader>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            <span className="font-semibold">
              Your API keys are never stored on our servers.
            </span>{' '}
            They remain only in your browser.
          </p>
        </div>

        <div className="grid gap-4 py-2">
          {/* Model Type */}
          <div className="grid gap-2">
            <Label>Model Type</Label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant={modelType === 'local' ? 'default' : 'outline'}
                onClick={() => handleModelTypeChange('local')}
                className="flex-1"
              >
                Local Model
              </Button>

              <Button
                type="button"
                variant={modelType === 'cloud' ? 'default' : 'outline'}
                onClick={() => handleModelTypeChange('cloud')}
                className="flex-1"
              >
                Cloud Model
              </Button>
            </div>
          </div>

          {/* Model Name */}
          <div className="grid gap-2">
            <Label htmlFor="modelname">Model Name</Label>
            {modelType === 'cloud' ? (
              <Select value={modelName} onValueChange={setModelName}>
                <SelectTrigger id="modelname" className="w-full">
                  <SelectValue placeholder="Select a cloud model" />
                </SelectTrigger>
                <SelectContent>
                  {CLOUD_MODELS.map((cloudModel) => (
                    <SelectItem key={cloudModel} value={cloudModel}>
                      {cloudModel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="modelname"
                placeholder="e.g. llama3"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            )}
          </div>

          {/* API Key (only for cloud) */}
          {modelType === 'cloud' && (
            <div className="grid gap-2">
              <Label htmlFor="apikey" className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                API Key
              </Label>

              <Input
                id="apikey"
                type="password"
                placeholder="sk-••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>

          <Button disabled={!isFormValid} onClick={handleSave}>
            Save Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
