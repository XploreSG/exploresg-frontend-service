import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendToGemini = async (message: string, conversationHistory: ChatMessage[] = []): Promise<string> => {
  try {
    console.log('Initializing Gemini model...');
    const genAI = getGenAI();
    
          // Try fastest models first for speed
          const modelNames = ['gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-2.5-flash', 'gemini-1.5-pro'];
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Create context for Singapore travel assistant
        const systemPrompt = `You are a helpful travel assistant for ExploreSG, a Singapore car rental and tourism platform. 
        
        Your role:
        - Help users plan their Singapore itinerary
        - Recommend attractions, food, and activities
        - Assist with car rental bookings
        - Provide travel tips and local insights
        - Answer questions about Singapore tourism
        
        Key information about Singapore:
        - Popular attractions: Marina Bay Sands, Gardens by the Bay, Sentosa Island, Singapore Zoo, Universal Studios
        - Famous food areas: Chinatown, Little India, Kampong Glam, Maxwell Food Centre
        - Transportation: MRT, buses, taxis, and car rentals
        - Weather: Tropical climate, frequent rain showers
        - Best times to visit: Year-round, but avoid monsoon season (Nov-Jan)
        
        Keep responses helpful, concise, and focused on Singapore tourism and car rental services. 
        IMPORTANT: Do not use markdown formatting like **bold** or *italic* text. Use plain text only.`;

        // Build conversation context
        const conversationContext = conversationHistory
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n');

        const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nUser: ${message}\nAssistant:`;
        console.log('Sending request to Gemini...');
        console.log('Full prompt length:', fullPrompt.length);

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        console.log(`Gemini response received successfully with model: ${modelName}`);
        return response.text();
        
      } catch (modelError: any) {
        console.log(`Model ${modelName} failed:`, modelError.message);
        
              // If it's an overload error, wait briefly and try the next model
              if (modelError.message.includes('overloaded') || modelError.message.includes('503')) {
                console.log(`Model ${modelName} is overloaded, waiting 500ms and trying next model...`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms instead of 2s
                continue;
              }
        
        // If it's the last model, throw the error
        if (modelName === modelNames[modelNames.length - 1]) {
          throw modelError;
        }
      }
    }
    
    throw new Error('All models are currently unavailable. Please try again later.');
    
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Error details:', error);
    
    // Type guard to check if error is an Error object
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    // Check if it's a CORS error
    if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
      console.error('CORS error detected - this is likely the issue');
    }
    
    // Check if it's an API key error
    if (errorMessage.includes('API_KEY') || errorMessage.includes('permission') || errorMessage.includes('quota')) {
      console.error('API key or permission error detected');
    }
    
    // Check if it's an overload error
    if (errorMessage.includes('overloaded') || errorMessage.includes('503')) {
      console.error('Model overloaded - this is a temporary Google server issue');
    }
    
    throw new Error('Failed to get AI response. Please try again.');
  }
};

export const getQuickResponse = async (message: string): Promise<string> => {
  console.log('getQuickResponse called with:', message);

  // Check if API key is set
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('API Key status:', apiKey ? 'Set' : 'Not set');
  console.log('API Key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set');
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return 'I\'d love to help you with your Singapore travel plans! However, I need to be properly configured first. Please set up your Gemini API key to enable full AI assistance. For now, I can help with basic questions about Singapore attractions, car rentals, and travel planning.';
  }

  // Call the real Gemini API - NO FALLBACK, MUST GET REAL RESPONSE
  console.log('Calling Gemini API...');
  
        // Retry up to 2 times if there are temporary issues (faster)
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`Attempt ${attempt} of 2...`);
            const response = await sendToGemini(message);
            console.log('Gemini response received');
            return response;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log(`Attempt ${attempt} failed:`, errorMessage);
            
            if (attempt === 2) {
              // Last attempt failed, throw the error
              throw error;
            }
            
            // Wait briefly before retrying
            console.log('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
  
  throw new Error('All attempts failed');
};
