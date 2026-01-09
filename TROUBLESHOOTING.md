# 🔧 Troubleshooting Checklist

Quick reference for common issues when setting up Siksha AI v0.

## ✅ Pre-Flight Checklist

Before running the app, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo CLI installed (`npx expo --version`)
- [ ] All dependencies installed in root folder (`npm install`)
- [ ] All dependencies installed in backend folder (`cd backend && npm install`)
- [ ] Gemini API key added to `backend/.env`
- [ ] Gemini API key is valid and has quota

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module '@/...'"

**Symptoms:**
```
Error: Cannot find module '@/services/api'
```

**Solutions:**
1. Check `tsconfig.json` has paths configured:
   ```json
   "paths": {
     "@/*": ["src/*"]
   }
   ```
2. Restart Expo dev server: `expo start --clear`
3. Reinstall: `rm -rf node_modules && npm install`

---

### Issue 2: Backend won't start

**Symptoms:**
```
Error: Cannot find module 'express'
or
Error: Port 3000 is already in use
```

**Solutions:**
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Change port in `backend/.env`:
   ```
   PORT=3001
   ```
   Then update `src/services/api.ts` to match
3. Kill process on port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

---

### Issue 3: "Cannot connect to backend" from app

**Symptoms:**
- App loads but questions fail
- Console error: "Failed to fetch"
- "Please check your connection" message

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # Should show "Backend is running"
   curl http://localhost:3000
   ```

2. **Test backend directly:**
   ```bash
   npm run test-backend
   ```

3. **For physical devices (phone), use your IP:**
   - Find your IP: `ipconfig` (Windows)
   - Update `src/services/api.ts`:
     ```typescript
     const API_URL = __DEV__ 
       ? 'http://192.168.1.100:3000'  // YOUR IP HERE
       : 'https://your-production-url.com';
     ```

4. **Check firewall:**
   - Allow Node.js through Windows Firewall
   - Or temporarily disable firewall for testing

---

### Issue 4: Gemini API errors

**Symptoms:**
```
Error: API key authentication failed
or
Error: Insufficient credits
```

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   cd backend
   dir .env  # Should exist
   ```

2. **Check API key format:**
   - No spaces or quotes needed
   - Example: `GEMINI_API_KEY=your-gemini-api-key`

3. **Verify API key is valid:**
   - Go to https://aistudio.google.com/app/apikey
   - Generate new key if needed
   - Check quota/limits in Google AI Studio

4. **Test manually:**
   ```bash
    curl https://generativelanguage.googleapis.com/v1/models ^
       -H "Authorization: Bearer YOUR_KEY_HERE"
   ```

---

### Issue 5: "MaterialIcons not found"

**Symptoms:**
```
Error: Cannot find @expo/vector-icons
```

**Solutions:**
```bash
npx expo install @expo/vector-icons
expo start --clear
```

---

### Issue 6: AsyncStorage warnings

**Symptoms:**
```
Warning: AsyncStorage has been extracted from react-native
```

**Solutions:**
```bash
npx expo install @react-native-async-storage/async-storage
expo start --clear
```

---

### Issue 7: Picker errors on Android

**Symptoms:**
```
Error: @react-native-picker/picker not found
```

**Solutions:**
```bash
npm install @react-native-picker/picker
expo start --clear
```

---

### Issue 8: TypeScript errors

**Symptoms:**
```
TS Error: Cannot find name '__DEV__'
or
Type errors in components
```

**Solutions:**
1. Add to `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true
     }
   }
   ```
2. Restart VS Code
3. Run: `npx tsc --noEmit` to check all errors

---

### Issue 9: Expo won't start

**Symptoms:**
```
Error: Metro bundler failed to start
or
Error: Port 8081 already in use
```

**Solutions:**
1. Clear cache:
   ```bash
   expo start --clear
   ```
2. Reset everything:
   ```bash
   rm -rf node_modules .expo
   npm install
   expo start
   ```
3. Kill Metro processes:
   ```bash
   # Windows
   taskkill /F /IM node.exe
   ```

---

### Issue 10: App crashes on launch

**Symptoms:**
- App opens then immediately closes
- White screen
- Red error screen

**Solutions:**

1. **Check Expo logs:**
   - Look for error in terminal
   - Shake device → "Show Dev Menu" → "Debug"

2. **Verify all files exist:**
   ```bash
   # Should see no errors
   npx expo doctor
   ```

3. **Check app.json:**
   - Must have valid JSON
   - No syntax errors

4. **Reinstall Expo Go:**
   - Uninstall from phone
   - Reinstall from App Store / Play Store

---

### Issue 11: "Network request failed" on device

**Symptoms:**
- Works on simulator but not phone
- "Network request failed" error
- Can't connect to backend

**Solutions:**

1. **Phone and computer must be on same WiFi**

2. **Use computer's IP, not localhost:**
   ```typescript
   // WRONG
   const API_URL = 'http://localhost:3000';
   
   // CORRECT
   const API_URL = 'http://192.168.1.100:3000';
   ```

3. **Find your IP:**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address under WiFi adapter
   ```

4. **Test connectivity:**
   ```bash
   # On computer
   ping YOUR_IP
   
   # From phone browser
   # Navigate to: http://YOUR_IP:3000
   # Should show "Backend is running"
   ```

---

### Issue 12: History screen is empty

**Symptoms:**
- Sent messages but history is empty
- Fresh install shows no data

**Expected Behavior:**
- This is normal on first run!
- History only shows after asking questions
- Check Tutor screen has messages first

**Solutions:**
1. Go to Tutor tab
2. Send a question and get response
3. Go back to History tab
4. Should now show the conversation

---

## 🔍 Debugging Tools

### Check Backend Health
```bash
curl http://localhost:3000
# Should return: {"status":"ok",...}
```

### Test Backend API
```bash
npm run test-backend
```

### Check AsyncStorage Contents
Add this to any screen:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const debugStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('Storage keys:', keys);
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(key, ':', value);
  }
};
```

### Check Network Requests
In Expo Dev Menu (shake device):
- Enable "Remote JS Debugging"
- Open Chrome DevTools → Network tab
- See all API calls

### Backend Logs
Watch backend terminal for:
```
Question received: ...
Answer generated: ...
```

---

## 📋 Reset Everything (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Stop all processes (Ctrl+C)

# 2. Clean frontend
rm -rf node_modules .expo
npm install

# 3. Clean backend
cd backend
rm -rf node_modules
npm install
cd ..

# 4. Clear Expo cache
npx expo start --clear

# 5. Clear AsyncStorage
# In app: Go to Settings → Clear History
# Or reinstall Expo Go app
```

---

## 🆘 Still Stuck?

1. **Check error message carefully** - Copy exact error text
2. **Search error online** - Include "Expo" or "React Native"
3. **Review logs** - Both Expo and backend terminals
4. **Check documentation:**
   - [README.md](README.md)
   - [DEVELOPMENT.md](DEVELOPMENT.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Backend responds: `curl http://localhost:3000` returns status
- ✅ Test passes: `npm run test-backend` shows success
- ✅ App launches without errors
- ✅ Can type and send a question
- ✅ Receive AI response in chat
- ✅ History screen shows conversation
- ✅ Settings → Clear History works

---

**Good luck!** Most issues are solved by:
1. Checking both terminals for errors
2. Using correct IP address for devices
3. Verifying OpenAI API key is set
4. Reinstalling dependencies

