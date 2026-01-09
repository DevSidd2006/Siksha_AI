# 🎤 Voice Features - Quick Setup

## What Was Added?

Your Siksha AI app now has **speech-to-text** and **text-to-speech** capabilities:

### Features:
1. ✅ **Speak your questions** - Use microphone instead of typing (web only)
2. ✅ **Listen to answers** - Click any AI response to hear it read aloud
3. ✅ **Real-time transcript** - See what you're saying as you speak
4. ✅ **Smart platforms** - Works on web and mobile appropriately

---

## 🚀 Try It Now

### On Web (Chrome recommended)
```bash
# Your app is already running!
# Open it in a web browser - press 'w' in the Expo terminal
```

1. Click the **microphone button** (🎙️) in the input area
2. **Speak your question**
3. Click **Send** to submit
4. **Tap any AI response** to hear it read aloud

### On Mobile (Android/iOS)
- **Voice input**: Shows helpful info (web browser needed)
- **Voice output**: Tap any AI response to listen ✅

---

## 📁 Files Changed

| File | Change |
|------|--------|
| `src/services/speechToText.ts` | ✨ **NEW** - Voice service |
| `app/(tabs)/tutor.tsx` | 🔧 Added voice input button |
| `src/components/ChatBubble.tsx` | 🔧 Added tap-to-speak for AI |

---

## 🎯 How to Use

### Speech-to-Text (Web Only)

**Before:**
```
[Text input field] [Send]
```

**Now:**
```
[Text input field] [🎙️ Voice button] [Send]
```

- **Click 🎙️** to start listening (turns red 🎤 while active)
- **Click again** to stop and submit
- Transcript appears in the text field

### Text-to-Speech (Web & Mobile)

**Before:**
```
[AI Message]
```

**Now:**
```
[AI Message] 🔇  ← Click to listen
```

- **Click the message** to hear it read aloud
- **Icon changes** from 🔇 to 🔊 while speaking
- **Click again** to stop

---

## ⚙️ Configuration

### Change Language

Edit `src/services/speechToText.ts` or use the **Settings** screen to select from all Indian languages:

**Available Languages:**
- 🇮🇳 **Hindi** (hi-IN)
- 🇮🇳 **Tamil** (ta-IN)
- 🇮🇳 **Telugu** (te-IN)
- 🇮🇳 **Kannada** (kn-IN)
- 🇮🇳 **Malayalam** (ml-IN)
- 🇮🇳 **Marathi** (mr-IN)
- 🇮🇳 **Gujarati** (gu-IN)
- 🇮🇳 **Punjabi** (pa-IN)
- 🇮🇳 **Bengali** (bn-IN)
- 🇮🇳 **Odia** (or-IN)
- 🇮🇳 **Assamese** (as-IN)
- 🇮🇳 **Urdu** (ur-IN)
- 🇬🇧 **English (India)** (en-IN)
- 🇺🇸 **English (US)** (en-US)

**Programmatically:**
```typescript
// In any component, import and use:
import { SpeechToTextService } from '@/services/speechToText';

// Set language for speech recognition
SpeechToTextService.setLanguage('hi-IN');

// Speak in a specific language
await SpeechToTextService.speak('नमस्ते', 'hi-IN');
```

### Change Speech Speed/Pitch

Edit `src/services/speechToText.ts` line ~181:

```typescript
await Speech.speak(text, {
  rate: 1.0,    // 0.1 (slow) to 3.0 (fast)
  pitch: 1.0,   // 0.5 (deep) to 2.0 (high)
  language: 'en',
});
```

---

## ✅ Testing

Test on web browser:
```bash
# In VS Code terminal, press 'w' when Expo is running
npm start
# Press 'w' for web
```

1. ✅ Click microphone, speak "Hello"
2. ✅ Click send
3. ✅ Wait for AI response
4. ✅ Click AI message
5. ✅ Hear the response

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Mic button doesn't appear | You're on mobile - test on web browser |
| Microphone not working | Check browser permissions, try Chrome |
| Text-to-speech not working | Check device volume, try refreshing page |
| Speech stops after 10 seconds | Normal behavior - click mic again to continue |

---

## 📚 More Info

See [VOICE_INTEGRATION_GUIDE.md](./VOICE_INTEGRATION_GUIDE.md) for:
- Detailed platform support info
- Language codes and setup
- Advanced configuration options
- Future enhancement ideas

---

**Start talking to your AI tutor! 🎤**
