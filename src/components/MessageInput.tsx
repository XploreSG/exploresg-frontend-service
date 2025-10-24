import React, { useState, type KeyboardEvent } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { MessageInputProps } from '../types/chat';
import { INPUT_STYLES } from '../constants/chatStyles';
import { validateMessage, isEnterKey } from '../utils/chatUtils';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateMessage(message) && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isEnterKey(e)) {
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
          className={INPUT_STYLES.textarea}
          rows={1}
          style={{ maxHeight: '120px' }}
        />
      </div>
      <button
        type="submit"
        disabled={!validateMessage(message) || disabled}
        className={INPUT_STYLES.button}
        aria-label="Send message"
      >
        <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </form>
  );
};

export default MessageInput;
