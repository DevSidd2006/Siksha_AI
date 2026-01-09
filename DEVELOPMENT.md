# Development Guide

## Running the App

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Option 2: Using npm scripts

The `package.json` includes a convenience script:
```bash
npm run backend
```

## Development Tips

### Testing on Physical Device

If using a physical phone with Expo Go, update the API URL:

1. Find your computer's local IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update `src/services/api.ts`:
   ```typescript
   const API_URL = __DEV__ 
     ? 'http://192.168.1.100:3000'  // Use your IP
     : 'https://your-production-url.com';
   ```

### Hot Reload

- Frontend: Expo supports hot reload by default
- Backend: Use `nodemon` for auto-restart:
  ```bash
  cd backend
  npm install -g nodemon
  npm run dev
  ```

### Debugging

**Frontend:**
- Press `j` in Expo terminal to open debugger
- Use `console.log()` statements
- Install React Native Debugger

**Backend:**
- Check terminal logs
- Test endpoints with curl:
  ```bash
  curl -X POST http://localhost:3000/tutor \
    -H "Content-Type: application/json" \
    -d '{"question":"What is 2+2?"}'
  ```

## Common Issues

### Port 3000 Already in Use

Change the port in `backend/.env`:
```
PORT=3001
```

And update `src/services/api.ts` accordingly.

### Cannot Connect to Backend

1. Verify backend is running (check terminal)
2. Verify port 3000 is accessible
3. For physical devices, use local IP instead of localhost
4. Check firewall settings

### AsyncStorage Errors

Clear app data:
```bash
expo start --clear
```

## Project Structure Explained

```
app/
├── _layout.tsx          # Root layout wrapper
├── index.tsx            # Redirects to tutor tab
└── (tabs)/              # Tab navigation group
    ├── _layout.tsx      # Tab bar configuration
    ├── tutor.tsx        # Main chat interface
    ├── history.tsx      # Past conversations
    └── settings.tsx     # App configuration

src/
├── components/          # Reusable UI components
├── services/           # API and external services
└── storage/            # Local data persistence

backend/
└── server.js           # Express API server
```

## Adding New Features

### Adding a New Screen

1. Create file in `app/` folder
2. Add navigation link in relevant screen
3. Configure in `_layout.tsx` if needed

### Adding New Storage

1. Add functions to `src/storage/chatStore.ts`
2. Use AsyncStorage for simple key-value data
3. Consider SQLite for complex queries (future upgrade)

### Modifying AI Behavior

Edit the system prompt in `backend/server.js`:
```javascript
{
  role: 'system',
  content: 'Your custom instructions here...'
}
```

## Next Steps

- Add user authentication
- Implement voice input
- Add image recognition for homework
- Create offline content packs
- Build analytics dashboard
