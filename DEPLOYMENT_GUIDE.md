# Siksha AI - Deployment Guide

## Project Overview
Siksha AI is an educational platform with:
- **Backend**: Node.js/Express API deployed on Vercel
- **Frontend**: React Native Expo app (web version for hackathon)
- **Features**: AI Tutor, Flashcards, Quiz, Progress Tracking, Dashboard

## Current Deployment Status

### Backend ✅
- **Status**: Deployed to Vercel
- **URL**: https://sikshaai-backend.vercel.app
- **Environment**: Production
- **API Endpoints**: 
  - `GET /` - Health check
  - `POST /tutor` - AI tutor responses
  - `POST /analyze-image` - Vision analysis
  - `POST /speech-to-text` - Speech recognition

### Frontend 🚀
- **Status**: Ready for deployment
- **Platform**: Vercel (web version)
- **Build Command**: `npx expo export --platform web`
- **Output Directory**: `dist/`

## Deployment Steps

### 1. Prepare Frontend for Deployment

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build for web
npm run export-web
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option B: Using GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push

#### Option C: Manual Upload
1. Go to https://vercel.com
2. Create new project
3. Upload the `dist/` folder

### 3. Configure Environment Variables

In Vercel project settings, add:
```
EXPO_PUBLIC_API_URL=https://sikshaai-backend.vercel.app
```

## Local Development

### Start Backend
```bash
npm run backend
```
Backend runs on `http://localhost:3000`

### Start Frontend (Web)
```bash
npm run web
```
Frontend runs on `http://localhost:19006`

### Start Frontend (Mobile)
```bash
npm start
```

## Features Implemented

### 1. AI Tutor
- Real-time chat with AI
- Supports Gemini API and Ollama
- Student-grade aware responses

### 2. Flashcards
- Class 9 Science flashcards
- 3 chapters with 10 cards each
- Flip animation and difficulty levels

### 3. Quiz System
- 18 questions (6 per chapter)
- 30-second timer per question
- Instant feedback with explanations
- Performance tracking

### 4. Progress Dashboard
- Study streak counter
- Session tracking
- Time spent calculation
- Average quiz scores
- Note-taking system

### 5. Additional Features
- Image analysis with vision models
- OCR support
- Study history
- User profile management
- Settings customization

## Troubleshooting

### Build Issues
- Use `--legacy-peer-deps` flag for npm install
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall

### API Connection Issues
- Verify backend URL in `.env`
- Check CORS settings in backend
- Ensure backend is running/deployed

### Ollama Issues
- Ollama must run on port 11434
- Check `OLLAMA_HOST` in backend/.env
- Run: `ollama serve`

## Hackathon Submission

### Deployment Link
Frontend: `https://siksha-ai.vercel.app` (after deployment)
Backend: `https://sikshaai-backend.vercel.app`

### Demo Features
1. **AI Tutor**: Ask any science question
2. **Flashcards**: Study Class 9 Science concepts
3. **Quiz**: Test knowledge with timed questions
4. **Progress**: Track learning journey
5. **Dashboard**: View overall statistics

## Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Material Icons
- Async Storage

### Backend
- Node.js
- Express.js
- Google Generative AI (Gemini)
- Ollama (local LLM)
- CORS enabled

### Deployment
- Vercel (Frontend & Backend)
- Environment variables for configuration

## Next Steps

1. Deploy frontend to Vercel
2. Test all features on production
3. Gather user feedback
4. Iterate and improve
5. Submit hackathon link

## Support

For issues or questions:
1. Check logs in Vercel dashboard
2. Review error messages in browser console
3. Verify environment variables
4. Test backend health: `curl https://sikshaai-backend.vercel.app`
