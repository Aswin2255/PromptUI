import api from '@/lib/axiosinstance';
import axios from 'axios';

interface AIRESPOSNE {
  url: string;
  apikey?: string;
  message: string;
  model: string;
  type: 'local' | 'cloud';
  randomChatid: string;
  userdetails: string | null;
  usermessageid: string;
  aimessageid: string;
}
interface CHATREPSONSE {
  model: string;
  aiResponse: string;
  total_duration: number;
  randomid: string;
  userMsg: string;
  userdetails: string | null;
}
export const sendmessagetoAi = async ({
  url,
  apikey,
  message,
  model,
  onChunk,
}: AIRESPOSNE & { onChunk: (text: string) => void }) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apikey ? `Bearer ${apikey}` : '',
      },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body found');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        const parsed = JSON.parse(line);
        const chunk = parsed.response || '';

        fullText += chunk;
        onChunk(fullText);
      }
    }

    return {
      response: fullText,
    };
  } catch (error) {
    throw error;
  }
};

export const savetoDb = async (details: CHATREPSONSE) => {
  try {
    const { data } = await api.post('/api/chat', details);
  } catch (error) {
    console.log(error);
  }
};

export const getmessageHistory = async () => {
  try {
    const { data } = await api.get('/api/chat');
    if (data.status) {
      return data.chathistory;
    }
  } catch (error) {
    throw error;
  }
};
