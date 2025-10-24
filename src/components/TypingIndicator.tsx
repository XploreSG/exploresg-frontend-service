import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div 
        className="bg-white text-gray-800 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-gray-200 shadow-lg max-w-[85%] sm:max-w-sm"
        style={{ borderRadius: '20px 20px 20px 5px' }}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Professional typing dots animation */}
          <div className="flex space-x-1">
            <div 
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
              style={{ 
                animationDelay: '0ms',
                animationDuration: '1.4s',
                animationIterationCount: 'infinite'
              }}
            ></div>
            <div 
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
              style={{ 
                animationDelay: '200ms',
                animationDuration: '1.4s',
                animationIterationCount: 'infinite'
              }}
            ></div>
            <div 
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
              style={{ 
                animationDelay: '400ms',
                animationDuration: '1.4s',
                animationIterationCount: 'infinite'
              }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 animate-pulse">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
