import { useModel } from '@/lib/zustand/store';

export function useModelHook() {
  const { modelDetails, setModel, clearModel } = useModel();

  return {
    modelDetails,
    setModel,
    clearModel,
  };
}
