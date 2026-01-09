import Constants from 'expo-constants';
import { Platform } from 'react-native';

// API service to communicate with backend
// Choose a base URL that works across Expo web, Android emulator, and devices on the same LAN.
const getDevBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
};

const API_URL = __DEV__ 
  ? getDevBaseUrl()
  : 'https://your-production-url.com';

export interface TutorResponse {
  answer: string;
  timestamp: string;
  model?: string;
  source?: 'ollama' | 'gemini';
}

export async function sendQuestion(
  question: string,
  studentGrade: string = 'Class 5-9'
): Promise<TutorResponse> {
  try {
    const response = await fetch(`${API_URL}/tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question,
        studentGrade, // Send student context to backend
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to get response from tutor. Please check your connection.');
  }
}
