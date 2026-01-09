# 🚦 START HERE - Getting Started Guide

## 👋 Welcome to Siksha AI!

This is your **v0 AI Tutor app** - simple, clean, and ready to run in **under 10 minutes**!

---

## 🎯 What You're Building

A mobile app with:
- 💬 **Chat with AI** - Ask questions, get instant answers
- 📚 **History** - Review past conversations  
- ⚙️ **Settings** - Manage app preferences

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Everything (3 min) ⏱️

Open PowerShell in this folder and run:

```powershell
.\setup.ps1
```

Or manually:
```bash
npm install
cd backend
npm install
cd ..
```

### Step 2: Add Your Gemini Key (2 min) 🔑

1. Get an API key: https://aistudio.google.com/app/apikey
2. Open `backend\.env` (or copy from `.env.example`)
3. Add your key:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-1.5-flash
   PORT=3000
   ```

### Step 3: Run the App (2 min) 🚀

**Open TWO terminal windows:**

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
Wait for: `🚀 Siksha AI Backend running...`

**Terminal 2 (Frontend):**
```bash
npm start
```
Scan QR code with **Expo Go** app!

---

## 📱 Install Expo Go App

Download on your phone:
- **iOS:** App Store → "Expo Go"
- **Android:** Play Store → "Expo Go"

Then scan the QR code from Terminal 2!

---

## ✅ Test It's Working

Before opening the app:

```bash
npm run test-backend
```

Should show:
```
✅ Backend is running
✅ Question processed successfully!
```

---

## 🎮 Try It Out!

1. **Open app** on your phone
2. **Go to Tutor tab** (chat icon)
3. **Type:** "What is 2+2?"
4. **Tap Send**
5. **Watch** the AI respond!
6. **Check History** tab to see saved conversation
7. **Go to Settings** to clear history

---

## 🚨 Common Issues

### ❌ "Cannot connect to backend"

**If using a physical phone:**
1. Find your computer's IP:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update `src\services\api.ts`:
   ```typescript
   const API_URL = 'http://192.168.1.100:3000';
   ```

3. Restart app: Press `r` in Expo terminal

### ❌ "Gemini API error"

Check `backend\.env` has your key:
```
GEMINI_API_KEY=your-gemini-api-key
```

### ❌ "Port 3000 already in use"

Change in `backend\.env`:
```
PORT=3001
```

Update `src\services\api.ts` to match!

---

## 📚 Learn More

| Document | What's Inside |
|----------|---------------|
| [README.md](README.md) | 📋 Overview & features |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | 🔧 Detailed setup |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 🔍 Fix common issues |
| [DEVELOPMENT.md](DEVELOPMENT.md) | 💻 Dev guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 🏗️ How it works |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | ⚡ Command cheat sheet |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📊 Complete overview |

---

## 🎯 Next Steps After v0 Works

1. ✅ **Verify** - Test asking 3-5 different questions
2. ✅ **Review** - Check history screen shows all chats
3. ✅ **Customize** - Modify the AI's personality in `backend/server.js`
4. ✅ **Plan v1** - Add features like camera, voice, login

---

## 🎨 What Each Tab Does

### 💬 Tutor Tab
- Type your question
- Send to AI
- Get instant answer
- Chat history saves automatically

### 📚 History Tab  
- See all past conversations
- Tap to preview (shows first message)
- Organized by date

### ⚙️ Settings Tab
- Language picker (UI only for now)
- Offline mode toggle (coming soon)
- Clear History button

---

## 🏗️ Project Structure

```
Siksha_AI/
├── app/              ← Your 3 screens
├── src/              ← Components & services
├── backend/          ← Express server
└── [docs]            ← 7 helpful guides
```

**Total files:** 25  
**Lines of code:** ~1,500  
**Time to setup:** 10 minutes  

---

## 💡 Pro Tips

1. **Always run backend first** before starting frontend
2. **Check both terminals** if something breaks
3. **Use your IP address** when testing on phone
4. **Clear history** between tests for fresh start
5. **Read error messages** - they're usually helpful!

---

## 🆘 Need Help?

### Setup Problems
```bash
# Full reset
rm -rf node_modules backend/node_modules .expo
npm install
cd backend && npm install && cd ..
expo start --clear
```

### Backend Issues
```bash
# Test backend
npm run test-backend

# Check if running
curl http://localhost:3000
```

### Still Stuck?
Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - it has 12 common issues with solutions!

---

## 🎉 Success Checklist

You're done when:

- [x] Project files created *(already done!)*
- [ ] Dependencies installed
- [ ] Gemini key added to `.env`
- [ ] Backend starts without errors
- [ ] Frontend starts and shows QR code
- [ ] App opens on phone
- [ ] Can ask question and get answer
- [ ] History shows conversation
- [ ] Clear History works

---

## 🚀 Ready? Let's Go!

Run these commands now:

```bash
# 1. Install
npm install
cd backend && npm install && cd ..

# 2. Add API key to backend/.env

# 3. Start backend
cd backend
npm start

# 4. In NEW terminal - start frontend
npm start

# 5. Scan QR code with Expo Go!
```

---

## 📞 Quick Links

- 🌐 Get Gemini Key: https://aistudio.google.com/app/apikey
- 📱 Download Expo Go: https://expo.dev/client
- 📚 Expo Docs: https://docs.expo.dev
- 🤖 OpenAI Docs: https://platform.openai.com/docs

---

**You've got this!** 🎓✨

Everything is ready - just add your Gemini key and run!

Questions? Check the docs above or look at the code - it's well-commented!

---

**Built with ❤️ for learning**

