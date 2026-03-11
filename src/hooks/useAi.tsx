import { savetoDb, sendmessagetoAi } from '@/services/aiservices';
import { useMutation } from '@tanstack/react-query';

export const useAIChat = () => {
  return useMutation({
    mutationFn: sendmessagetoAi,
    onSuccess: async (response) => {
      const { model, response: aiResponse, total_duration } = response;
      await savetoDb({ model, aiResponse, total_duration });
    },
  });
};
