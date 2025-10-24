import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatSidebar from './ChatSidebar';
import type { Message } from '../types/chat';
import { createMessage, loadChatHistory, saveToLocalStorage, handleReaction as updateReaction, copyToClipboard, clearChatHistory } from '../utils/chatUtils';
import { CONTAINER_STYLES, ANIMATION_STYLES } from '../constants/chatStyles';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(() => {
    // Check localStorage for saved expanded state
    const saved = localStorage.getItem('chatExpanded');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Load chat history from localStorage
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll restoration when chat state changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup effect to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Don't reset expanded state - let it persist from localStorage
  };

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    saveToLocalStorage('chatHistory', messages);
  }, [messages]);

  const addMessage = (content: string, role: 'user' | 'assistant', status?: 'sending' | 'sent' | 'delivered' | 'read') => {
    const newMessage = createMessage(content, role, status);
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => updateReaction(prev, messageId, emoji));
  };

  const handleCopyMessage = (content: string) => {
    copyToClipboard(content);
  };

  const handleClearChat = () => {
    setMessages(loadChatHistory());
    clearChatHistory();
  };

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    // Save expanded state to localStorage
    localStorage.setItem('chatExpanded', JSON.stringify(newExpanded));
  };

  const sendMessage = async (content: string) => {
    // Add user message with sending status
    const userMessage = addMessage(content, 'user', 'sending');
    
    // Show typing indicator immediately
    setIsLoading(true);

    try {
      // Import Gemini API utility
      const { getQuickResponse } = await import('../utils/geminiApi');
      
      // Update user message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      ));
      
      // Get AI response immediately - no artificial delay
      const response = await getQuickResponse(content);
      addMessage(response, 'assistant', 'read');
      
      // Update user message status to delivered
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'delivered' as const }
          : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'assistant', 'read');
      
      // Update user message status to delivered even on error
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'delivered' as const }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={CONTAINER_STYLES.chatWidget}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={CONTAINER_STYLES.chatButton}
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      )}

      {/* Chat Sidebar */}
      {isOpen && (
        <div className={`relative ${ANIMATION_STYLES.zoomIn}`}>
          <ChatSidebar
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onClose={() => setIsOpen(false)}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
            onReaction={handleReaction}
            onCopyMessage={handleCopyMessage}
            onClearChat={handleClearChat}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
