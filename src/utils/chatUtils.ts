import type { Message } from '../types/chat';

export const createMessage = (
  content: string, 
  role: 'user' | 'assistant', 
  status?: 'sending' | 'sent' | 'delivered' | 'read'
): Message => ({
  id: Date.now().toString(),
  content,
  role,
  timestamp: new Date(),
  status: status || (role === 'user' ? 'sending' : 'read'),
  reactions: {},
  userReactions: []
});

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
  }
  return defaultValue;
};

export const loadChatHistory = (): Message[] => {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }
  return getInitialMessage();
};

export const getInitialMessage = (): Message[] => [
  {
    id: '1',
    content: "Hi! I'm your ExploreSG travel assistant. I can help you plan your Singapore itinerary, find the perfect rental car, and answer any questions about exploring Singapore. How can I help you today?",
    role: 'assistant' as const,
    timestamp: new Date(),
    status: 'read' as const
  }
];

export const clearChatHistory = (): void => {
  localStorage.removeItem('chatHistory');
  localStorage.removeItem('chatScrollPosition');
};

export const handleReaction = (
  messages: Message[], 
  messageId: string, 
  emoji: string
): Message[] => {
  return messages.map(msg => {
    if (msg.id === messageId) {
      const currentReactions = msg.reactions || {};
      const currentUserReactions = msg.userReactions || [];
      
      // Toggle reaction
      const hasReaction = currentUserReactions.includes(emoji);
      const newUserReactions = hasReaction 
        ? currentUserReactions.filter(r => r !== emoji)
        : [...currentUserReactions, emoji];
      
      const newReactions = { ...currentReactions };
      if (hasReaction) {
        newReactions[emoji] = (newReactions[emoji] || 1) - 1;
        if (newReactions[emoji] <= 0) {
          delete newReactions[emoji];
        }
      } else {
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
      }
      
      return {
        ...msg,
        reactions: newReactions,
        userReactions: newUserReactions
      };
    }
    return msg;
  });
};

export const copyToClipboard = async (content: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
};

export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
};
