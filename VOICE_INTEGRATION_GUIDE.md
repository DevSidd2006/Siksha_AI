# Voice Integration Guide - Speech-to-Text & Text-to-Speech

## ✨ Features Added

Your Siksha AI app now supports **voice input and audio output**:

### 🎤 Speech-to-Text (Voice Input)
- **Speak your questions** instead of typing
- Real-time transcript preview as you speak
- Works on **web browsers** (Chrome, Edge, Firefox, Safari)
- Automatic text insertion into chat input

### 🔊 Text-to-Speech (Voice Output)
- **Listen to AI responses** by tapping on any AI message
- Natural-sounding voice feedback
- Works on **mobile and web**
- Stop playback anytime by tapping again

---

## 📱 Platform Support

### Web Browser (Recommended for voice)
✅ **Speech-to-Text**: Fully supported
- Uses Web Speech API (native browser feature)
- Works on Chrome, Edge, Firefox, Safari
- No additional setup required

✅ **Text-to-Speech**: Fully supported
- High-quality voice output
- Automatic speech control

### Mobile (Android/iOS)
❌ **Speech-to-Text**: Shows info message directing to web
- Community packages available if you want to add native support later

✅ **Text-to-Speech**: Fully supported
- Native platform text-to-speech
- Works seamlessly with Expo

---

## 🚀 How to Use

### Speech-to-Text (Web Only)

1. **Open the app in a web browser**
   ```bash
   # In terminal, press 'w' when Expo is running
   npm start
   # Then press 'w'
   ```

2. **Click the microphone button** 🎙️ in the input area

3. **Start speaking** - the button turns red (🎤) while listening

4. **Stop speaking** - click again or the app stops automatically

5. **Your transcript appears** in the input field

6. **Click Send** to submit your question

### Text-to-Speech (Web & Mobile)

1. **Wait for an AI response** in the chat

2. **Tap on the AI message** (the one in white bubble)

3. **Speaker icon changes** from 🔇 to 🔊 while speaking

4. **Tap again to stop** playback

---

## 🔧 Technical Implementation

### Files Created/Modified

#### New Service: `src/services/speechToText.ts`
Handles all voice functionality:
- `SpeechToTextService.startListening()` - Begin speech recognition
- `SpeechToTextService.stopListening()` - Stop listening
- `SpeechToTextService.speak()` - Play audio from text
- `SpeechToTextService.isSpeakingAsync()` - Check speaking status
- `SpeechToTextService.isSupported()` - Platform support check

#### Updated: `app/(tabs)/tutor.tsx`
- Added voice input button (🎙️/🎤)
- Real-time transcript preview while listening
- Integrated voice handlers
- Speech support detection

#### Updated: `src/components/ChatBubble.tsx`
- Added speaker icon (🔇/🔊) to AI messages
- Tap-to-speak functionality
- Visual feedback for speaking state

---

## 🌐 Web Speech API Details

### Supported Languages
The app defaults to **English (en-US)**. To add more languages:

```typescript
// In speechToText.ts, update startWebSpeechRecognition():
recognition.language = 'en-US'; // Change this to other language codes
// Examples: 'es-ES' (Spanish), 'fr-FR' (French), 'hi-IN' (Hindi), etc.
```

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Edge (Chromium-based)
- ✅ Firefox 25+
- ✅ Safari 14.1+
- ❌ Internet Explorer (not supported)

### Microphone Permissions
First time you click the mic button, the browser asks for microphone permission:
- Click **Allow** to enable voice input
- You can revoke permission in browser settings anytime

---

## 🎙️ Advanced Configuration

### Change Speech Recognition Settings

Edit `src/services/speechToText.ts` in the `startWebSpeechRecognition()` method:

```typescript
// Continuous listening (stays on until you click again)
recognition.continuous = false; // Change to true for continuous mode

// Show interim results (partial transcripts)
recognition.interimResults = true; // Shows as-you-speak text

// Language selection
recognition.language = 'en-US'; // Change language code
```

### Text-to-Speech Settings

Edit the `speak()` method:

```typescript
await Speech.speak(text, {
  language: 'en',      // Change to other language codes
  pitch: 1.0,          // Range: 0.5 - 2.0 (higher = squeaky)
  rate: 1.0,           // Range: 0.1 - 3.0 (higher = faster)
});
```

---

## 📚 Supported Language Codes

**Speech Recognition** (Web Speech API):
- `en-US` (English - US)
- `en-GB` (English - British)
- `en-IN` (English - Indian)
- `es-ES` (Spanish)
- `fr-FR` (French)
- `de-DE` (German)
- `hi-IN` (Hindi)
- `ja-JP` (Japanese)
- `zh-CN` (Chinese Simplified)
- [Full list](https://www.w3.org/TR/speech-api/#lang-param)

**Text-to-Speech** (Expo Speech):
- `en` (English)
- `es` (Spanish)
- `fr` (French)
- `de` (German)
- `hi` (Hindi)
- `ja` (Japanese)
- `zh` (Chinese)
- [Full list](https://docs.expo.dev/versions/latest/sdk/speech/#example-usage)

---

## 🐛 Troubleshooting

### "Microphone not working"
- ✅ Check browser permissions
- ✅ Verify microphone hardware is connected
- ✅ Try a different browser (Chrome is most stable)
- ✅ Reload the page

### "Speech recognition not supported"
- You're on mobile - the app shows a helpful message
- Use text input instead, or test on web browser

### "Text-to-speech not working"
- Verify device volume is not muted
- Check system sound settings
- Try a different browser

### "Speech stops abruptly"
- This is normal - Web Speech API stops after ~10 seconds of silence
- Click the mic again to continue

---

## 🔮 Future Enhancements

### Mobile Speech-to-Text
Add one of these community packages:
- `react-native-speech-api` 
- `react-native-android-speech`
- `expo-speech-recognition` (when available)

### Custom Voice Models
- Implement local ML models with `react-native-tensorflow`
- Add support for custom voice profiles

### Multilingual Support
- Auto-detect input language
- Add language selector in Settings tab
- Support multiple languages simultaneously

### Advanced Features
- Voice commands ("Send", "Clear", "New chat")
- Emotion detection from voice
- Voice customization per response
- Audio file upload support

---

## 💡 Code Examples

### Using Speech Service Directly

```typescript
import { SpeechToTextService } from '@/services/speechToText';

// Check if supported
if (SpeechToTextService.isSupported()) {
  // Start listening
  SpeechToTextService.startListening(
    (transcript) => {
      console.log('Current transcript:', transcript);
    },
    (error) => {
      console.error('Error:', error);
    }
  );

  // Later, stop listening
  SpeechToTextService.stopListening();
}

// Speak text
await SpeechToTextService.speak('Hello, this is a test', () => {
  console.log('Finished speaking');
});

// Stop speaking
await SpeechToTextService.stopSpeaking();
```

---

## ✅ Testing Checklist

- [ ] Test speech input on web (Chrome)
- [ ] Test text-to-speech on web
- [ ] Test text-to-speech on mobile
- [ ] Verify microphone permission prompt appears
- [ ] Test multiple languages (if implemented)
- [ ] Check transcript updates in real-time
- [ ] Verify AI responses are saved correctly
- [ ] Test stopping mid-speech
- [ ] Test with offline mode disabled and enabled

---

## 📖 Additional Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Expo Speech Documentation](https://docs.expo.dev/versions/latest/sdk/speech/)
- [React Native Audio Guide](https://reactnative.dev/docs/0.73/sound)

---

**Happy talking! 🎤🔊**
