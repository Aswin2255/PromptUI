import axios from 'axios';

interface AIRESPOSNE {
  url: string;
  apikey?: string;
  message: string;
  model: string;
  type: 'local' | 'cloud';
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

    return data.response;
  } catch (error) {
    throw error;
  }
};
