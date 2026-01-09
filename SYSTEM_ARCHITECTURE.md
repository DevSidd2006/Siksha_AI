# 🎓 Siksha AI - Complete System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIKSHA AI - Student Learning Platform      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React Native)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Bottom Navigation Tabs                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  [💬]    [📊]    [📚]    [👤]    [⚙️]                    │   │
│  │ Tutor  Dashboard History Profile Settings              │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Screen Components & Screens                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  1. TUTOR SCREEN (💬)                                   │   │
│  │     ├─ Chat interface                                   │   │
│  │     ├─ Message bubbles                                  │   │
│  │     ├─ Voice input/output                               │   │
│  │     ├─ Mode indicator (Online/Offline)                  │   │
│  │     └─ Student context (Grade-based responses)          │   │
│  │                                                           │   │
│  │  2. DASHBOARD (📊)                                      │   │
│  │     ├─ Profile summary                                  │   │
│  │     ├─ Learning statistics                              │   │
│  │     ├─ Progress charts                                  │   │
│  │     ├─ Subject performance                              │   │
│  │     └─ Quick actions                                    │   │
│  │                                                           │   │
│  │  3. HISTORY (📚)                                        │   │
│  │     ├─ Chat list                                        │   │
│  │     ├─ Preview text                                     │   │
│  │     ├─ Timestamps                                       │   │
│  │     ├─ Modal view (full chat)                           │   │
│  │     └─ Delete functionality                             │   │
│  │                                                           │   │
│  │  4. PROFILE (👤) ★ NEW                                  │   │
│  │     ├─ Personal information                             │   │
│  │     ├─ Learning preferences                             │   │
│  │     ├─ Statistics & progress                            │   │
│  │     ├─ Achievement badges                               │   │
│  │     └─ Weekly goals                                     │   │
│  │                                                           │   │
│  │  5. SETTINGS (⚙️)                                       │   │
│  │     ├─ Language preferences                             │   │
│  │     ├─ Offline mode                                     │   │
│  │     ├─ Data privacy                                     │   │
│  │     ├─ About section                                    │   │
│  │     ├─ Support links                                    │   │
│  │     └─ Profile link                                     │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   LOCAL STORAGE (AsyncStorage)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Chat Store (@siksha_chat_history)          [chatStore] │     │
│  │                                                        │     │
│  │ - Current chat session                               │     │
│  │ - Chat history (up to 50 chats)                      │     │
│  │ - Message threading                                 │     │
│  │ - Timestamps                                         │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Profile Store (@siksha_student_profile)  [profileStore]│     │
│  │                                                        │     │
│  │ - Student profile data                               │     │
│  │ - Learning preferences                               │     │
│  │ - Statistics & progress                              │     │
│  │ - Achievement badges                                 │     │
│  │ - Weekly goals                                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Settings Store (@siksha_settings) [settingsStore]      │     │
│  │                                                        │     │
│  │ - Language preference                                │     │
│  │ - Offline mode toggle                                │     │
│  │ - User preferences                                   │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ API Endpoints (http://localhost:3000)                 │     │
│  │                                                        │     │
│  │ GET  /              ← Health check                    │     │
│  │ POST /tutor         ← Process questions               │     │
│  │      {                                                │     │
│  │        "question": string,                            │     │
│  │        "studentGrade": string                         │     │
│  │      }                                                │     │
│  │      Response: { answer, timestamp, model, source }  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ AI Models & Fallback Chain                             │     │
│  │                                                        │     │
│  │ Primary:   Ollama (llama3.2:latest)                  │     │
│  │ Fallback:  Google Gemini 2.5 Flash                   │     │
│  │ System Prompt: getSystemPrompt(studentGrade)         │     │
│  │   - Age-appropriate language                         │     │
│  │   - Break down topics                                │     │
│  │   - Use analogies & examples                         │     │
│  │   - Encourage curiosity                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ System Prompt Features                                │     │
│  │                                                        │     │
│  │ Input: studentGrade (e.g., "Class 5-9")              │     │
│  │ Output: Grade-level appropriate system prompt         │     │
│  │ Applied to: All AI responses                          │     │
│  │ Result: Age-appropriate, engaging answers             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       DATA FLOW - CHAT SESSION                   │
└──────────────────────────────────────────────────────────────────┘

Student Types Question
       ↓
   [Tutor Screen]
  (tutor.tsx)
       ↓
  Load Profile
  (getProfile) ──────────────────┐
       ↓                          │
  Extract StudentGrade           │
  from Profile                   │
       ↓                          │
  Call sendQuestion()            │
  (api.ts)                       │
       ↓                          │
  POST to /tutor endpoint        │
  with {question, grade}         │
       ↓                          │
┌──────────────────────────────────┴──────────────┐
│          BACKEND (server.js)                     │
│                                                  │
│  Check Ollama availability                      │
│           ↓                                      │
│  YES → Use Ollama                               │
│           │                                      │
│           ├─ Apply getSystemPrompt(grade)       │
│           │                                      │
│           └─ Generate response                   │
│                                                  │
│  NO → Use Gemini API                            │
│           │                                      │
│           ├─ Apply getSystemPrompt(grade)       │
│           │                                      │
│           └─ Generate response                   │
│                                                  │
│  Return response with timestamp                 │
└──────────────────────────────────────────────────┘
       ↓
  Display response
  in ChatBubble
  (ChatBubble.tsx)
       ↓
  Save chat to history
  (saveChat from chatStore)
       ↓
  Update statistics
  (updateChatStatistics) ────────┐
       ↓                          │
  Check for badges               │
  (addBadge)                     │
       ↓                          │
  Update profile
  (updateProfile) ◄──────────────┤
       ↓                          │
  Statistics Saved               │
  (profileStore)                 │
       ↓                          │
  Show stats on Profile Tab ◄────┘


┌──────────────────────────────────────────────────────────────────┐
│                    DATA FLOW - PROFILE VIEW                      │
└──────────────────────────────────────────────────────────────────┘

User Taps Profile Tab (👤)
       ↓
  Navigate to profile.tsx
       ↓
  useFocusEffect triggers
       ↓
  loadProfile() ─────────────┐
       ↓                      │
  getProfile() ◄─────────────┤
       ↓                      │
  Load from AsyncStorage      │
  (@siksha_student_profile)   │
       ↓                      │
  Deserialize dates           │
       ↓                      │
  Return ProfileData          │
       ↓                      │
  Display on screen ◄─────────┘
  - Name
  - Grade
  - Subjects
  - Learning Style
  - Weekly Goal
  - Statistics
  - Badges


┌──────────────────────────────────────────────────────────────────┐
│                   DATA FLOW - PROFILE EDITING                    │
└──────────────────────────────────────────────────────────────────┘

User Clicks Edit Icon (✏️)
       ↓
  Component enters edit mode
       ↓
  Show input field / selector
       ↓
  User makes changes
       ↓
  User clicks [Save]
       ↓
  Validate input
       ↓
  Call updateProfile()
       ↓
  Serialize data
       ↓
  Save to AsyncStorage
       ↓
  Update component state
       ↓
  Exit edit mode
       ↓
  Display updated value
```

## Component Hierarchy

```
App
├── (tabs) Layout
│   ├── Tutor Screen (💬)
│   │   ├── ChatBubble (message display)
│   │   ├── Input area
│   │   ├── Voice controls
│   │   └── Mode badge
│   │
│   ├── Dashboard (📊)
│   │   ├── Profile summary card
│   │   ├── Statistics section
│   │   ├── Charts
│   │   └── Achievement display
│   │
│   ├── History (📚)
│   │   ├── Chat list
│   │   ├── Chat modal
│   │   └── Delete controls
│   │
│   ├── Profile (👤) ★ NEW
│   │   ├── Header section
│   │   ├── Quick stats
│   │   ├── Grade editor
│   │   ├── Subjects selector
│   │   ├── Learning style picker
│   │   ├── Goal setter
│   │   ├── Badge display
│   │   └── Info section
│   │
│   └── Settings (⚙️)
│       ├── Language section
│       ├── Offline toggle
│       ├── Privacy controls
│       ├── About section
│       ├── Support section
│       └── Profile link
│
└── Services
    ├── API service (api.ts)
    ├── Speech service (speechToText.ts)
    ├── Offline tutor (offlineTutor.ts)
    └── Chat Bridge (nativeLlama.ts)

Local Storage
├── Chat history
├── Profile data ★ NEW
└── Settings
```

## Feature Integration Points

```
PROFILE ↔ OTHER FEATURES

Profile ──────────────┐
(🧠 Learning Prefs)  │
                      ├──→ Tutor (📊 AI Responses)
                      │     Grade-appropriate responses
                      │     Learning style customization
                      │
Profile ──────────────┤
(📈 Statistics)      ├──→ Dashboard (📊 Progress)
                      │     Show learning stats
                      │     Display badges
                      │     Track goals
                      │
Profile ──────────────┤
(🏅 Achievements)    ├──→ Chat History (📚)
                      │     Show badges earned
                      │     Display milestones
                      │
Profile ──────────────┤
(📋 Settings)        ├──→ Settings (⚙️)
                      │     Link to edit profile
                      │     Reset options
                      │
Profile ──────────────┤
(⏱️ Time Tracking)   ├──→ All Features
                      │     Track usage
                      │     Build streaks
                      │     Award badges
```

## Technology Stack

```
Frontend
├── React Native (UI Framework)
├── Expo (Development & Deployment)
├── Expo Router (Navigation)
├── TypeScript (Type Safety)
├── AsyncStorage (Local Data)
└── React Hooks (State Management)

Backend
├── Node.js (Runtime)
├── Express.js (Web Framework)
├── Axios (HTTP Client)
├── CORS (Cross-origin requests)
└── dotenv (Config management)

AI Models
├── Ollama (Primary: llama3.2)
└── Google Gemini (Fallback)

Platforms
├── Web (Chrome, Firefox, Safari)
├── Android (via Emulator/Device)
└── iOS (via Simulator/Device)
```

## Profile Data Structure

```
StudentProfile
├── id (string)
├── name (string)
├── grade (string)
├── age (number)
├── school (string, optional)
├── email (string, optional)
├── favoriteSubjects (string[])
├── learningStyle (enum)
├── weeklyGoal (number)
├── avatar (string)
├── joinDate (Date)
├── bio (string, optional)
├── badges (string[])
└── statistics
    ├── totalChatsCompleted (number)
    ├── totalTimeSpent (number)
    ├── averageSessionLength (number)
    ├── longestStreak (number)
    ├── currentStreak (number)
    └── lastActiveDate (Date)
```

## API Response Flow

```
Client Request
│
├─ Question: "What is photosynthesis?"
├─ StudentGrade: "Class 7"
│
↓
Backend Processing
│
├─ Load getSystemPrompt("Class 7")
├─ Try Ollama
│  ├─ Success → Use Ollama response
│  └─ Fail → Try Gemini
├─ Generate response with system prompt
├─ Add timestamp
├─ Include model info
│
↓
Client Response
│
├─ answer: "Photosynthesis is the..."
├─ timestamp: "2024-01-09T14:30:00Z"
├─ model: "llama3.2" or "gemini-2.5"
└─ source: "ollama" or "gemini"
│
↓
Frontend Processing
│
├─ Display in ChatBubble
├─ Save to chat history
├─ Update profile statistics
├─ Check for badges
└─ Update display
```

## File Organization

```
Siksha_AI/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           (Navigation with Profile tab)
│   │   ├── tutor.tsx             (Chat interface)
│   │   ├── dashboard.tsx         (Progress tracking)
│   │   ├── history.tsx           (Chat history)
│   │   ├── profile.tsx           (NEW - Student profile)
│   │   └── settings.tsx          (App settings)
│   ├── index.tsx                 (App entry)
│   └── _layout.tsx               (Root layout)
│
├── src/
│   ├── components/
│   │   └── ChatBubble.tsx        (Message display)
│   ├── services/
│   │   ├── api.ts                (Backend communication)
│   │   ├── speechToText.ts       (Voice I/O)
│   │   ├── offlineTutor.ts       (Offline responses)
│   │   └── nativeLlama.ts        (Local LLM)
│   └── storage/
│       ├── chatStore.ts          (Chat persistence)
│       ├── profileStore.ts       (NEW - Profile management)
│       └── settingsStore.ts      (Settings)
│
├── backend/
│   └── server.js                 (Express API)
│
└── docs/
    ├── PROFILE_GUIDE.md          (Complete guide)
    ├── PROFILE_INTEGRATION.md    (Integration steps)
    ├── PROFILE_QUICK_REFERENCE.md (Visual reference)
    ├── PROFILE_QUICK_START.md    (Getting started)
    └── COMPLETE_STATUS.md        (Project status)
```

---

## Summary

The complete **Siksha AI** system consists of:

1. **Frontend** - 5 main screens (Tutor, Dashboard, History, Profile, Settings)
2. **Local Storage** - 3 data stores (Chat, Profile, Settings)
3. **Backend** - API server with Ollama + Gemini integration
4. **Profile System** - Complete student profile management (NEW)

All components work together seamlessly to provide a comprehensive learning experience! 🎓✨

**Status**: ✅ **COMPLETE & READY FOR USE**
