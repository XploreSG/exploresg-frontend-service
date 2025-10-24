import { GoogleGenerativeAI } from '@google/generative-ai';

export const testGeminiConnection = async (): Promise<void> => {
  try {
    console.log('Testing Gemini API connection...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('API key not configured');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // First, let's try to list available models
    console.log('Fetching available models...');
    let availableModels: any[] = [];
    try {
      // Note: listModels() might not be available in all versions
      // We'll skip this step and try common model names directly
      console.log('Skipping model listing - will try common model names directly...');
    } catch (listError) {
      const errorMessage = listError instanceof Error ? listError.message : String(listError);
      console.error('❌ Failed to list models:', errorMessage);
      console.log('Will try common model names anyway...');
    }
    
    // Try different model names - using current available models (Gemini 1.0 models are retired)
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.5-flash', 'gemini-2.5-pro'];
    
    for (const modelName of modelNames) {
      // Check if this model is available (if we could list models)
      if (availableModels.length > 0) {
        const isAvailable = availableModels.some((m: any) => m.name.includes(modelName));
        if (!isAvailable) {
          console.log(`⏭️ Skipping ${modelName} - not in available models list`);
          continue;
        }
      }
      
      try {
        console.log(`🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Hello, respond with "API test successful"');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS! Gemini API test successful with model: ${modelName}!`);
        console.log('Response received (length):', text.length, 'characters');
        return;
        
      } catch (modelError: any) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
      }
    }
    
    throw new Error('No working model found - all models failed');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorType = error instanceof Error ? error.constructor.name : typeof error;
    
    console.error('Error message:', errorMessage);
    console.error('Error type:', errorType);
    
    if (errorMessage.includes('CORS')) {
      console.error('🔍 CORS error detected - browser is blocking the request');
    } else if (errorMessage.includes('API_KEY') || errorMessage.includes('permission')) {
      console.error('🔍 API key or permission error - check your Google Cloud Console');
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      console.error('🔍 API quota or rate limit error');
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      console.error('🔍 Network or fetch error');
    } else if (errorMessage.includes('404') && errorMessage.includes('models')) {
      console.error('🔍 Model not found - this API key may not have access to Gemini models');
    }
  }
};
