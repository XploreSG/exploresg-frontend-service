import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatSidebar from './ChatSidebar';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: number };
  userReactions?: string[];
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(() => {
    // Check localStorage for saved expanded state
    const saved = localStorage.getItem('chatExpanded');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Load chat history from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
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
    return [
      {
        id: '1',
        content: "Hi! I'm your ExploreSG travel assistant. I can help you plan your Singapore itinerary, find the perfect rental car, and answer any questions about exploring Singapore. How can I help you today?",
        role: 'assistant' as const,
        timestamp: new Date(),
        status: 'read' as const
      }
    ];
  });
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
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (content: string, role: 'user' | 'assistant', status?: 'sending' | 'sent' | 'delivered' | 'read') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      status: status || (role === 'user' ? 'sending' : 'read'),
      reactions: {},
      userReactions: []
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
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
    }));
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleClearChat = () => {
    // Clear messages and reset to initial state
    const initialMessage = {
      id: '1',
      content: "Hi! I'm your ExploreSG travel assistant. I can help you plan your Singapore itinerary, find the perfect rental car, and answer any questions about exploring Singapore. How can I help you today?",
      role: 'assistant' as const,
      timestamp: new Date(),
      status: 'read' as const
    };
    
    setMessages([initialMessage]);
    
    // Clear localStorage
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatScrollPosition');
    
    console.log('Chat cleared');
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {/* Chat Button */}
            {!isOpen && (
              <button
                onClick={toggleChat}
                className="bg-red-600/80 hover:bg-red-600 active:bg-red-700 text-white rounded-full p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200 touch-manipulation"
                aria-label="Open chat"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            )}

      {/* Chat Sidebar */}
      {isOpen && (
        <div className="relative animate-in zoom-in-95 slide-in-from-bottom-4 slide-in-from-right-4 fade-in duration-300">
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
