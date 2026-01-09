// Simple script to test the backend API
const API_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('🧪 Testing Siksha AI Backend...\n');

  // Test 1: Health check
  console.log('Test 1: Health Check');
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log('✅ Backend is running:', data);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    console.log('   Make sure backend is running: cd backend && npm start');
    return;
  }

  // Test 2: Send a question
  console.log('\nTest 2: Ask a Question');
  try {
    const response = await fetch(`${API_URL}/tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'What is 2 + 2?',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Question processed successfully!');
    console.log('   Answer:', data.answer.substring(0, 100) + '...');
    console.log('   Timestamp:', data.timestamp);
  } catch (error) {
    console.log('❌ Question failed:', error.message);
    console.log('   Check if OpenAI API key is set in backend/.env');
  }

  console.log('\n🎉 Testing complete!');
}

testBackend();
