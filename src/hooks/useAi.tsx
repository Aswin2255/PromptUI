import { useMessage } from '@/lib/zustand/store';
import {
  getmessageHistory,
  savetoDb,
  sendmessagetoAi,
} from '@/services/aiservices';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useGetMessageHistory = () => {
  const { setchatMessage } = useMessage();

  const query = useQuery({
    queryKey: ['messageHistory'],
    queryFn: getmessageHistory,
  });

  useEffect(() => {
    if (query.data) {
      setchatMessage(query.data);
    }
  }, [query.data, setchatMessage]);

  return query; // ✅ still returns query so you can use isLoading, isError etc in component
};

export const useAIChat = () => {
  return useMutation({
    mutationFn: sendmessagetoAi,
    onSuccess: async (response, variables) => {
      const { model, response: aiResponse, total_duration } = response;
      const randomid = variables?.randomChatid; //we will get every thing passed to the mutate function here
      const userMsg = variables.message;
      await savetoDb({ model, aiResponse, total_duration, randomid, userMsg });
    },
  });
};
