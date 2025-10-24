import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatSidebar from './ChatSidebar';
import { 
  handleReaction as updateReaction, 
  copyToClipboard, 
  clearChatHistory,
  getInitialMessage
} from '../utils/chatUtils';
import { CONTAINER_STYLES, ANIMATION_STYLES } from '../constants/chatStyles';
import { useChat } from '../hooks/useChat';

const ChatWidget: React.FC = () => {
  const {
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
  } = useChat();

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => updateReaction(prev, messageId, emoji));
  };

  const handleCopyMessage = (content: string) => {
    copyToClipboard(content);
  };

  const handleClearChat = () => {
    setMessages(getInitialMessage());
    clearChatHistory();
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
      updateMessage(userMessage.id, 'sent');
      
      // Get AI response immediately - no artificial delay
      const response = await getQuickResponse(content);
      addMessage(response, 'assistant', 'read');
      
      // Update user message status to delivered
      updateMessage(userMessage.id, 'delivered');
    } catch (error) {
      console.error('Chat error:', error);
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'assistant', 'read');
      
      // Update user message status to delivered even on error
      updateMessage(userMessage.id, 'delivered');
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
