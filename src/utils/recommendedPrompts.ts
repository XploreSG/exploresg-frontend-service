export interface RecommendedPrompt {
  label: string;
  action: string;
}

export const getRecommendedPrompts = (lastMessage: string, messageCount: number): RecommendedPrompt[] => {
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
      { label: "🍜 Local Food", action: "Best local Singaporean dishes to try" },
      { label: "🍽️ Fine Dining", action: "Recommend upscale restaurants in Singapore" },
      { label: "🌶️ Spicy Food", action: "Where to find the spiciest food in Singapore?" },
      { label: "🥘 Hawker Centers", action: "Best hawker centers and street food locations" },
      { label: "🍰 Desserts", action: "Top dessert spots and sweet treats in Singapore" },
      { label: "☕ Coffee Culture", action: "Best cafes and coffee shops in Singapore" },
      { label: "🍷 Nightlife", action: "Best bars and nightlife spots in Singapore" },
      { label: "🌱 Vegetarian", action: "Best vegetarian and vegan restaurants" },
      { label: "🍣 International", action: "Best international cuisine restaurants" }
    ];
  }
  
  // Weather and packing context
  if (message.includes('weather') || message.includes('pack') || message.includes('clothes') || message.includes('season')) {
    return [
      { label: "🌤️ Current Weather", action: "What's the current weather in Singapore?" },
      { label: "👕 What to Pack", action: "What clothes should I pack for Singapore?" },
      { label: "🌧️ Rainy Season", action: "How to prepare for Singapore's rainy season?" },
      { label: "☀️ Sunny Days", action: "Best activities for sunny weather in Singapore" },
      { label: "🌡️ Temperature", action: "What's the temperature range in Singapore?" },
      { label: "🌂 Umbrella Guide", action: "Do I need an umbrella in Singapore?" },
      { label: "👟 Footwear", action: "Best shoes for walking around Singapore" },
      { label: "🧴 Sunscreen", action: "Sun protection tips for Singapore" },
      { label: "🌙 Evening Wear", action: "What to wear for evening activities?" }
    ];
  }
  
  // Transportation context
  if (message.includes('transport') || message.includes('bus') || message.includes('mrt') || message.includes('taxi') || message.includes('grab')) {
    return [
      { label: "🚇 MRT Guide", action: "How to use Singapore's MRT system efficiently?" },
      { label: "🚌 Bus Routes", action: "Best bus routes for tourists in Singapore" },
      { label: "🚕 Taxi Tips", action: "How to get taxis and ride-sharing in Singapore" },
      { label: "🚗 Car Rental", action: "Should I rent a car in Singapore?" },
      { label: "🚲 Bike Sharing", action: "Bike sharing and cycling options in Singapore" },
      { label: "🚶 Walking Routes", action: "Best walking routes and pedestrian areas" },
      { label: "✈️ Airport Transfer", action: "How to get from Changi Airport to city center?" },
      { label: "🎫 Transport Cards", action: "EZ-Link card and transport payment options" },
      { label: "🗺️ Navigation", action: "Best navigation apps for Singapore" }
    ];
  }
  
  // Shopping context
  if (message.includes('shop') || message.includes('buy') || message.includes('mall') || message.includes('souvenir')) {
    return [
      { label: "🛍️ Best Malls", action: "Top shopping malls in Singapore" },
      { label: "🎁 Souvenirs", action: "Best souvenirs to buy in Singapore" },
      { label: "💰 Budget Shopping", action: "Where to find cheap shopping in Singapore?" },
      { label: "💎 Luxury Shopping", action: "High-end shopping districts in Singapore" },
      { label: "🏪 Local Markets", action: "Best local markets and bazaars to visit" },
      { label: "👕 Fashion", action: "Best places to buy clothes in Singapore" },
      { label: "📱 Electronics", action: "Where to buy electronics and gadgets?" },
      { label: "🍵 Local Products", action: "Best local products and crafts to buy" },
      { label: "🎨 Art & Crafts", action: "Art galleries and craft markets in Singapore" }
    ];
  }
  
  // Nightlife context
  if (message.includes('night') || message.includes('bar') || message.includes('club') || message.includes('party')) {
    return [
      { label: "🍸 Rooftop Bars", action: "Best rooftop bars with city views" },
      { label: "🎵 Live Music", action: "Best venues for live music in Singapore" },
      { label: "🕺 Nightclubs", action: "Top nightclubs and dance venues" },
      { label: "🍺 Craft Beer", action: "Best craft beer bars and breweries" },
      { label: "🍷 Wine Bars", action: "Sophisticated wine bars in Singapore" },
      { label: "🌃 Night Markets", action: "Best night markets and evening food spots" },
      { label: "🎭 Shows", action: "Evening shows and entertainment options" },
      { label: "🌉 Night Views", action: "Best spots for night photography and views" },
      { label: "🍜 Late Night Food", action: "Where to find food late at night in Singapore?" }
    ];
  }
  
  // Cultural context
  if (message.includes('culture') || message.includes('museum') || message.includes('temple') || message.includes('history')) {
    return [
      { label: "🏛️ Museums", action: "Best museums to visit in Singapore" },
      { label: "🕌 Temples", action: "Important temples and religious sites" },
      { label: "🏘️ Heritage", action: "Cultural heritage sites and neighborhoods" },
      { label: "🎭 Arts Scene", action: "Art galleries and cultural centers" },
      { label: "📚 Libraries", action: "Beautiful libraries and bookshops" },
      { label: "🎪 Festivals", action: "Cultural festivals and events in Singapore" },
      { label: "👥 Local Communities", action: "Diverse neighborhoods to explore" },
      { label: "🎨 Street Art", action: "Best street art and murals in Singapore" },
      { label: "📖 History", action: "Historical sites and landmarks to visit" }
    ];
  }
  
  // Budget context
  if (message.includes('budget') || message.includes('cheap') || message.includes('free') || message.includes('cost')) {
    return [
      { label: "🆓 Free Activities", action: "Best free things to do in Singapore" },
      { label: "💰 Budget Tips", action: "How to save money while visiting Singapore?" },
      { label: "🍜 Cheap Eats", action: "Best budget-friendly food options" },
      { label: "🏨 Budget Hotels", action: "Affordable accommodation options" },
      { label: "🎫 Free Attractions", action: "Free attractions and activities" },
      { label: "🚇 Transport Savings", action: "How to save on transportation costs?" },
      { label: "🛍️ Budget Shopping", action: "Where to find cheap shopping?" },
      { label: "🎪 Free Events", action: "Free events and festivals happening" },
      { label: "📱 Money-Saving Apps", action: "Best apps for saving money in Singapore" }
    ];
  }
  
  // Default intelligent prompts
  return [
    { label: "🗓️ Plan My Day", action: "Create a personalized day itinerary for me" },
    { label: "🍜 Food Recommendations", action: "Recommend restaurants based on my preferences" },
    { label: "🎫 Hidden Gems", action: "Show me hidden gems and off-the-beaten-path places" },
    { label: "👨‍👩‍👧‍👦 Family Fun", action: "Best family-friendly activities and attractions" },
    { label: "📸 Instagram Spots", action: "Most Instagram-worthy locations and photo spots" },
    { label: "🌃 Night Activities", action: "What to do in Singapore at night?" },
    { label: "🚇 Getting Around", action: "Help me plan my transportation in Singapore" },
    { label: "💰 Budget Planning", action: "Help me plan a budget-friendly Singapore trip" },
    { label: "🎯 Personalized", action: "Give me personalized recommendations based on my interests" }
  ];
};
