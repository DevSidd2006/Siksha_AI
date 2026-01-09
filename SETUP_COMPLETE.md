# 🎓 Siksha AI - v0 Complete Setup

## ✅ What You Have

A fully functional AI Tutor mobile app with:

### Frontend (React Native + Expo)
- ✅ **Tutor Screen** - Chat interface with AI
- ✅ **History Screen** - View past conversations  
- ✅ **Settings Screen** - Language picker, offline toggle, clear history
- ✅ **Local Storage** - Chats persist using AsyncStorage
- ✅ **Tab Navigation** - Easy switching between screens

### Backend (Node.js + Express)
- ✅ **POST /tutor** - Processes questions via Gemini
- ✅ **Secure API** - Gemini key stored server-side only
- ✅ **Error Handling** - Graceful failure messages

### Architecture
- ✅ Clean separation: UI → API Service → Backend → Gemini
- ✅ Type-safe TypeScript on frontend
- ✅ Minimal dependencies for fast setup

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
cd backend
npm install
cd ..
```

Or use the setup script:
```powershell
.\setup.ps1
```

### 2. Configure Gemini Key
```bash
cd backend
copy .env.example .env
# Edit .env and add: GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run the App
**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm start
```

Then scan the QR code with Expo Go app!

## 📁 File Structure

```
Siksha_AI/
│
├── 📱 app/                          # Frontend screens
│   ├── _layout.tsx                  # Root navigation
│   ├── index.tsx                    # Redirects to tutor
│   └── (tabs)/
│       ├── _layout.tsx              # Tab bar config
│       ├── tutor.tsx                # 💬 Chat screen
│       ├── history.tsx              # 📚 Past chats
│       └── settings.tsx             # ⚙️ App settings
│
├── 🎨 src/
│   ├── components/
│   │   └── ChatBubble.tsx           # Message UI component
│   ├── services/
│   │   └── api.ts                   # Backend API calls
│   └── storage/
│       └── chatStore.ts             # AsyncStorage wrapper
│
├── 🔧 backend/
│   ├── server.js                    # Express server + Gemini
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment template
│   └── .env                         # Your API key (create this!)
│
├── 📋 Configuration Files
│   ├── package.json                 # Frontend dependencies
│   ├── app.json                     # Expo config
│   ├── tsconfig.json                # TypeScript config
│   └── babel.config.js              # Babel config
│
└── 📚 Documentation
    ├── README.md                    # Project overview
    ├── DEVELOPMENT.md               # Dev guide
    └── SETUP_COMPLETE.md            # This file!
```

## 🧪 Testing

### Test Backend Connection
```bash
npm run test-backend
```

### Manual API Test
```bash
curl -X POST http://localhost:3000/tutor ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"What is AI?\"}"
```

## 📱 Running on Device

### Using Expo Go (Easiest)
1. Install Expo Go from App Store / Play Store
2. Scan QR code from `npm start`
3. Update API_URL in `src/services/api.ts` to use your computer's IP:
   ```typescript
   const API_URL = 'http://YOUR_IP:3000'; // e.g., 192.168.1.100
   ```

### Using Simulators
- iOS: Press `i` (requires Xcode on Mac)
- Android: Press `a` (requires Android Studio)
- Web: Press `w` (works on any OS)

## 🔍 Key Features Explained

### Tutor Screen (tutor.tsx)
- Text input with multi-line support
- Send button (disabled when empty or loading)
- Chat bubble list with user/AI messages
- Loading indicator during API calls
- Auto-save to local storage

### History Screen (history.tsx)
- Shows all past conversations
- Displays first message as preview
- Shows timestamp and message count
- Tap to view (currently shows alert, can expand later)

### Settings Screen (settings.tsx)
- Language dropdown (UI only - ready for i18n)
- Offline mode toggle (placeholder for future)
- Clear history button with confirmation

### Local Storage (chatStore.ts)
- Saves current chat session
- Maintains history of up to 50 chats
- Persists across app restarts
- Easy to upgrade to SQLite later

### API Service (api.ts)
- Single point for backend communication
- Automatic dev/production URL switching
- Error handling with user-friendly messages

### Backend Server (server.js)
- Validates incoming requests
- Adds system prompt for tutor personality
- Handles OpenAI errors gracefully
- Returns formatted responses

## 🎯 What's Missing (Intentionally)

These are **NOT** in v0 to keep it simple:

❌ User authentication / login  
❌ Camera for homework photos  
❌ Voice input  
❌ Offline content packs  
❌ Analytics / tracking  
❌ Multi-language UI  
❌ Payment integration  

**These come in v1+** after validating the core concept!

## 🚧 Known Limitations

1. **Single chat session** - Starting a new question continues the same chat (can clear in Settings)
2. **No conversation context** - Each question is independent (can add message history later)
3. **Basic UI** - Minimal styling (can enhance with theme system)
4. **No image support** - Text only for now
5. **No offline mode** - Requires internet connection

## 🔧 Troubleshooting

### "Cannot connect to backend"
- ✅ Check backend is running: `cd backend && npm start`
- ✅ Verify port 3000 is free
- ✅ For physical device, use computer's IP, not localhost

### "OpenAI API error"
- ✅ Check `.env` file exists in backend folder
- ✅ Verify API key is valid and has credits
- ✅ Test with: `npm run test-backend`

### "Module not found" errors
- ✅ Run: `npm install` in root folder
- ✅ Run: `npm install` in backend folder
- ✅ Try: `expo start --clear`

### AsyncStorage warnings
- ✅ Normal on first run
- ✅ Install native AsyncStorage if needed: `npx expo install @react-native-async-storage/async-storage`

## 📈 Next Steps (v1 Roadmap)

### Phase 1: Core Enhancements
- [ ] Add conversation context (send previous messages)
- [ ] Implement "New Chat" button
- [ ] Add loading skeletons for better UX
- [ ] Create chat detail view (not just history preview)

### Phase 2: Media Features
- [ ] Camera integration for homework photos
- [ ] Voice input using speech-to-text
- [ ] Image analysis with GPT-4 Vision

### Phase 3: User System
- [ ] User registration / login
- [ ] Cloud sync of chat history
- [ ] User preferences and settings

### Phase 4: Learning Features
- [ ] Subject-specific tutors (Math, Science, etc.)
- [ ] Learning progress tracking
- [ ] Spaced repetition quizzes
- [ ] Offline content packs

## 💡 Tips for Development

1. **Start Simple** - Don't add features until v0 works perfectly
2. **Test Often** - Run `npm run test-backend` after changes
3. **Version Control** - Commit working states frequently
4. **Read Logs** - Check both frontend (Expo) and backend (Node) logs
5. **Ask for Help** - Use the README and DEVELOPMENT.md guides

## 🎉 Success Criteria

You'll know v0 is working when:

✅ Backend responds to test script  
✅ App opens on phone/simulator  
✅ You can type a question and get an answer  
✅ Chat history appears after asking 2+ questions  
✅ Settings screen can clear history  
✅ App works after force-close and restart  

## 📞 Support

Check these files for help:
- [README.md](README.md) - Overview and setup
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- Backend logs - `backend/server.js` console
- Frontend logs - Expo terminal / Dev menu

---

**Ready to start?** Run the Quick Start commands above! 🚀
