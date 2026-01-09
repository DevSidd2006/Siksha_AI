# Siksha AI - v0 Simple App

A minimal AI Tutor mobile app built with Expo and React Native.

## Features

✅ **Tutor Screen** - Ask questions and get AI-powered answers  
✅ **History Screen** - View past conversations  
✅ **Settings Screen** - Language selection and data management  
✅ **Local Storage** - Chat history persists across app restarts  
✅ **Backend API** - Secure Gemini integration  

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Gemini API key:**
   ```bash
   cd backend
   copy .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

### Run the App

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:3000

2. **Start the Expo app** (in a new terminal):
   ```bash
   npm start
   ```

3. **Open on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

```
siksha-ai/
├── app/
│   ├── (tabs)/
│   │   ├── tutor.tsx      # Main chat screen
│   │   ├── history.tsx    # Chat history
│   │   └── settings.tsx   # App settings
│   └── index.tsx          # Entry point
├── src/
│   ├── components/
│   │   └── ChatBubble.tsx # Message bubble component
│   ├── services/
│   │   └── api.ts         # Backend API calls
│   └── storage/
│       └── chatStore.ts   # AsyncStorage wrapper
└── backend/
    ├── server.js          # Express server
    └── .env               # Environment variables
```

## API Endpoints

### `POST /tutor`
Send a question and receive an AI response.

**Request:**
```json
{
  "question": "What is photosynthesis?"
}
```

**Response:**
```json
{
  "answer": "Photosynthesis is...",
  "timestamp": "2025-12-23T10:30:00.000Z"
}
```

## Tech Stack

- **Frontend:** React Native, Expo Router, AsyncStorage
- **Backend:** Node.js, Express, Gemini API
- **Icons:** @expo/vector-icons (MaterialIcons)

## Offline llama.cpp integration

- Run `npx expo prebuild --platform android` to generate the native Android project if you haven't already.
- Drop a quantized GGUF model (e.g., `phi-3-mini-3.8b-q4_k_m.gguf`) into `android/app/src/main/assets/models/` or download it at runtime.
- Point `src/services/offlineTutor.ts` at the model path (update `DEFAULT_MODEL_PATH`) and ensure the native bridge initializes it before generating responses.
- The Kotlin module `LlamaBridgeModule`, C++ JNI file, and `CMakeLists.txt` live under `android/app/src/main/`; the Kotlin package is registered in `MainApplication`.
- Build with `cd android && ./gradlew assembleDebug`; the native library is built via CMake and bundled into the APK.
- Replace the placeholder logic in `android/app/src/main/cpp/LlamaBridgeNative.cpp` with llama.cpp API calls (model loading, inference, context cleanup) using the `LLAMA_CPP_ROOT` cache path in `CMakeLists.txt`.

## What's Next (v1 Features)

- 📸 Camera integration for homework help
- 🎤 Voice input for questions
- 🔐 User authentication
- 📦 Offline content packs
- 🌍 Multi-language support
- 📊 Learning analytics

## Troubleshooting

**Backend connection issues:**
- Ensure backend is running on port 3000
- For physical devices, update `API_URL` in `src/services/api.ts` to use your computer's local IP instead of `localhost`

**Gemini API errors:**
- Verify your API key in `backend/.env`
- Check you have quota in your Google AI Studio account

## License

MIT
