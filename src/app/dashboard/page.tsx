import ChatInputBox from '@/components/dashboard/ChatinputBox';
import ChatMessage from '@/components/dashboard/ChatMessage';

export default async function Dashboard() {
  return (
    <>
      <ChatMessage />
      <ChatInputBox />;
    </>
  );
}
