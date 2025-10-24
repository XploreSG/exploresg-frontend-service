import React, { useState } from 'react';
import { HeartIcon, HandThumbUpIcon, HandThumbDownIcon, FaceSmileIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, HandThumbUpIcon as ThumbsUpSolid, HandThumbDownIcon as ThumbsDownSolid, FaceSmileIcon as FaceSmileSolid } from '@heroicons/react/24/solid';
import TypingIndicator from './TypingIndicator';
import type { MessageListProps } from '../types/chat';
import { formatTimestamp } from '../utils/chatUtils';

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onReaction, 
  onCopyMessage 
}) => {
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const emojiReactions = [
    { emoji: '❤️', icon: HeartIcon, solidIcon: HeartSolid, name: 'heart' },
    { emoji: '👍', icon: HandThumbUpIcon, solidIcon: ThumbsUpSolid, name: 'thumbs-up' },
    { emoji: '👎', icon: HandThumbDownIcon, solidIcon: ThumbsDownSolid, name: 'thumbs-down' },
    { emoji: '😊', icon: FaceSmileIcon, solidIcon: FaceSmileSolid, name: 'smile' }
  ];

  const handleReaction = (messageId: string, emoji: string) => {
    if (onReaction) {
      onReaction(messageId, emoji);
    }
    setShowReactions(null);
  };

  const handleCopyMessage = (content: string) => {
    if (onCopyMessage) {
      onCopyMessage(content);
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return (
          <div className="flex items-center bg-orange-100 px-2 py-1 rounded-full">
            <ClockIcon className="h-4 w-4 text-orange-600 animate-pulse" />
          </div>
        );
      case 'sent':
        return (
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
            <CheckIcon className="h-4 w-4 text-gray-700" />
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
            <div className="flex -space-x-1">
              <CheckIcon className="h-4 w-4 text-gray-700" />
              <CheckIcon className="h-4 w-4 text-gray-700" />
            </div>
          </div>
        );
      case 'read':
        return (
          <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
            <div className="flex -space-x-1">
              <CheckIcon className="h-4 w-4 text-blue-700" />
              <CheckIcon className="h-4 w-4 text-blue-700" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          onMouseEnter={() => setHoveredMessage(message.id)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          <div className="relative group">
            <div
              className={`max-w-[85%] sm:max-w-sm lg:max-w-lg px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
              style={{
                borderRadius: message.role === 'user' 
                  ? '20px 20px 5px 20px' 
                  : '20px 20px 20px 5px'
              }}
            >
              <p className="text-sm sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              
              {/* Enhanced timestamp and status */}
              <div className={`flex items-center justify-between mt-3 ${
                message.role === 'user' ? 'text-red-100' : 'text-gray-500'
              }`}>
                <span className="text-xs font-medium">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.role === 'user' && (
                  <div className="flex items-center">
                    {getStatusIcon(message.status)}
                  </div>
                )}
              </div>

              {/* Copy button - appears on hover */}
              {hoveredMessage === message.id && (
                <button
                  onClick={() => handleCopyMessage(message.content)}
                  className={`absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 ${
                    message.role === 'user' ? 'bg-red-100 hover:bg-red-200 text-red-600' : ''
                  }`}
                  title="Copy message"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(message.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                      message.userReactions?.includes(emoji)
                        ? 'bg-red-100 text-red-600 border border-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Reaction picker */}
            {showReactions === message.id && (
              <div className="absolute -top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                {emojiReactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(message.id, reaction.emoji)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 hover:scale-110"
                    title={reaction.name}
                  >
                    <span className="text-lg">{reaction.emoji}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Reaction button - appears on hover */}
            {hoveredMessage === message.id && (
              <button
                onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                className="absolute -bottom-2 -right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                title="Add reaction"
              >
                <FaceSmileIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      ))}
      
      <TypingIndicator isVisible={isLoading} />
    </div>
  );
};

export default MessageList;
