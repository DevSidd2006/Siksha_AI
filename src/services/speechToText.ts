import * as Speech from 'expo-speech';
import { Alert, Platform } from 'react-native';

// Types
export interface SpeechRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

// Indian Languages Configuration
export const INDIAN_LANGUAGES = {
  HINDI: { code: 'hi-IN', name: 'हिंदी (Hindi)', nativeName: 'Hindi' },
  TAMIL: { code: 'ta-IN', name: 'தமிழ் (Tamil)', nativeName: 'Tamil' },
  TELUGU: { code: 'te-IN', name: 'తెలుగు (Telugu)', nativeName: 'Telugu' },
  KANNADA: { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', nativeName: 'Kannada' },
  MALAYALAM: { code: 'ml-IN', name: 'മലയാളം (Malayalam)', nativeName: 'Malayalam' },
  MARATHI: { code: 'mr-IN', name: 'मराठी (Marathi)', nativeName: 'Marathi' },
  GUJARATI: { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', nativeName: 'Gujarati' },
  PUNJABI: { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', nativeName: 'Punjabi' },
  BENGALI: { code: 'bn-IN', name: 'বাংলা (Bengali)', nativeName: 'Bengali' },
  ODIA: { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', nativeName: 'Odia' },
  ASSAMESE: { code: 'as-IN', name: 'অসমীয়া (Assamese)', nativeName: 'Assamese' },
  URDU: { code: 'ur-IN', name: 'اردو (Urdu)', nativeName: 'Urdu' },
  ENGLISH: { code: 'en-IN', name: 'English (India)', nativeName: 'English' },
  ENGLISH_US: { code: 'en-US', name: 'English (US)', nativeName: 'English' },
};

export const LANGUAGE_CODES = [
  'hi-IN',  // Hindi
  'ta-IN',  // Tamil
  'te-IN',  // Telugu
  'kn-IN',  // Kannada
  'ml-IN',  // Malayalam
  'mr-IN',  // Marathi
  'gu-IN',  // Gujarati
  'pa-IN',  // Punjabi
  'bn-IN',  // Bengali
  'or-IN',  // Odia
  'as-IN',  // Assamese
  'ur-IN',  // Urdu
  'en-IN',  // English (India)
  'en-US',  // English (US)
];

// Speech-to-text service using device's native speech recognition
// Uses Web Speech API on web, native APIs on Android/iOS

export class SpeechToTextService {
  private static isListening = false;
  private static transcript = '';

  static async startListening(
    onTranscript: (text: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      // Check if platform supports speech recognition
      if (Platform.OS === 'web') {
        await this.startWebSpeechRecognition(onTranscript, onError);
      } else {
        // For mobile, we'll use a workaround with native modules
        // Note: React Native doesn't have built-in speech-to-text in Expo
        // Alternative: use community package or fallback to text input
        Alert.alert(
          'Speech Input',
          'Native speech-to-text is not yet available on mobile. Please use text input or web browser.',
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError(errorMessage);
      console.error('Speech recognition error:', error);
    }
  }

  static stopListening(): void {
    this.isListening = false;
    if (Platform.OS === 'web') {
      this.stopWebSpeechRecognition();
    }
  }

  // Web Speech API Implementation
  private static webRecognition: any = null;

  private static initWebSpeechRecognition(): any {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser');
      return null;
    }

    return new SpeechRecognition();
  }

  private static async startWebSpeechRecognition(
    onTranscript: (text: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const recognition = this.initWebSpeechRecognition();

    if (!recognition) {
      onError('Speech Recognition API not supported');
      return;
    }

    this.webRecognition = recognition;
    this.isListening = true;
    this.transcript = '';

    // Configuration
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.language = 'hi-IN';  // Default to Hindi, can be changed via settings

    // Event handlers
    recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Send interim results for real-time feedback
      const fullTranscript = this.transcript + interimTranscript;
      onTranscript(fullTranscript.trim());
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
      // Final transcript
      if (this.transcript.trim()) {
        onTranscript(this.transcript.trim());
      }
    };

    // Start listening
    recognition.start();
  }

  private static stopWebSpeechRecognition(): void {
    if (this.webRecognition) {
      this.webRecognition.stop();
      this.webRecognition = null;
    }
  }

  static isSupported(): boolean {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return false;
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      return !!SpeechRecognition;
    }
    // Mobile support would require community packages
    return false;
  }

  // Text-to-Speech (for AI responses)
  static async speak(text: string, language: string = 'en-IN', onDone?: () => void): Promise<void> {
    try {
      await Speech.speak(text, {
        language: language,
        pitch: 1.0,
        rate: 1.0,
      });

      if (onDone) {
        // Note: This is approximate - Expo Speech doesn't have a perfect
        // completion callback
        const estimatedDuration = (text.length / 150) * 1000; // Rough estimate
        setTimeout(onDone, estimatedDuration);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  }

  static async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  static async isSpeakingAsync(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Error checking speaking status:', error);
      return false;
    }
  }

  static setLanguage(language: string): void {
    // This will be used to change the language dynamically
    if (this.webRecognition) {
      this.webRecognition.language = language;
    }
  }
}
