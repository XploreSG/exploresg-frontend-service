import React, { useRef, useEffect, useState } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, TrashIcon } from '@heroicons/react/24/outline';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatSidebarProps } from '../types/chat';
import { saveScrollPosition, loadScrollPosition, createScrollToBottom } from '../utils/chatUtils';
import { getRecommendedPrompts } from '../utils/recommendedPrompts';

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  isExpanded,
  onToggleExpand,
  onReaction,
  onCopyMessage,
  onClearChat
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    createScrollToBottom(messagesEndRef.current);
  };

  // Save scroll position when scrolling
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      saveScrollPosition(messagesContainerRef.current.scrollTop);
    }
  };

  // Track if we've restored the initial position
  const [hasRestoredInitialPosition, setHasRestoredInitialPosition] = useState(false);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScrollPosition = loadScrollPosition();
    if (savedScrollPosition && messagesContainerRef.current) {
      const timer = setTimeout(() => {
        messagesContainerRef.current!.scrollTop = savedScrollPosition;
        setHasRestoredInitialPosition(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setHasRestoredInitialPosition(true);
    }
  }, []);

  // Auto-scroll to bottom only for new messages (not on initial load)
  useEffect(() => {
    if (hasRestoredInitialPosition && messages.length > 0) {
      // Check if this is a new message by comparing with previous count
      const isNewMessage = messages.length > 1;
      if (isNewMessage) {
        scrollToBottom();
      }
    }
  }, [messages.length, hasRestoredInitialPosition]);


  const quickActions = messages.length === 1 ? [
    { label: "🗓️ 3-Day Itinerary", action: "Give me a 3-day itinerary plan for Singapore" },
    { label: "🚗 Find a car", action: "I'd like to find a rental car" },
    { label: "🍜 Best food", action: "What are the best local foods to try in Singapore?" },
    { label: "🏨 Hotels", action: "Recommend good hotels in Singapore" },
    { label: "🎫 Attractions", action: "What are the must-visit attractions in Singapore?" },
    { label: "🚇 Transportation", action: "How to get around Singapore?" },
    { label: "🌤️ Weather", action: "What's the weather like today?" },
    { label: "💰 Budget tips", action: "How to save money in Singapore?" },
    { label: "❓ Help", action: "I need help with something" }
  ] : getRecommendedPrompts(messages[messages.length - 1]?.content || '', messages.length);

  const handleQuickAction = (action: string) => {
    onSendMessage(action);
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
  };


  return (
    <div 
      className={`bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 transform-gpu transition-all duration-300 ${
        isExpanded 
          ? 'w-[98vw] sm:w-[600px] h-[85vh] sm:h-[700px]' 
          : 'w-[95vw] sm:w-[450px] h-[75vh] sm:h-[600px]'
      }`}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-red-600 text-white p-4 sm:p-5 rounded-t-xl flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base sm:text-lg">ExploreSG Assistant</h3>
          <p className="text-xs sm:text-sm opacity-90">Your travel companion</p>
        </div>
           <div className="flex items-center space-x-1 sm:space-x-2">
             {messages.length > 1 && onClearChat && (
               <button
                 onClick={handleClearChat}
                 className="text-white hover:text-red-200 active:text-red-300 transition-all duration-300 p-2 rounded-full hover:bg-red-700 active:bg-red-800 hover:scale-110 active:scale-95 touch-manipulation"
                 aria-label="Clear chat"
                 title="Clear chat history"
               >
                 <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
               </button>
             )}
             <button
               onClick={onToggleExpand}
               className="text-white hover:text-red-200 active:text-red-300 transition-all duration-300 p-2 rounded-full hover:bg-red-700 active:bg-red-800 hover:scale-110 active:scale-95 touch-manipulation"
               aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
             >
               {isExpanded ? (
                 <ArrowsPointingInIcon className="h-4 w-4 sm:h-5 sm:w-5" />
               ) : (
                 <ArrowsPointingOutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
               )}
             </button>
             <button
               onClick={onClose}
               className="text-white hover:text-red-200 active:text-red-300 transition-all duration-300 p-2 rounded-full hover:bg-red-700 active:bg-red-800 hover:scale-110 active:scale-95 transform hover:rotate-90 touch-manipulation"
               aria-label="Close chat"
             >
               <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
             </button>
           </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50" 
        onWheel={(e) => e.stopPropagation()}
        onScroll={handleScroll}
      >
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          onReaction={onReaction}
          onCopyMessage={onCopyMessage}
        />
        <div ref={messagesEndRef} />
      </div>

        {/* Quick Actions */}
        {messages.length > 0 && (
          <div className="p-2 sm:p-3 border-t border-gray-200 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300">
            <p className="text-xs text-gray-600 mb-1.5 font-medium">
              {messages.length === 1 ? 'Quick actions:' : 'Suggested follow-ups:'}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 text-xs px-2.5 py-1.5 rounded-full transition-all duration-200 hover:border-red-300 active:border-red-400 hover:scale-105 active:scale-95 font-medium shadow-sm touch-manipulation"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Input */}
      <div className="p-3 sm:p-5 border-t border-gray-200">
        <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatSidebar;
