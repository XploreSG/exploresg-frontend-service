import React, { useState, type KeyboardEvent } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-2 sm:gap-3">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm touch-manipulation"
          rows={1}
          style={{ maxHeight: '120px' }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 flex-shrink-0 h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center touch-manipulation"
        aria-label="Send message"
      >
        <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </form>
  );
};

export default MessageInput;
