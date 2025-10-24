import { GoogleGenerativeAI } from '@google/generative-ai';

export const testGeminiConnection = async (): Promise<void> => {
  try {
    console.log('Testing Gemini API connection...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'Not set');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('API key not configured');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // First, let's try to list available models
    console.log('Fetching available models...');
    let availableModels: any[] = [];
    try {
      const { models } = await genAI.listModels();
      availableModels = models;
      console.log('✅ Successfully listed models!');
      console.log('Available models:', availableModels.map((m: any) => m.name));
      
      if (availableModels.length === 0) {
        console.warn('⚠️ No models are available for this API key');
        throw new Error('No models available for this API key');
      }
    } catch (listError: any) {
      console.error('❌ Failed to list models:', listError.message);
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
        console.log('Response:', text);
        return;
        
      } catch (modelError: any) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
      }
    }
    
    throw new Error('No working model found - all models failed');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    
    if (error.message.includes('CORS')) {
      console.error('🔍 CORS error detected - browser is blocking the request');
    } else if (error.message.includes('API_KEY') || error.message.includes('permission')) {
      console.error('🔍 API key or permission error - check your Google Cloud Console');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.error('🔍 API quota or rate limit error');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      console.error('🔍 Network or fetch error');
    } else if (error.message.includes('404') && error.message.includes('models')) {
      console.error('🔍 Model not found - this API key may not have access to Gemini models');
    }
  }
};
