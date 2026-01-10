# Testing the Onboarding Tutorial

## 🎯 Quick Test Guide

### Method 1: Using the Reset Button (Easiest!)
1. **Look at the header** of the tutor screen
2. **Click the 🔄 button** between "Ask Your Doubt" and the Online/Offline badge
3. The tutorial will restart immediately!

### Method 2: Check the Console Logs
Open your browser's developer console (F12) and look for these logs:
- `🎓 Tutorial check - hasSeenTutorial_v1:` - Shows if tutorial was seen before
- `🎉 First time user! Showing welcome splash...` - Tutorial will start
- `✅ Tutorial already seen, skipping onboarding` - Tutorial was already completed

### Method 3: Manual AsyncStorage Reset
If you want to test like a first-time user:

```javascript
// In your browser console or React Native debugger:
await AsyncStorage.removeItem('hasSeenTutorial_v1');
// Then reload the app
```

## 📋 Expected Flow

### First Time User:
1. **Welcome Splash** (3 seconds)
   - Animated Siksha AI logo
   - App name and tagline
   - Feature highlights

2. **Tutorial Modal** (7 steps)
   - Step 1: Welcome to Siksha AI
   - Step 2: Online/Offline Mode
   - Step 3: Type Your Question
   - Step 4: Voice Input
   - Step 5: Image Upload
   - Step 6: Send & Chat
   - Step 7: New Chat

3. **Main App**
   - Tutorial complete, ready to use!

### Returning User:
- Goes directly to the main app
- No splash or tutorial shown

## 🐛 Troubleshooting

### Tutorial Not Showing?
1. **Check console logs** - Look for the emoji logs
2. **Click the 🔄 button** in the header to reset
3. **Clear app data** if needed

### Tutorial Stuck?
1. **Click "Skip Tour"** to exit immediately
2. **Check console** for error messages
3. **Reload the app**

### Animations Not Smooth?
- Test on a physical device (emulators can be slow)
- Check that you're not in debug mode with performance monitoring

## 🎨 What to Look For

### Welcome Splash:
- ✅ Logo rotates and pulses
- ✅ Text slides up smoothly
- ✅ Fades out after ~3 seconds
- ✅ Transitions to tutorial

### Tutorial Modal:
- ✅ Progress bar fills as you advance
- ✅ Dot indicators show current step
- ✅ Smooth animations between steps
- ✅ "Next →" button on steps 1-6
- ✅ "🎉 Get Started!" button on step 7
- ✅ "Skip Tour" button always available

## 📱 Testing on Different Platforms

### Web Browser:
```bash
npm start
# Press 'w' for web
# Open browser console (F12) to see logs
```

### Android:
```bash
npm start
# Press 'a' for Android
# Use React Native debugger or Logcat
```

### iOS:
```bash
npm start
# Press 'i' for iOS
# Check Xcode console or React Native debugger
```

## 🔧 Debug Mode

All tutorial functions now have console logging:
- 🎓 Tutorial check
- 👋 Welcome complete
- 📚 Tutorial shown
- ⏭️ Tutorial skipped
- 🎉 Tutorial completed
- ✅ State saved
- ❌ Errors

Look for these emojis in your console to track the flow!

## 💡 Tips

1. **First test**: Click the 🔄 button to see the full flow
2. **Check logs**: Console will tell you exactly what's happening
3. **Test skip**: Make sure "Skip Tour" works
4. **Test complete**: Go through all 7 steps
5. **Test persistence**: Reload app - tutorial shouldn't show again
6. **Reset again**: Use 🔄 button to test multiple times

---

**Note**: The 🔄 reset button is for debugging. You can remove it later for production by removing the TouchableOpacity in the header.
