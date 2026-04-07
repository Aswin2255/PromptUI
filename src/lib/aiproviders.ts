// lib/aiProvider.ts
import axios from 'axios';
type Provider = 'openai' | 'anthropic' | 'google';

const PROVIDERS = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    endpoint: '/chat/completions',
  },
  anthropic: {
    baseURL: 'https://api.anthropic.com/v1',
    endpoint: '/messages',
  },
  google: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    endpoint: '/models', // will append :generateContent
  },
};

// Map model → provider
export function getProviderFromModel(model: string): Provider {
  if (model.startsWith('gpt-')) return 'openai';
  if (model.startsWith('claude-')) return 'anthropic';
  if (model.startsWith('gemini-')) return 'google';

  throw new Error(`Unsupported model: ${model}`);
}

// Main helper
export function getModelApiUrl(model: string): string {
  const provider = getProviderFromModel(model);
  const config = PROVIDERS[provider];

  if (provider === 'google') {
    return `${config.baseURL}/${model}:generateContent`;
  }

  return `${config.baseURL}${config.endpoint}`;
}

export async function callAI({
  model,
  messages,
  apiKey,
  maxTokens = 500,
}: {
  model: string;
  messages: Message[];
  apiKey: string;
  maxTokens?: number;
}) {
  const provider = getProviderFromModel(model);
  const url = getModelApiUrl(model);

  switch (provider) {
    case 'openai': {
      const { data } = await axios.post(
        url,
        { model, messages, max_tokens: maxTokens },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
      return data.choices[0].message.content;
    }

    case 'anthropic': {
      const system = messages.find((m) => m.role === 'system')?.content;
      const filtered = messages.filter((m) => m.role !== 'system');

      const { data } = await axios.post(
        url,
        {
          model,
          messages: filtered,
          max_tokens: maxTokens,
          ...(system && { system }),
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        },
      );

      return data.content[0].text;
    }

    case 'google': {
      const contents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const { data } = await axios.post(`${url}?key=${apiKey}`, { contents });

      return data.candidates[0].content.parts[0].text;
    }
  }
}
