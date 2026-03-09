import { sendmessagetoAi } from '@/services/aiservices';
import { useMutation } from '@tanstack/react-query';

export const useAIChat = () => {
  return useMutation({
    mutationFn: sendmessagetoAi,
  });
};
