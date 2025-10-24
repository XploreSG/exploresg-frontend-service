export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: number };
  userReactions?: string[];
}

export interface ChatSidebarProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onCopyMessage?: (content: string) => void;
  onClearChat?: () => void;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  onCopyMessage?: (content: string) => void;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}
