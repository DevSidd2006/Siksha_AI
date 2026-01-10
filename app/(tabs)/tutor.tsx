import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpotlightTutorial, SpotlightStep } from '@/components/SpotlightTutorial';
import { WelcomeSplash } from '@/components/WelcomeSplash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { sendQuestion } from '@/services/api';
import { generateOfflineAnswer } from '@/services/offlineTutor';
import { getOfflineMode } from '@/storage/settingsStore';
import { saveChat, getCurrentChat, clearCurrentChat } from '@/storage/chatStore';
import { ChatBubble } from '@/components/ChatBubble';
import { SpeechToTextService } from '@/services/speechToText';
import { getProfile } from '@/storage/profileStore';
import { OCRService } from '@/services/ocrService';
import { VisionLanguageService } from '@/services/visionLanguageService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
  extractedText?: string;
}

export default function TutorScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningTranscript, setListeningTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [studentGrade] = useState('Class 5-9');
  const [profile, setProfile] = useState<any>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showExtractedTextModal, setShowExtractedTextModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Refs for measuring UI element positions
  const modeBadgeRef = useRef<View>(null);
  const inputRef = useRef<View>(null);
  const voiceButtonRef = useRef<View>(null);
  const imageButtonRef = useRef<View>(null);
  const sendButtonRef = useRef<View>(null);
  const newChatButtonRef = useRef<View>(null);

  // State for measured positions
  const [measuredPositions, setMeasuredPositions] = useState<{
    modeBadge?: { x: number; y: number; width: number; height: number };
    input?: { x: number; y: number; width: number; height: number };
    voiceButton?: { x: number; y: number; width: number; height: number };
    imageButton?: { x: number; y: number; width: number; height: number };
    sendButton?: { x: number; y: number; width: number; height: number };
    newChatButton?: { x: number; y: number; width: number; height: number };
  }>({});

  useEffect(() => {
    loadCurrentChat();
    loadOfflineMode();
    checkSpeechSupport();
    loadProfile();
    showWelcomeSplash();
    checkTutorial();
  }, []);

  const showWelcomeSplash = () => {
    // Always show welcome splash when app loads
    setShowWelcome(true);
  };

  const checkTutorial = async () => {
    try {
      const seen = await AsyncStorage.getItem('hasSeenTutorial_v1');
      console.log('🎓 Tutorial check - hasSeenTutorial_v1:', seen);
      // Store the result but don't show tutorial yet - wait for welcome splash to complete
      if (!seen) {
        console.log('🎉 First time user! Tutorial will show after welcome splash');
      } else {
        console.log('✅ Tutorial already seen, skipping onboarding');
      }
    } catch (e) {
      console.error('❌ Tutorial check failed', e);
    }
  };

  const handleWelcomeComplete = () => {
    console.log('👋 Welcome splash completed');
    setShowWelcome(false);
    // Check if user has seen tutorial, if not show it
    checkAndShowTutorial();
  };

  const checkAndShowTutorial = async () => {
    try {
      const seen = await AsyncStorage.getItem('hasSeenTutorial_v1');
      if (!seen) {
        console.log('🎉 First time user! Showing tutorial...');
        setTimeout(() => {
          setShowTutorial(true);
          console.log('📚 Tutorial modal should now be visible');
        }, 200);
      } else {
        console.log('✅ Tutorial already seen, skipping onboarding');
      }
    } catch (e) {
      console.error('❌ Failed to check tutorial state', e);
    }
  };

  const measureUIElements = () => {
    const measurements: any = {};
    let measurementCount = 0;
    const totalMeasurements = 6;

    const checkComplete = () => {
      measurementCount++;
      if (measurementCount === totalMeasurements) {
        console.log('📏 All measurements complete:', measurements);
        setMeasuredPositions(measurements);
      }
    };

    modeBadgeRef.current?.measureInWindow((x, y, width, height) => {
      measurements.modeBadge = { x, y, width, height };
      console.log('📍 Mode badge:', { x, y, width, height });
      checkComplete();
    });

    inputRef.current?.measureInWindow((x, y, width, height) => {
      measurements.input = { x, y, width, height };
      console.log('📍 Input:', { x, y, width, height });
      checkComplete();
    });

    voiceButtonRef.current?.measureInWindow((x, y, width, height) => {
      measurements.voiceButton = { x, y, width, height };
      console.log('📍 Voice button:', { x, y, width, height });
      checkComplete();
    });

    imageButtonRef.current?.measureInWindow((x, y, width, height) => {
      measurements.imageButton = { x, y, width, height };
      console.log('📍 Image button:', { x, y, width, height });
      checkComplete();
    });

    sendButtonRef.current?.measureInWindow((x, y, width, height) => {
      measurements.sendButton = { x, y, width, height };
      console.log('📍 Send button:', { x, y, width, height });
      checkComplete();
    });

    newChatButtonRef.current?.measureInWindow((x, y, width, height) => {
      measurements.newChatButton = { x, y, width, height };
      console.log('📍 New chat button:', { x, y, width, height });
      checkComplete();
    });
  };

  const handleTutorialNext = () => {
    setTutorialStep((prev) => prev + 1);
  };

  const handleTutorialSkip = async () => {
    console.log('⏭️ Tutorial skipped by user');
    setShowTutorial(false);
    try {
      await AsyncStorage.setItem('hasSeenTutorial_v1', 'true');
      console.log('✅ Tutorial state saved (skipped)');
    } catch (e) {
      console.error('❌ Failed to save tutorial state', e);
    }
  };

  const handleTutorialFinish = async () => {
    console.log('🎉 Tutorial completed by user!');
    setShowTutorial(false);
    setTutorialStep(0);
    try {
      await AsyncStorage.setItem('hasSeenTutorial_v1', 'true');
      console.log('✅ Tutorial state saved (completed)');
    } catch (e) {
      console.error('❌ Failed to save tutorial state', e);
    }
  };



  const loadCurrentChat = async () => {
    const chat = await getCurrentChat();
    if (chat) {
      setMessages(chat.messages);
    }
  };

  const loadOfflineMode = async () => {
    const enabled = await getOfflineMode();
    setOfflineMode(enabled);
  };

  const checkSpeechSupport = () => {
    const supported = SpeechToTextService.isSupported();
    setSpeechSupported(supported);
  };

  const loadProfile = async () => {
    try {
      const prof = await getProfile();
      setProfile(prof);
    } catch (e) {
      console.log('Profile load optional');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
        setShowImagePreview(true);

        // Auto-extract text after selection
        await handleExtractText(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
        setShowImagePreview(true);

        // Auto-extract text after taking photo
        await handleExtractText(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera error:', error);
    }
  };

  const handleExtractText = async (imageUri: string) => {
    setIsExtracting(true);
    try {
      // Check if vision model is available
      const ollamaAvailable = await VisionLanguageService.isOllamaAvailable();
      const modelAvailable = await VisionLanguageService.isModelAvailable();

      if (!ollamaAvailable || !modelAvailable) {
        Alert.alert(
          'Vision Model Not Available',
          'Qwen3-VL vision model is not available. Please ensure Ollama is running and the model is installed.\n\nRun: ollama pull qwen3-vl:2b'
        );
        setExtractedText(null);
        return;
      }

      // For vision-language model, we don't extract text separately
      // Instead, we'll use it when the user asks a question
      setExtractedText('Vision model ready - ask your question about the image!');
      setShowExtractedTextModal(true);

    } catch (error) {
      console.error('Vision model check error:', error);
      Alert.alert(
        'Vision Model Error',
        'Failed to initialize vision model. Please check Ollama connection.'
      );
      setExtractedText(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSendWithExtractedText = async () => {
    if (!selectedImageUri || !inputText.trim()) {
      Alert.alert('Error', 'Please select an image and ask a question about it');
      return;
    }

    const messageText = `${inputText.trim()}\n\n[Analyzing image with vision model...]`;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      imageUri: selectedImageUri,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setExtractedText(null);
    setSelectedImageUri(null);
    setShowExtractedTextModal(false);
    setIsLoading(true);

    try {
      // Use vision-language model to process image and question together
      const visionResult = await VisionLanguageService.processImageWithQuestion(
        selectedImageUri,
        inputText.trim()
      );

      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: visionResult.answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, tutorMessage];
        saveChat(updatedMessages);
        return updatedMessages;
      });

      console.log(`Vision processing completed in ${visionResult.processingTime}ms using ${visionResult.model}`);

    } catch (error) {
      console.error('Vision processing error:', error);
      const errorMessage = 'Failed to analyze image with vision model. Please check Ollama connection and try again.';
      Alert.alert('Error', errorMessage);

      // Add error message to chat
      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, tutorMessage];
        saveChat(updatedMessages);
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!speechSupported) {
      Alert.alert(
        'Not Supported',
        'Speech recognition is only available on web browsers (Chrome, Edge, Safari). Please use text input on mobile.',
      );
      return;
    }

    if (isListening) {
      SpeechToTextService.stopListening();
      setIsListening(false);
      if (listeningTranscript.trim()) {
        setInputText(listeningTranscript.trim());
      }
    } else {
      setIsListening(true);
      setListeningTranscript('');

      SpeechToTextService.startListening(
        (transcript) => {
          setListeningTranscript(transcript);
        },
        (error) => {
          setIsListening(false);
          Alert.alert('Speech Recognition Error', error);
        },
      );
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      setIsSpeaking(true);
      await SpeechToTextService.speak(text, 'en-IN', () => {
        setIsSpeaking(false);
      });
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert('Text-to-Speech Error', 'Could not speak the response');
    }
  };

  const handleSend = async () => {
    const textToSend = isListening ? listeningTranscript : inputText;
    if (!textToSend.trim() || isLoading) return;

    // Re-read offline mode in case it was toggled in Settings recently.
    const latestOffline = await getOfflineMode();
    setOfflineMode(latestOffline);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setListeningTranscript('');
    setIsListening(false);
    setIsLoading(true);

    try {
      const response = latestOffline
        ? await generateOfflineAnswer(textToSend.trim())
        : await sendQuestion(textToSend.trim(), studentGrade); // Pass student context

      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, tutorMessage];
        // Save to local storage
        saveChat(updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending question:', error);
      const message = offlineMode
        ? 'Offline helper ran into a problem. Try again.'
        : 'Failed to get response from tutor. Please check your connection and try again.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenTutorial_v1');
      console.log('🔄 Tutorial reset! Restarting onboarding...');
      setTutorialStep(0);
      setShowWelcome(true);
    } catch (e) {
      console.error('❌ Failed to reset tutorial', e);
    }
  };

  const handleNewChat = async () => {
    setIsLoading(false);
    setInputText('');
    setMessages([]);
    await clearCurrentChat();
    Alert.alert('New chat started');
  };

  // Function to get tutorial steps with measured positions
  const getTutorialSteps = (): SpotlightStep[] => {
    return [
      {
        title: '👋 Welcome to Siksha AI!',
        description: 'Your personal AI tutor is here to help you learn better. Let\'s take a quick tour!',
        // No target - centered tooltip
      },
      {
        title: '📊 Dashboard',
        description: 'Explore your learning dashboard to track progress, access subjects, and continue reading your materials.',
        targetArea: measuredPositions.modeBadge || { x: 20, y: SCREEN_HEIGHT - 90, width: SCREEN_WIDTH - 45, height: 40},
        tooltipPosition: 'bottom',
        arrowDirection: 'down',
      },
      {
        title: '⌨️ Question Input Field',
        description: 'Type your questions here. You can ask about math, science, homework, or any subject!',
        targetArea: measuredPositions.input || { x: 12, y: SCREEN_HEIGHT - 190, width: SCREEN_WIDTH - 135, height: 50 },
        tooltipPosition: 'top',
        arrowDirection: 'down',
      },
      {
        title: '🖼️ Image Upload',
        description: 'Upload photos of problems or diagrams. AI will analyze and help solve them!',
        targetArea: measuredPositions.imageButton || { x: SCREEN_WIDTH - 130, y: SCREEN_HEIGHT - 190, width: 40, height: 40 },
        tooltipPosition: 'top',
        arrowDirection: 'down',
      },
      {
        title: '📤 Send Question',
        description: 'Click Send to get an instant answer from your AI tutor. Make sure to ask a question first!',
        targetArea: measuredPositions.sendButton || { x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 190, width: 60, height: 44 },
        tooltipPosition: 'top',
        arrowDirection: 'down',
      },
      {
        title: '➕ Start New Chat',
        description: 'Begin a fresh conversation. Your previous chats are automatically saved in History.',
        targetArea: measuredPositions.newChatButton || { x: 16, y: SCREEN_HEIGHT - 140, width: SCREEN_WIDTH - 32, height: 40 },
        tooltipPosition: 'top',
        arrowDirection: 'down',
      },
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ask Your Doubt</Text>
        <TouchableOpacity
          onPress={resetTutorial}
          style={styles.resetTutorialButton}
        >
          <Text style={styles.resetTutorialText}>🔄</Text>
        </TouchableOpacity>
        <View
          ref={modeBadgeRef}
          style={[styles.modeBadge, offlineMode ? styles.modeBadgeOffline : styles.modeBadgeOnline]}
        >
          <Text style={[styles.modeText, offlineMode ? styles.modeTextOffline : styles.modeTextOnline]}>
            {offlineMode ? '📡 Offline' : '🌐 Online'}
          </Text>
        </View>
      </View>

      {/* Messages Container */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            text={item.text}
            isUser={item.isUser}
            timestamp={item.timestamp}
          />
        )}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤔</Text>
            <Text style={styles.emptyTitle}>Get Help with Your Studies</Text>
            <Text style={styles.emptyText}>Ask any question and get instant help from your AI tutor</Text>
          </View>
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2196F3" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      {/* Input Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          {extractedText && (
            <View style={styles.extractedTextBanner}>
              <Text style={styles.extractedTextLabel}>�️ Vision model ready - ask your question about the image</Text>
              <TouchableOpacity
                onPress={() => setShowExtractedTextModal(true)}
                style={styles.viewTextButton}
              >
                <Text style={styles.viewTextButtonText}>View Extracted Text</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <View style={{ flex: 1 }} ref={inputRef}>
              <TextInput
                style={[styles.input, extractedText && styles.inputWithExtractedText]}
                placeholder={isListening ? 'Listening...' : 'Ask your question...'}
                value={isListening ? listeningTranscript : inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                editable={!isListening}
                placeholderTextColor="#999"
              />
            </View>
            {speechSupported && (
              <TouchableOpacity
                ref={voiceButtonRef}
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonActive,
                ]}
                onPress={handleVoiceInput}
                disabled={isLoading}
              >
                <Text style={styles.voiceButtonText}>
                  {isListening ? '🔴' : '🎙️'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              ref={imageButtonRef}
              style={styles.imageButton}
              onPress={handlePickImage}
              disabled={isLoading}
            >
              <Text style={styles.imageButtonText}>🖼️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              ref={sendButtonRef}
              style={[styles.sendButton, (!inputText.trim() && !listeningTranscript.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={extractedText ? handleSendWithExtractedText : handleSend}
              disabled={(!inputText.trim() && !listeningTranscript.trim()) || isLoading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            ref={newChatButtonRef}
            style={styles.newChatButton}
            onPress={handleNewChat}
          >
            <Text style={styles.newChatText}>+ New Chat</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent
        animationType="slide"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowImagePreview(false)}>
              <Text style={styles.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Image Preview</Text>
            <View style={{ width: 60 }} />
          </View>

          {selectedImageUri && (
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          {isExtracting && (
            <View style={styles.extractingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.extractingText}>Preparing vision analysis...</Text>
            </View>
          )}

          {extractedText && !isExtracting && (
            <View style={styles.extractedInfoContainer}>
              <Text style={styles.extractionSuccessText}>✓ Vision model ready!</Text>
              <Text style={styles.wordCountText}>Ask your question about the image</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => {
              setShowImagePreview(false);
              if (extractedText) {
                setShowExtractedTextModal(true);
              }
            }}
          >
            <Text style={styles.closeImageButtonText}>Continue</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Extracted Text Modal */}
      <Modal
        visible={showExtractedTextModal}
        transparent
        animationType="slide"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowExtractedTextModal(false)}>
              <Text style={styles.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Vision Analysis Ready</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView
            style={styles.extractedTextContainer}
            contentContainerStyle={styles.extractedTextContent}
          >
            <Text style={styles.extractedTextBody}>{extractedText}</Text>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setShowExtractedTextModal(false);
                setExtractedText(null);
                setSelectedImageUri(null);
              }}
            >
              <Text style={styles.actionButtonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => {
                setShowExtractedTextModal(false);
                // Focus back to input for asking question
              }}
            >
              <Text style={styles.actionButtonTextPrimary}>Ask Question</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Welcome Splash */}
      <WelcomeSplash
        visible={showWelcome}
        onComplete={handleWelcomeComplete}
      />


      {/* Spotlight Tutorial */}
      <SpotlightTutorial
        visible={showTutorial}
        currentStep={tutorialStep}
        totalSteps={6}
        stepData={getTutorialSteps()[tutorialStep] || getTutorialSteps()[0]}
        onNext={handleTutorialNext}
        onSkip={handleTutorialSkip}
        onFinish={handleTutorialFinish}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetTutorialButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetTutorialText: {
    fontSize: 18,
  },
  modeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeBadgeOnline: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  modeBadgeOffline: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFC107',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modeTextOnline: {
    color: '#2196F3',
  },
  modeTextOffline: {
    color: '#856404',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  voiceButtonText: {
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  newChatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  newChatText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 18,
  },
  extractedTextBanner: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extractedTextLabel: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  viewTextButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  viewTextButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  inputWithExtractedText: {
    backgroundColor: '#F1F8E9',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    marginVertical: 16,
    backgroundColor: '#f0f0f0',
  },
  extractingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  extractingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  extractedInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  extractionSuccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  wordCountText: {
    fontSize: 12,
    color: '#558B2F',
  },
  extractedTextContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  extractedTextContent: {
    paddingBottom: 20,
  },
  extractedTextBody: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  closeImageButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeImageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
