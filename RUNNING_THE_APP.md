# 🚀 Running Siksha AI - Complete Guide

**Date**: January 11, 2026
**Status**: Ready to Run

---

## 📋 Prerequisites

Before running the app, ensure you have:
- ✅ Node.js 16+ installed
- ✅ npm installed
- ✅ Dependencies installed (`npm install --legacy-peer-deps`)
- ✅ Backend running (optional, for AI features)

---

## 🎯 Quick Start (Choose One)

### Option 1: Run on Web (Recommended for Testing)

```bash
npm run web
```

**What happens:**
- Starts Expo development server
- Opens web version in browser
- Hot reload enabled
- Access at: http://localhost:19006

**Best for:**
- Testing features
- Development
- Quick iteration

---

### Option 2: Run on Mobile (Expo Go)

```bash
npm start
```

**What happens:**
- Starts Expo development server
- Shows QR code in terminal
- Scan with Expo Go app
- Hot reload enabled

**Best for:**
- Mobile testing
- Real device testing
- Performance testing

---

### Option 3: Run Backend Only

```bash
npm run backend
```

**What happens:**
- Starts Express.js server
- Runs on port 3000
- Enables AI tutor features
- Enables vision analysis

**Best for:**
- API testing
- Backend development
- Integration testing

---

## 🔄 Full Development Setup

### Step 1: Start Backend (Terminal 1)

```bash
npm run backend
```

**Expected output:**
```
🚀 Siksha AI Backend running on http://localhost:3000
📚 Ready to help students learn!
✅ Ollama is available
```

### Step 2: Start Frontend (Terminal 2)

```bash
npm run web
```

**Expected output:**
```
Starting Metro Bundler
...
Expo Go app is ready at http://localhost:19006
```

### Step 3: Open in Browser

- Go to: http://localhost:19006
- Or scan QR code with Expo Go app

---

## ✅ Verification Checklist

### Backend Running
- [ ] Terminal shows "Backend running on http://localhost:3000"
- [ ] No error messages
- [ ] Can access http://localhost:3000 in browser

### Frontend Running
- [ ] Terminal shows "Metro Bundler" started
- [ ] No error messages
- [ ] Can access http://localhost:19006 in browser

### App Features
- [ ] Dashboard tab loads
- [ ] Flashcards tab loads
- [ ] Quiz tab loads
- [ ] Notes tab loads
- [ ] All other tabs load
- [ ] No console errors

### API Connection
- [ ] AI Tutor responds to questions
- [ ] No connection errors
- [ ] Backend logs show requests

---

## 🐛 Troubleshooting

### Issue: "fetch failed" Error

**Cause**: Network connectivity issue with Expo

**Solution**:
```bash
# Try with offline flag
npm start -- --offline

# Or clear cache and restart
npm cache clean --force
npm start
```

### Issue: Port 3000 Already in Use

**Cause**: Backend already running

**Solution**:
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run backend
```

### Issue: Port 19006 Already in Use

**Cause**: Expo already running

**Solution**:
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Or use different port:
npm start -- --port 19007
```

### Issue: Dependencies Not Installed

**Cause**: Missing node_modules

**Solution**:
```bash
npm install --legacy-peer-deps
npm start
```

### Issue: Metro Bundler Stuck

**Cause**: Build cache corrupted

**Solution**:
```bash
# Clear cache
npm start -- --clear

# Or full reset
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

### Issue: App Won't Load

**Cause**: Various issues

**Solution**:
```bash
# 1. Clear cache
npm cache clean --force

# 2. Clear node_modules
rm -rf node_modules

# 3. Reinstall
npm install --legacy-peer-deps

# 4. Start fresh
npm start
```

---

## 📱 Testing on Different Platforms

### Web Browser
```bash
npm run web
# Opens at http://localhost:19006
```

### iOS (Mac only)
```bash
npm run ios
# Requires Xcode
```

### Android
```bash
npm run android
# Requires Android Studio
```

### Expo Go App
```bash
npm start
# Scan QR code with Expo Go
```

---

## 🔍 Monitoring

### Check Backend Health

```bash
curl http://localhost:3000
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Siksha AI Backend is running",
  "version": "1.0.0",
  "ollama": "connected",
  "aiModel": "Gemini API"
}
```

### Check Frontend

- Open http://localhost:19006 in browser
- Should see Siksha AI app
- All tabs should be visible

### Monitor Logs

**Backend logs:**
- Shows API requests
- Shows errors
- Shows Ollama status

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab
- Should be no errors

---

## 🎯 Development Workflow

### 1. Make Code Changes
- Edit files in `app/` or `src/`
- Save file

### 2. Hot Reload
- Changes appear automatically
- No need to restart

### 3. Test Features
- Test in browser
- Check console for errors
- Verify functionality

### 4. Debug Issues
- Open DevTools (F12)
- Check Console tab
- Check Network tab
- Check Application tab

### 5. Commit Changes
```bash
git add .
git commit -m "Your message"
git push
```

---

## 📊 Performance Monitoring

### Frontend Performance
- Open DevTools (F12)
- Go to Performance tab
- Record interaction
- Check metrics

### Backend Performance
- Monitor terminal output
- Check response times
- Monitor CPU usage
- Monitor memory usage

### Network Performance
- Open DevTools (F12)
- Go to Network tab
- Check request times
- Check response sizes

---

## 🔐 Environment Variables

### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Backend (backend/.env)
```env
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
OLLAMA_HOST=http://localhost:11434
```

---

## 📝 Common Commands

```bash
# Start web version
npm run web

# Start mobile version
npm start

# Start backend
npm run backend

# Build for web
npm run export-web

# Deploy to Vercel
vercel

# Clear cache
npm cache clean --force

# Reinstall dependencies
npm install --legacy-peer-deps

# Kill all node processes (Windows)
taskkill /F /IM node.exe
```

---

## 🎓 Learning Resources

### Expo Documentation
- https://docs.expo.dev

### React Native Documentation
- https://reactnative.dev

### TypeScript Documentation
- https://www.typescriptlang.org

### Express.js Documentation
- https://expressjs.com

---

## ✨ Tips & Tricks

### Faster Development
- Use web version for quick testing
- Use hot reload
- Keep DevTools open
- Monitor console for errors

### Better Debugging
- Use console.log for debugging
- Use DevTools debugger
- Check network requests
- Monitor performance

### Smooth Workflow
- Keep terminal visible
- Watch for errors
- Test frequently
- Commit often

---

## 🚀 Ready to Run!

You're all set to run Siksha AI!

### Quick Start
```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend
npm run web

# Open browser
# http://localhost:19006
```

### Start Coding!
- Make changes
- See them live
- Test features
- Debug issues

---

## 📞 Support

### Issues?
1. Check this guide
2. Check browser console
3. Check terminal output
4. Check error messages

### Still stuck?
1. Clear cache: `npm cache clean --force`
2. Reinstall: `npm install --legacy-peer-deps`
3. Restart: `npm start`

---

**Running Siksha AI v1.0**
**Last Updated**: January 11, 2026
**Status**: Ready to Run ✅
