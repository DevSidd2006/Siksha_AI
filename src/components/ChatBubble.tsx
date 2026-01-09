import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SpeechToTextService } from '@/services/speechToText';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
  extractedText?: string;
}

export function ChatBubble({ text, isUser, timestamp, imageUri, extractedText }: ChatBubbleProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSpeak = async () => {
    if (isUser) return; // Only speak AI responses

    if (isSpeaking) {
      await SpeechToTextService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await SpeechToTextService.speak(text, 'en-IN', () => {
          setIsSpeaking(false);
        });
      } catch (error) {
        setIsSpeaking(false);
        console.error('Error speaking:', error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isUser ? styles.userContainer : styles.tutorContainer]}
      onPress={!isUser ? handleSpeak : undefined}
      disabled={isUser}
    >
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.tutorBubble]}>
        {imageUri && (
          <Image 
            source={{ uri: imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        <Text style={[styles.text, isUser ? styles.userText : styles.tutorText]}>
          {text}
        </Text>
        {extractedText && (
          <View style={styles.extractedTextIndicator}>
            <Text style={styles.extractedTextIcon}>📄</Text>
            <Text style={styles.extractedTextTag}>Text extracted from image</Text>
          </View>
        )}
        <View style={styles.footerContainer}>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.tutorTimestamp]}>
            {formatTime(timestamp)}
          </Text>
          {!isUser && (
            <Text style={styles.speakerIcon}>
              {isSpeaking ? '🔊' : '🔇'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  tutorContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  tutorBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  tutorText: {
    color: '#333',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  tutorTimestamp: {
    color: '#999',
    textAlign: 'left',
  },
  speakerIcon: {
    fontSize: 12,
    marginLeft: 4,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  extractedTextIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  extractedTextIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  extractedTextTag: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
});
