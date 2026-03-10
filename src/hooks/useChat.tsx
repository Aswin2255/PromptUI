import { useMessage, useModel } from '@/lib/zustand/store';

export function useModelHook() {
  const { modelDetails, setModel, clearModel } = useModel();
  const { messageDetails, setchatMessage } = useMessage();

  return {
    modelDetails,
    setModel,
    clearModel,
    messageDetails,
    setchatMessage,
  };
}
