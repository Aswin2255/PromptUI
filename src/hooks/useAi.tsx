import { useChatHistory, useMessage } from '@/lib/zustand/store';
import {
  getchatHistory,
  getmessageHistory,
  savetoDb,
  sendmessagetoAi,
} from '@/services/aiservices';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChathistory = (chatId: string) => {
  const setChats = useMessage((state) => state.setchatMessage);

  const query = useQuery({
    queryKey: ['chatHistory', chatId],
    queryFn: () => getchatHistory(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      setChats(query.data);
    }
  }, [query.data]);

  return query;
};

export const useGetMessageHistory = () => {
  console.log('use get message hostory is running....');
  const { setChats } = useChatHistory();

  const query = useQuery({
    queryKey: ['messageHistory'],
    queryFn: getmessageHistory,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log('useeffect works');
    if (query.data) {
      setChats(query.data);
    }
  }, [query.data, setChats]);

  return query; // ✅ still returns query so you can use isLoading, isError etc in component
};

export const useAIChat = () => {
  const messageDetails = useMessage((state) => state.messageDetails);
  const updateMessage = useMessage((state) => state.updateMessage);
  const setTyping = useMessage((state) => state.setTyping);
  return useMutation({
    mutationFn: sendmessagetoAi,
    onSuccess: async (response, variables) => {
      const {
        model,
        response: aiResponse,
        total_duration,
        usermessageid,
      } = response;
      const { aimessageid } = variables;
      console.log(aimessageid);
      console.log(aiResponse);
      updateMessage(aimessageid, aiResponse);
      setTyping(aimessageid, false);

      const randomid = variables?.randomChatid; //we will get every thing passed to the mutate function here
      const userMsg = variables.message;
      const userdetails = variables.userdetails;

      await savetoDb({
        model,
        aiResponse,
        total_duration,
        randomid,
        userMsg,
        userdetails,
      });
    },
  });
};
