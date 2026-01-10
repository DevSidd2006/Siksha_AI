# Siksha AI - Quick Start Guide

## 🚀 Live Demo
- **Frontend**: https://siksha-ai.vercel.app
- **Backend**: https://sikshaai-backend.vercel.app

## 📋 What's Included

✅ AI Tutor - Real-time chat with AI
✅ Flashcards - 30 Class 9 Science cards
✅ Quiz System - 18 timed questions
✅ Progress Tracking - Study statistics
✅ Dashboard - Overall analytics
✅ User Profile - Personalization
✅ Study History - Learning records

## 🎯 Quick Features Demo

### 1. Ask AI Tutor
```
Q: What is evaporation?
A: Evaporation is the process where liquid converts to gas...
```

### 2. Study Flashcards
- Matter in Our Surroundings
- Is Matter Around Us Pure
- Atoms and Molecules

### 3. Take Quiz
- 6 questions per chapter
- 30-second timer
- Instant feedback
- Performance scoring

### 4. Track Progress
- Study streak
- Time spent
- Quiz scores
- Notes

## 💻 Local Development

```bash
# Install
npm install --legacy-peer-deps

# Backend
npm run backend

# Frontend (Web)
npm run web

# Frontend (Mobile)
npm start
```

## 🌐 Deployment

### Frontend to Vercel
```bash
npm run export-web
vercel
```

### Backend (Already Deployed)
https://sikshaai-backend.vercel.app

## 📁 Project Structure

```
app/(tabs)/
├── tutor.tsx       → AI Tutor
├── flashcards.tsx  → Flashcards
├── quiz.tsx        → Quiz
├── progress.tsx    → Progress
├── dashboard.tsx   → Dashboard
├── history.tsx     → History
├── profile.tsx     → Profile
└── settings.tsx    → Settings

src/data/
├── class9Science.ts      → Flashcard data
├── class9ScienceQuiz.ts  → Quiz questions
└── studyProgress.ts      → Progress data

backend/
├── server.js       → Express API
└── .env            → Config
```

## 🔧 Configuration

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=https://sikshaai-backend.vercel.app
```

### Backend (backend/.env)
```
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
OLLAMA_HOST=http://localhost:11434
```

## ✨ Key Technologies

- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Node.js + Express
- **AI**: Google Gemini API + Ollama
- **Deployment**: Vercel
- **Database**: SQLite

## 🎓 Features by Tab

| Tab | Features |
|-----|----------|
| AI Tutor | Real-time chat, AI responses |
| Flashcards | Study cards, flip animation |
| Quiz | Timed questions, instant feedback |
| Progress | Statistics, streak counter |
| Dashboard | Overall analytics |
| History | Study records |
| Profile | User info, preferences |
| Settings | App configuration |

## 📊 Quiz System

- **Total Questions**: 18
- **Per Chapter**: 6 questions
- **Time per Question**: 30 seconds
- **Chapters**: 3 (Matter, Purity, Atoms)
- **Difficulty**: Easy, Medium, Hard

## 🎯 Flashcard System

- **Total Cards**: 30
- **Per Chapter**: 10 cards
- **Chapters**: 3
- **Features**: Flip, difficulty, progress

## 🚨 Troubleshooting

### Build Issues
```bash
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
```

### API Connection
- Check backend URL in `.env`
- Verify backend is running
- Check CORS settings

### Ollama Issues
- Ensure Ollama runs on port 11434
- Run: `ollama serve`

## 📞 Support

1. Check `DEPLOYMENT_GUIDE.md`
2. Review `HACKATHON_SUBMISSION.md`
3. Check Vercel dashboard logs
4. Test backend: `curl https://sikshaai-backend.vercel.app`

## ✅ Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend running on Vercel
- [ ] Environment variables set
- [ ] All features tested
- [ ] API connection working
- [ ] Quiz system functional
- [ ] Flashcards loading
- [ ] Progress tracking working

## 🎉 Ready to Submit!

Your hackathon submission is ready:
- **Frontend**: https://siksha-ai.vercel.app
- **Backend**: https://sikshaai-backend.vercel.app

Share these links with judges!
