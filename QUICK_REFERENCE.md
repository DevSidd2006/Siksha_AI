# 📝 Quick Reference - Siksha AI v0

## 🚀 Quick Start Commands

```bash
# Install everything
npm install
cd backend && npm install && cd ..

# Setup backend
cd backend
copy .env.example .env
# Edit .env: Add GEMINI_API_KEY=your-gemini-api-key

# Run backend (Terminal 1)
cd backend
npm start

# Run frontend (Terminal 2)
npm start
```

## 📱 Running the App

| Command | Action |
|---------|--------|
| `npm start` | Start Expo dev server |
| `i` | Open iOS simulator |
| `a` | Open Android emulator |
| `w` | Open in web browser |
| `r` | Reload app |
| `m` | Toggle dev menu |

## 🔧 Useful Commands

```bash
# Test backend
npm run test-backend

# Clear cache
expo start --clear

# Check Expo status
npx expo doctor

# View logs
npx expo start --verbose
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/(tabs)/tutor.tsx` | Chat interface |
| `app/(tabs)/history.tsx` | Past conversations |
| `app/(tabs)/settings.tsx` | App settings |
| `src/services/api.ts` | Backend API calls |
| `src/storage/chatStore.ts` | Local storage |
| `backend/server.js` | Express server |
| `backend/.env` | API keys (SECRET!) |

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/tutor` | POST | Send question, get AI answer |

## 💾 Storage Keys

| Key | Content |
|-----|---------|
| `@siksha_current_chat` | Current chat session |
| `@siksha_chat_history` | All past chats (max 50) |

## 🔐 Environment Variables

**backend/.env:**
```bash
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
PORT=3000
```

## 📊 Project Structure

```
Siksha_AI/
├── app/              # Screens
│   ├── (tabs)/       # Tab navigation
│   └── _layout.tsx   # Root layout
├── src/
│   ├── components/   # UI components
│   ├── services/     # API calls
│   └── storage/      # Local storage
├── backend/          # Express server
└── [config files]    # package.json, etc.
```

## 🎯 Common Tasks

### Add Gemini Key
```bash
cd backend
notepad .env
# Add: GEMINI_API_KEY=your-gemini-api-key
```

### Change Port
**backend/.env:**
```
PORT=3001
```

**src/services/api.ts:**
```typescript
const API_URL = 'http://localhost:3001';
```

### Use on Physical Device
**src/services/api.ts:**
```typescript
const API_URL = 'http://YOUR_IP:3000';
// Example: 'http://192.168.1.100:3000'
```

Find IP: `ipconfig` (look for IPv4 Address)

### Clear All Data
1. Open app → Settings tab
2. Tap "Clear History"
3. Confirm

### Start Fresh Chat
1. Settings → Clear History
2. Go to Tutor tab
3. Type new question

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | `cd backend && npm install` |
| App won't connect | Check backend is running, use IP for device |
| Gemini errors | Check `.env` has valid API key |
| Module not found | `npm install` then `expo start --clear` |
| Port in use | Change PORT in `backend/.env` |

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Project overview |
| `SETUP_COMPLETE.md` | Complete setup guide |
| `DEVELOPMENT.md` | Development tips |
| `ARCHITECTURE.md` | System design |
| `TROUBLESHOOTING.md` | Detailed fixes |
| `QUICK_REFERENCE.md` | This file! |

## 🔥 One-Liners

```bash
# Full reset
rm -rf node_modules backend/node_modules .expo && npm install && cd backend && npm install && cd .. && expo start --clear

# Kill all Node processes
taskkill /F /IM node.exe

# Check what's on port 3000
netstat -ano | findstr :3000

# Test backend from command line
curl -X POST http://localhost:3000/tutor -H "Content-Type: application/json" -d "{\"question\":\"test\"}"
```

## 💡 Pro Tips

1. **Two terminals**: Always run backend + frontend separately
2. **Check logs**: Most errors show in terminal output
3. **Use IP for devices**: Phones can't access "localhost"
4. **Save often**: Clear History when testing to start fresh
5. **Test backend first**: Run `npm run test-backend` before running app

## 📞 Help Resources

- Backend not working? → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Need setup help? → [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- Want to modify? → [DEVELOPMENT.md](DEVELOPMENT.md)
- Understand structure? → [ARCHITECTURE.md](ARCHITECTURE.md)

## ✅ Success Checklist

- [ ] Backend responds to `curl http://localhost:3000`
- [ ] Test script passes: `npm run test-backend`
- [ ] App opens without errors
- [ ] Can send question and get answer
- [ ] History shows past conversations
- [ ] Clear History button works

---

**Bookmark this page** for quick reference during development!
