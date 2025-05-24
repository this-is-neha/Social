//chatWrapper/index.tsx
import { useParams } from 'react-router-dom';
import Chat from '../chat';

const ChatWrapper = () => {
  const { userId } = useParams<{ userId: string }>();
  
  if (!userId) return <p>No user ID specified for chat.</p>;

  return <Chat userId={userId} />;
};

export default ChatWrapper;
