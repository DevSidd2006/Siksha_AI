const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_ID = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Ollama configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Check Ollama availability
let ollamaAvailable = false;

const checkOllama = async () => {
  try {
    const response = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 2000 });
    ollamaAvailable = response.status === 200;
    console.log('✅ Ollama is available');
    return true;
  } catch (error) {
    console.log('❌ Ollama is not available (will use Gemini API)');
    ollamaAvailable = false;
    return false;
  }
};

// Check Ollama on startup
checkOllama();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Siksha AI Backend is running',
    version: '1.0.0',
    ollama: ollamaAvailable ? 'connected' : 'disconnected',
    aiModel: ollamaAvailable ? OLLAMA_MODEL : 'Gemini API'
  });
});

// System prompt for student context
const getSystemPrompt = (studentGrade = 'Class 5-9') => {
  return `You are an enthusiastic and patient AI tutor for ${studentGrade} students (ages 10-15).

IMPORTANT GUIDELINES:
- Use simple, age-appropriate language
- Break down complex topics into small, easy-to-understand parts
- Use relatable examples and analogies
- Include interesting facts to keep the student engaged
- Encourage curiosity and critical thinking
- If the question is outside the curriculum, gently redirect to learning topics
- Avoid technical jargon; explain any necessary terms
- Use encouraging language and celebrate learning
- Keep explanations concise but thorough

Remember: You're teaching a student, not an adult. Make learning fun!`;
};

// Generate answer using Ollama
const generateWithOllama = async (question, studentGrade = 'Class 5-9') => {
  try {
    const response = await axios.post(
      `${OLLAMA_HOST}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: `${getSystemPrompt(studentGrade)}\n\nStudent question: ${question}`,
        stream: false,
        temperature: 0.7,
      },
      { timeout: 30000 }
    );

    return {
      answer: response.data.response,
      model: OLLAMA_MODEL,
      source: 'ollama',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Ollama error:', error.message);
    return null;
  }
};

// Generate answer using Gemini
const generateWithGemini = async (question, studentGrade = 'Class 5-9') => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `${getSystemPrompt(studentGrade)}\n\nStudent question: ${question}`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return {
      answer: result.response.text(),
      model: MODEL_ID,
      source: 'gemini',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini error:', error.message);
    throw error;
  }
};

// Main tutor endpoint with intelligent fallback
app.post('/tutor', async (req, res) => {
  try {
    const { question, studentGrade = 'Class 5-9' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request. Question is required.' 
      });
    }

    console.log(`\n📚 Question received: ${question}`);
    console.log(`👨‍🎓 Student: ${studentGrade}`);
    console.log(`🤖 Ollama available: ${ollamaAvailable}`);

    let result = null;

    // Try Ollama first if available (faster, more private, offline)
    if (ollamaAvailable) {
      console.log(`🔄 Trying Ollama (${OLLAMA_MODEL})...`);
      result = await generateWithOllama(question, studentGrade);
    }

    // Fallback to Gemini if Ollama fails or not available
    if (!result) {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Ollama unavailable and GEMINI_API_KEY not configured.',
          suggestion: 'Start Ollama or set GEMINI_API_KEY in backend/.env',
        });
      }

      console.log(`🔄 Falling back to Gemini...`);
      result = await generateWithGemini(question, studentGrade);
    }

    console.log(`✅ Answer generated from ${result.source}`);
    console.log(`📏 Length: ${result.answer.length} characters\n`);

    res.json(result);

  } catch (error) {
    console.error('❌ Error processing question:', error.message);

    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'API key authentication failed. Please check your Gemini API key.' 
      });
    }

    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process your question. Please try again.',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Siksha AI Backend running on http://localhost:${PORT}`);
  console.log(`📚 Ready to help students learn!`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables!');
    console.warn('   Create a .env file with your Gemini API key.');
  }
});
