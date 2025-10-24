import React, { useRef, useEffect, useState } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, TrashIcon } from '@heroicons/react/24/outline';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatSidebarProps } from '../types/chat';
import { saveScrollPosition, loadScrollPosition, createScrollToBottom } from '../utils/chatUtils';

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

  const getRecommendedPrompts = (lastMessage: string, messageCount: number) => {
    const message = lastMessage.toLowerCase();
    
    // First-time user prompts
    if (messageCount <= 2) {
      return [
        { label: "🗓️ 3-Day Plan", action: "Give me a detailed 3-day Singapore itinerary" },
        { label: "🍜 Food Tour", action: "Create a food tour itinerary for Singapore" },
        { label: "🏨 Best Hotels", action: "Recommend the best hotels in Singapore" },
        { label: "🎫 Top Attractions", action: "What are the top 10 attractions in Singapore?" },
        { label: "🚇 Transport Guide", action: "How to get around Singapore efficiently?" },
        { label: "💰 Budget Tips", action: "How to save money while visiting Singapore?" },
        { label: "🌤️ Weather Guide", action: "What's the weather like and what should I pack?" },
        { label: "🏛️ Cultural Sites", action: "Best museums and cultural attractions to visit" },
        { label: "🛍️ Shopping Guide", action: "Where to shop and what souvenirs to buy?" }
      ];
    }
    
    // Car rental context
    if (message.includes('car') || message.includes('rental') || message.includes('vehicle') || message.includes('drive')) {
      return [
        { label: "🚙 SUV Options", action: "Show me SUV rental options with pricing and features" },
        { label: "💰 Best Deals", action: "Find the cheapest car rental deals in Singapore" },
        { label: "📍 Pickup Points", action: "Where can I pick up and drop off rental cars?" },
        { label: "📋 Requirements", action: "What documents and requirements for car rental?" },
        { label: "⏰ Duration", action: "I need a car for 3 days - what are my options?" },
        { label: "🚗 Economy Cars", action: "Show me economy car rental options" },
        { label: "🏢 Rental Companies", action: "Which car rental companies are best in Singapore?" },
        { label: "🛣️ Driving Routes", action: "Best driving routes and scenic drives in Singapore" },
        { label: "⛽ Fuel & Parking", action: "Where to find fuel stations and parking in Singapore?" }
      ];
    }
    
    // Itinerary planning context
    if (message.includes('itinerary') || message.includes('plan') || message.includes('day') || message.includes('visit') || message.includes('schedule')) {
      return [
        { label: "🌅 Morning Plan", action: "Create a morning itinerary for Singapore" },
        { label: "🌆 Evening Plan", action: "What are the best evening activities in Singapore?" },
        { label: "👨‍👩‍👧‍👦 Family Day", action: "Plan a family-friendly day in Singapore" },
        { label: "💑 Romantic Day", action: "Create a romantic day itinerary for couples" },
        { label: "📸 Photo Tour", action: "Best Instagram-worthy locations and photo spots" },
        { label: "🏃‍♂️ Active Day", action: "Plan an active day with outdoor activities" },
        { label: "🎨 Cultural Day", action: "Create a cultural and arts-focused itinerary" },
        { label: "🍜 Food Day", action: "Plan a full day food tour of Singapore" },
        { label: "🛍️ Shopping Day", action: "Create a shopping-focused day itinerary" }
      ];
    }
    
    // Food and dining context
    if (message.includes('food') || message.includes('eat') || message.includes('restaurant') || message.includes('dining') || message.includes('meal')) {
      return [
        { label: "🍜 Hawker Tour", action: "Create a hawker center food tour itinerary" },
        { label: "🍽️ Fine Dining", action: "Recommend the best upscale restaurants in Singapore" },
        { label: "🌶️ Spicy Challenge", action: "Where to find the spiciest food in Singapore?" },
        { label: "🥢 Local Specialties", action: "Must-try authentic Singaporean dishes and where to find them" },
        { label: "☕ Coffee Culture", action: "Best cafes and coffee shops in Singapore" },
        { label: "🍰 Dessert Spots", action: "Best dessert places and sweet treats in Singapore" },
        { label: "🌙 Late Night Eats", action: "Where to find great food late at night in Singapore" },
        { label: "🍺 Food & Drinks", action: "Best places for food and drinks combinations" },
        { label: "💰 Budget Eats", action: "Cheap but delicious food options in Singapore" }
      ];
    }
    
    // Weather and practical context
    if (message.includes('weather') || message.includes('rain') || message.includes('temperature') || message.includes('clothes') || message.includes('pack')) {
      return [
        { label: "☔ Rainy Day Plan", action: "Create a rainy day itinerary for Singapore" },
        { label: "👕 Packing Guide", action: "What clothes should I pack for Singapore weather?" },
        { label: "🌡️ Best Season", action: "When is the best time to visit Singapore?" },
        { label: "🏠 Indoor Activities", action: "Best indoor attractions and activities in Singapore" },
        { label: "🌂 Weather Essentials", action: "What should I bring for Singapore's weather?" },
        { label: "🌞 Sunny Day Plan", action: "Best outdoor activities for sunny days" },
        { label: "🌧️ Monsoon Guide", action: "How to handle Singapore's monsoon season" },
        { label: "🌡️ Temperature Tips", action: "What to expect with Singapore's temperature and humidity" },
        { label: "👟 Footwear Guide", action: "Best shoes and footwear for Singapore weather" }
      ];
    }
    
    // Transportation context
    if (message.includes('transport') || message.includes('bus') || message.includes('mrt') || message.includes('taxi') || message.includes('get around')) {
      return [
        { label: "🚇 MRT Guide", action: "Complete guide to using Singapore's MRT system" },
        { label: "🚌 Bus Routes", action: "Best bus routes and stops for tourists in Singapore" },
        { label: "🚕 Taxi/Grab", action: "How to get taxis and Grab rides in Singapore" },
        { label: "🚶 Walking Tours", action: "Self-guided walking routes and tours in Singapore" },
        { label: "🎫 Transport Cards", action: "How to get and use EZ-Link and other transport cards" },
        { label: "🚲 Bike Sharing", action: "Bike sharing options and cycling routes in Singapore" },
        { label: "🚗 Car Rental", action: "Car rental options and driving in Singapore" },
        { label: "✈️ Airport Transport", action: "How to get to and from Singapore airport" },
        { label: "🚢 Water Transport", action: "Ferry and water taxi options in Singapore" }
      ];
    }
    
    // Shopping context
    if (message.includes('shop') || message.includes('buy') || message.includes('mall') || message.includes('souvenir')) {
      return [
        { label: "🛍️ Best Malls", action: "Top shopping malls and retail districts in Singapore" },
        { label: "🎁 Souvenir Guide", action: "Best souvenirs to buy and where to find them" },
        { label: "💰 Budget Shopping", action: "Cheap shopping areas and bargain hunting spots" },
        { label: "🏪 Local Markets", action: "Traditional markets and local shopping experiences" },
        { label: "💳 Payment Guide", action: "How to pay for shopping and money matters in Singapore" },
        { label: "👗 Fashion Shopping", action: "Best places for clothing and fashion shopping" },
        { label: "📱 Electronics", action: "Where to buy electronics and gadgets in Singapore" },
        { label: "🏠 Home Decor", action: "Best places for home decor and furniture shopping" },
        { label: "🛒 Duty Free", action: "Duty-free shopping options and tax refunds" }
      ];
    }
    
    // Nightlife and entertainment context
    if (message.includes('night') || message.includes('bar') || message.includes('club') || message.includes('entertainment') || message.includes('party')) {
      return [
        { label: "🍻 Best Bars", action: "Top bars, pubs, and nightlife spots in Singapore" },
        { label: "🎵 Live Music", action: "Where to find live music venues and concerts" },
        { label: "🌃 Night Markets", action: "Best night markets and evening food experiences" },
        { label: "🎭 Shows", action: "Theater, shows, and entertainment venues" },
        { label: "🌅 Late Night Food", action: "Where to eat late at night in Singapore" },
        { label: "🎪 Rooftop Bars", action: "Best rooftop bars with city views" },
        { label: "🎤 Karaoke", action: "Best karaoke spots and entertainment venues" },
        { label: "🎰 Casinos", action: "Casino and gaming options in Singapore" },
        { label: "🌙 Night Tours", action: "Guided night tours and evening experiences" }
      ];
    }
    
    // Cultural and historical context
    if (message.includes('culture') || message.includes('history') || message.includes('museum') || message.includes('temple') || message.includes('heritage')) {
      return [
        { label: "🏛️ Museum Tour", action: "Best museums and cultural institutions in Singapore" },
        { label: "🏮 Temple Guide", action: "Important temples and religious sites to visit" },
        { label: "🏘️ Heritage Walk", action: "Historical neighborhoods and heritage areas to explore" },
        { label: "🎨 Art Scene", action: "Contemporary art galleries and cultural venues" },
        { label: "📚 Cultural Events", action: "Current cultural events, festivals, and performances" },
        { label: "🎭 Performing Arts", action: "Theater, dance, and performing arts venues" },
        { label: "📖 Literary Scene", action: "Bookstores, libraries, and literary events" },
        { label: "🎪 Festivals", action: "Cultural festivals and celebrations in Singapore" },
        { label: "🏛️ Architecture", action: "Notable architectural landmarks and buildings" }
      ];
    }
    
    // Budget and practical context
    if (message.includes('budget') || message.includes('money') || message.includes('cost') || message.includes('expensive') || message.includes('cheap')) {
      return [
        { label: "💰 Budget Guide", action: "Complete guide to saving money in Singapore" },
        { label: "🆓 Free Activities", action: "Free things to do and see in Singapore" },
        { label: "🎫 Discounts", action: "Where to find tourist discounts and deals" },
        { label: "💳 Money Matters", action: "Currency, payments, and financial tips for Singapore" },
        { label: "📱 Essential Apps", action: "Useful apps for tourists visiting Singapore" },
        { label: "🏨 Budget Hotels", action: "Cheap but good accommodation options" },
        { label: "🍜 Budget Food", action: "Cheap but delicious food options in Singapore" },
        { label: "🚇 Transport Savings", action: "How to save money on transportation" },
        { label: "🎟️ Combo Deals", action: "Tourist passes and combination deals" }
      ];
    }
    
    // Default intelligent prompts based on conversation
    return [
      { label: "🔍 More Details", action: "Tell me more about that" },
      { label: "📍 Nearby Places", action: "What's near this location?" },
      { label: "⏰ Best Timing", action: "When is the best time to visit?" },
      { label: "👥 Group Friendly", action: "Is this good for a group?" },
      { label: "💡 Alternatives", action: "What are similar options?" },
      { label: "💰 Pricing Info", action: "What are the costs and prices?" },
      { label: "📞 Contact Details", action: "How can I contact or book this?" },
      { label: "⭐ Reviews", action: "What do people say about this?" },
      { label: "🎯 Best For", action: "Who is this best suited for?" }
    ];
  };

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
