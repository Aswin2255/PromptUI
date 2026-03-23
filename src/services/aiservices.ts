import api from '@/lib/axiosinstance';
import axios from 'axios';

interface AIRESPOSNE {
  url: string;
  apikey?: string;
  message: string;
  model: string;
  type: 'local' | 'cloud';
  randomChatid: string;
}
interface CHATREPSONSE {
  model: string;
  aiResponse: string;
  total_duration: number;
  randomid: string;
  userMsg: string;
}
export const sendmessagetoAi = async ({
  url,
  apikey,
  message,
  model,
}: AIRESPOSNE) => {
  try {
    const { data } = await axios.post(
      url,
      {
        model: model,
        prompt: message,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: apikey ? `Bearer ${apikey}` : undefined,
        },
      },
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const savetoDb = async (details: CHATREPSONSE) => {
  try {
    console.log('reached');

    const { data } = await api.post('/api/chat', details);
    console.log(data);
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
