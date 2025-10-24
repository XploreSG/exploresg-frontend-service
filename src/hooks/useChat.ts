import { useState, useEffect } from 'react';
import type { Message } from '../types/chat';
import { 
  createMessage, 
  loadChatHistory, 
  saveToLocalStorage, 
  updateMessageStatus,
  disableBodyScroll,
  enableBodyScroll
} from '../utils/chatUtils';

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('chatExpanded');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll restoration when chat state changes
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    
    return () => {
      enableBodyScroll();
    };
  }, [isOpen]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    saveToLocalStorage('chatHistory', messages);
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (content: string, role: 'user' | 'assistant', status?: 'sending' | 'sent' | 'delivered' | 'read') => {
    const newMessage = createMessage(content, role, status);
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const updateMessage = (messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read') => {
    setMessages(prev => updateMessageStatus(prev, messageId, status));
  };

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    saveToLocalStorage('chatExpanded', newExpanded);
  };

  return {
    isOpen,
    setIsOpen,
    isExpanded,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    toggleChat,
    addMessage,
    updateMessage,
    handleToggleExpand
  };
};
