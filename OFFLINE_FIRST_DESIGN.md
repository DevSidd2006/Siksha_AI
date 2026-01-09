# 📱 Offline-First App Architecture with Student Dashboard

## 🎯 Core Requirement

**Full offline functionality with all features + Student dashboard**

This changes the architecture significantly. You need:
- ✅ All features work without internet
- ✅ Student dashboard (progress, analytics)
- ✅ Seamless sync when online
- ✅ Local-first data design
- ✅ Rich offline experience

---

## 🏗️ Offline-First Architecture

### System Overview

```
┌──────────────────────────────────────────────┐
│           STUDENT'S PHONE                    │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │      EXPO REACT NATIVE APP             │ │
│  ├────────────────────────────────────────┤ │
│  │                                        │ │
│  │  ┌──────────┐  ┌──────────┐           │ │
│  │  │ Dashboard│  │ Chat     │           │ │
│  │  │ (local)  │  │ (offline)│           │ │
│  │  ├──────────┤  ├──────────┤           │ │
│  │  │ History  │  │ Settings │           │ │
│  │  │ (local)  │  │          │           │ │
│  │  └──────────┘  └──────────┘           │ │
│  │         ↓                              │ │
│  │  ┌──────────────────────────────┐    │ │
│  │  │   Offline Data Engine        │    │ │
│  │  │  ┌────────────────────────┐  │    │ │
│  │  │  │ Expo SQLite (local DB) │  │    │ │
│  │  │  │ ┌──────────────────┐   │  │    │ │
│  │  │  │ │ chats table      │   │  │    │ │
│  │  │  │ │ messages table   │   │  │    │ │
│  │  │  │ │ progress table   │   │  │    │ │
│  │  │  │ │ sync_queue table │   │  │    │ │
│  │  │  │ │ settings table   │   │  │    │ │
│  │  │  │ └──────────────────┘   │  │    │ │
│  │  │  └────────────────────────┘  │    │ │
│  │  │                              │    │ │
│  │  │  Local LLM (Ollama/llama.rn) │    │ │
│  │  │  OR Cached responses         │    │ │
│  │  └──────────────────────────────┘    │ │
│  │         ↓                              │ │
│  │  ┌──────────────────────────────┐    │ │
│  │  │   Sync Manager               │    │ │
│  │  │  (detects internet, queues)  │    │ │
│  │  └──────────────────────────────┘    │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                   ↕ [SYNC ONLY]             │
└───────────────────┬──────────────────────────┘
                    │ (When online)
         ┌──────────▼──────────┐
         │  Backend Server     │
         │  (Express)          │
         ├─────────────────────┤
         │ • User accounts     │
         │ • Data sync         │
         │ • Ollama API        │
         │ • MongoDB (backup)  │
         │ • Analytics         │
         └─────────────────────┘
```

---

## 📊 Student Dashboard (Offline-First)

### Dashboard Data (Stored Locally)

```typescript
interface StudentDashboard {
  // Learning metrics
  totalChats: number;              // Total conversations
  questionsAsked: number;          // Questions count
  topicsLearned: string[];         // Topics covered
  averageResponseTime: number;     // ms
  
  // Progress tracking
  learningStreak: number;          // Days active
  sessionsCompleted: number;
  averageSessionDuration: number;  // minutes
  
  // Subject performance
  subjectPerformance: {
    [subject: string]: {
      questionsAsked: number;
      timeSpent: number;
      difficulty: "easy" | "medium" | "hard";
      lastAccessed: Date;
    }
  };
  
  // Recent activity
  recentChats: {
    id: string;
    topic: string;
    messageCount: number;
    lastUpdated: Date;
  }[];
  
  // Achievements
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
  }[];
}
```

### Dashboard Features

1. **Learning Overview**
   - Total questions asked
   - Topics learned
   - Study streak
   - Time spent learning

2. **Subject Breakdown**
   - Math: 45 questions, 5 hours
   - Science: 30 questions, 3 hours
   - History: 20 questions, 2 hours

3. **Recent Chats**
   - Quick access to past conversations
   - Search by topic
   - Favorite/save important chats

4. **Achievements**
   - 5 questions in one session
   - 7-day learning streak
   - All subjects explored
   - 100 questions milestone

5. **Time Analytics**
   - Peak learning hours
   - Weekly learning graph
   - Daily login calendar

---

## 💾 Database Schema (Expo SQLite)

### Local Database Tables

```sql
-- Users and sessions
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastSyncAt DATETIME,
  syncPending INTEGER DEFAULT 0
);

-- Chat sessions
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT,
  subject TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  messageCount INTEGER DEFAULT 0,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Messages in chats
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chatId TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  modelUsed TEXT, -- 'ollama', 'gemini', 'cached'
  tokens INTEGER,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY(chatId) REFERENCES chats(id)
);

-- Student progress tracking
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  subject TEXT,
  questionsAsked INTEGER DEFAULT 0,
  timeSpent INTEGER DEFAULT 0, -- seconds
  difficulty TEXT,
  lastAccessed DATETIME,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Achievements
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  achievementType TEXT,
  unlockedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Sync queue (pending changes)
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  table TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'insert', 'update', 'delete'
  recordId TEXT NOT NULL,
  payload TEXT, -- JSON
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced INTEGER DEFAULT 0
);

-- Settings
CREATE TABLE settings (
  userId TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  autoSync INTEGER DEFAULT 1,
  offlineMode INTEGER DEFAULT 1,
  notificationsEnabled INTEGER DEFAULT 1,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Cached responses (for offline)
CREATE TABLE cached_responses (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  subject TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  hits INTEGER DEFAULT 0
);
```

---

## 🔄 Offline-First Data Flow

### User Asks Question (Offline)

```
1. User types question in Chat
   ↓
2. App checks internet connection
   ├─ Online: Send to server/Ollama immediately
   └─ Offline: Use local LLM or cached responses
   ↓
3. Store locally in SQLite
   ├─ messages table
   ├─ progress table
   └─ sync_queue table (mark as pending)
   ↓
4. Display response immediately
   ↓
5. When online → sync to server
   ├─ Dequeue sync_queue
   ├─ Upload to server
   ├─ Mark as synced
   └─ Get any server updates
```

### Dashboard Updates (Real-Time, Offline)

```
Every message → Update progress
   ├─ questionsAsked++
   ├─ timeSpent += duration
   ├─ Update subject stats
   └─ Check achievements

Every question → Update dashboard
   ├─ Calculate learning streak
   ├─ Update charts locally
   ├─ Show instant feedback
   └─ Queue for server sync
```

---

## 🛠️ Tech Stack for Offline-First App

### Frontend (No change)
```json
{
  "expo": "~54.0.0",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "expo-router": "~6.0.21",
  "expo-sqlite": "^14.0.0",        // ✨ Local database
  "expo-speech": "^12.0.0",         // Already added
  "expo-camera": "^15.0.0",         // Photo capture
  "react-native-chart-kit": "^6.12" // Offline charts
}
```

### Backend (For sync & cloud features)
```json
{
  "express": "^4.18.0",
  "mongodb": "^6.0.0",              // Sync data storage
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",             // Password hashing
  "jsonwebtoken": "^9.0.0",         // Auth tokens
  "dotenv": "^16.0.0"
}
```

### Offline AI Options
```typescript
// Option 1: Local Ollama (server-based)
// - Works on home WiFi
// - Better responses
// - Requires setup
// - Sync when online

// Option 2: llama.rn (device-based)
// - Full offline
// - Works on high-end phones only
// - Limited model size
// - No sync needed

// Option 3: Cached Responses + Gemini Fallback
// - Works offline with common questions
// - Uses Gemini when online
// - Best for all devices
// - Cheapest option

// Recommendation: Option 3 for MVP, add Option 1 in Phase 2
```

---

## 📱 UI/UX for Offline Experience

### Chat Screen (Offline-Aware)

```
┌─────────────────────────────────┐
│ [Tutor] 📱 OFFLINE              │  ← Status badge
├─────────────────────────────────┤
│                                 │
│ You: "What is photosynthesis?"  │
│ [16:23]                         │
│                                 │
│ AI: "Photosynthesis is the...   │
│       [FROM CACHE]              │  ← Source indicator
│ [16:24] ✅                      │  ← Sync status
│                                 │
├─────────────────────────────────┤
│ "You're offline. Messages will  │  ← Offline banner
│  sync when internet returns"    │
├─────────────────────────────────┤
│ [Text input field]  [SEND]      │
└─────────────────────────────────┘
```

### Dashboard Screen (Offline-Ready)

```
┌─────────────────────────────────┐
│ Student Dashboard               │
├─────────────────────────────────┤
│                                 │
│ Today's Learning                │
│ ├─ 5 questions asked            │
│ ├─ 45 minutes studied           │
│ └─ 2 topics learned             │
│                                 │
│ [📊 Chart showing weekly data]  │  ← SQLite-backed
│                                 │
│ This Week                       │
│ ├─ Questions: 23                │
│ ├─ Time: 4 hours                │
│ └─ Streak: 5 days 🔥            │
│                                 │
│ Top Subjects                    │
│ ├─ Math: 12 questions           │
│ ├─ Science: 8 questions         │
│ └─ English: 3 questions         │
│                                 │
│ Recent Chats                    │
│ ├─ Algebra basics (yesterday)   │
│ ├─ DNA structure (2 days ago)   │
│ └─ Shakespeare (4 days ago)     │
│                                 │
│ [🏆 ACHIEVEMENTS]               │
│ ├─ 7-day Streak 🔥              │
│ ├─ 25 Questions 📚              │
│ └─ All Subjects 🌟              │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Sync Strategy

### When Should Sync Happen?

```
Automatic Sync:
├─ When internet comes back online
├─ Every 5 minutes (if online)
├─ Before closing app (if online)
└─ On app launch (check for updates)

Manual Sync:
├─ User taps "Sync" button
├─ User taps cloud icon
└─ Settings → Force sync

Conflict Resolution:
├─ Server version wins (but keep local)
├─ Show notification if conflict
├─ User can choose which version
└─ Log all conflicts for debugging
```

### Sync Queue Example

```typescript
// LocalDB sync_queue table:
[
  {
    id: "sync_1",
    table: "messages",
    operation: "insert",
    recordId: "msg_123",
    payload: {
      chatId: "chat_1",
      role: "user",
      content: "What is AI?",
      timestamp: "2026-01-09T10:30:00Z"
    },
    createdAt: "2026-01-09T10:30:00Z",
    synced: 0
  },
  {
    id: "sync_2",
    table: "progress",
    operation: "update",
    recordId: "prog_1",
    payload: {
      questionsAsked: 45,
      timeSpent: 3600
    },
    createdAt: "2026-01-09T10:31:00Z",
    synced: 0
  }
]

// When online:
1. Loop through all unsynced records
2. POST each to server (/api/sync)
3. Server validates & stores
4. Server responds with latest data
5. Mark as synced: sync.synced = 1
6. Update local data with server versions
```

---

## 📈 Dashboard Analytics (Computed Offline)

### Real-time Calculations

```typescript
// All calculated from local SQLite - NO server needed

const calculateDashboard = async (userId) => {
  // Total questions
  const totalQuestions = await db.query(
    `SELECT COUNT(*) as count FROM messages 
     WHERE chatId IN (SELECT id FROM chats WHERE userId = ?)`, 
    [userId]
  );

  // Time spent (sum from progress table)
  const timeSpent = await db.query(
    `SELECT SUM(timeSpent) as total FROM progress WHERE userId = ?`,
    [userId]
  );

  // Learning streak
  const streak = calculateStreak(userId);

  // Subject performance
  const subjects = await db.query(
    `SELECT subject, COUNT(*) as count, SUM(timeSpent) as time 
     FROM progress WHERE userId = ? GROUP BY subject`,
    [userId]
  );

  // Recent chats
  const recentChats = await db.query(
    `SELECT id, title, subject, COUNT(*) as messageCount, 
            MAX(updatedAt) as lastUpdated 
     FROM chats WHERE userId = ? 
     GROUP BY id ORDER BY updatedAt DESC LIMIT 10`,
    [userId]
  );

  // Achievements
  const achievements = checkAchievements(userId, totalQuestions, streak);

  return {
    totalQuestions,
    timeSpent,
    streak,
    subjects,
    recentChats,
    achievements
  };
};
```

---

## 🔐 Security (Offline-Safe)

### Local Data Protection

```typescript
// Encrypt sensitive data in SQLite
interface SecureStorage {
  userId: string;              // Encrypted
  chatMessages: string;        // Encrypted
  personalInfo: string;        // Encrypted
  settings: object;            // Plain (non-sensitive)
}

// Use expo-secure-store for sensitive data
import * as SecureStore from 'expo-secure-store';

// Store user token (not in SQLite)
await SecureStore.setItemAsync('authToken', token);

// Encrypt sensitive SQLite data
import crypto from 'react-native-crypto';
const encryptedMessage = crypto.encrypt(message, userKey);

// Never store passwords
// Use JWT tokens that expire
```

---

## 📋 Implementation Priority

### Phase 1: Offline Chat + Basic Dashboard (Week 1-2)
```
✅ Expo SQLite setup
✅ Chat storage (messages table)
✅ Basic dashboard (question count, time)
✅ Local response caching
✅ Offline detection UI
```

### Phase 2: Full Dashboard + Sync (Week 3-4)
```
✅ Progress tracking (all tables)
✅ Dashboard analytics
✅ Achievements system
✅ Sync queue implementation
✅ Server sync endpoint
```

### Phase 3: Advanced Offline (Week 5-6)
```
✅ Ollama on home server
✅ Better offline AI responses
✅ Sync optimization
✅ Conflict resolution
✅ Data backup
```

### Phase 4: Production Ready (Week 7-8)
```
✅ Cloud deployment
✅ Multi-device sync
✅ Advanced analytics
✅ Testing on real devices
✅ Performance optimization
```

---

## 🚀 Recommended App-Only Stack (Revised for Offline)

### Phase 1 (NOW - v0)
```
Frontend: Expo + React Native + TypeScript
Database: Expo SQLite (local)
AI: Gemini API (when online) + Cache (offline)
Voice: expo-speech ✅
Storage: AsyncStorage (simple)
Features: Chat, basic dashboard, offline mode
Devices: 95%+ market

Ship this week!
```

### Phase 2 (Month 3-4)
```
Frontend: Expo + React Native (same)
Database: Expo SQLite with sync queue
AI: Local Ollama (home server) + Gemini fallback
Voice: Same (already working)
Storage: SQLite + Sync to server
Features: Full dashboard, achievements, analytics
Devices: 98%+ market

Add when users want offline + better analytics
```

### Phase 3+ (Month 5-6+)
```
Frontend: Expo + React Native (same)
Backend: Express + MongoDB
Database: Expo SQLite + MongoDB (sync)
AI: Cloud Ollama + ChromaDB search
Voice: Same
Features: Multi-device sync, advanced analytics
Devices: 98%+ market

Deploy to production
```

---

## 📊 Offline-First App Tech Stack Summary

```typescript
const offlineFirstStack = {
  frontend: {
    framework: "Expo + React Native",
    language: "TypeScript",
    routing: "Expo Router",
    state: "React Context/Zustand (local)",
    storage: "Expo SQLite + AsyncStorage",
    ui: "React Native components + Tailwind-native"
  },
  
  offline: {
    database: "Expo SQLite (local queries)",
    cache: "In-memory + disk cache",
    ai: "Cached responses + Ollama (Phase 2)",
    sync: "Sync queue + diff-based updates"
  },
  
  backend: {
    framework: "Express + Node.js",
    database: "MongoDB (sync storage)",
    api: "REST + WebSockets",
    auth: "JWT tokens"
  },
  
  features: {
    chat: "Offline messaging ✅",
    dashboard: "Offline analytics ✅",
    voice: "expo-speech ✅",
    sync: "Automatic + manual",
    achievements: "Local tracking ✅"
  },
  
  deployment: {
    mobile: "Expo",
    backend: "AWS/GCP/DigitalOcean",
    database: "MongoDB Atlas / Local MongoDB"
  }
};
```

---

## ✅ Offline Feature Checklist

### Chat Features (Offline-Ready)
- ✅ Type messages
- ✅ See chat history
- ✅ Voice input (already working)
- ✅ Voice output (already working)
- ✅ Send messages (queued for sync)
- ✅ Cache responses
- ✅ Search messages

### Dashboard Features (Offline-Ready)
- ✅ View total questions
- ✅ Track time spent
- ✅ See learning streak
- ✅ Subject breakdown
- ✅ Recent chats list
- ✅ View achievements
- ✅ Weekly/monthly charts
- ✅ All calculated locally

### Settings (Offline-Ready)
- ✅ Language selection
- ✅ Theme preference
- ✅ Audio settings
- ✅ Offline mode toggle
- ✅ Auto-sync toggle

### Sync Features (When Online)
- ✅ Auto-sync queued messages
- ✅ Pull server updates
- ✅ Resolve conflicts
- ✅ Backup to server
- ✅ Multi-device sync (Phase 3)

---

## 🎯 Bottom Line

For an **offline-first app with student dashboard**:

1. **Ship v0 NOW** ✅
   - Expo + SQLite
   - Chat + basic dashboard
   - Offline mode (cache + Gemini fallback)
   - Voice (already done)

2. **Month 3-4: Phase 2** 
   - Full dashboard with all analytics
   - Achievements system
   - Ollama on home server
   - Sync queue implementation

3. **Month 5-6: Phase 3**
   - Cloud deployment
   - Multi-device sync
   - Advanced features

**All features work offline from day 1!**

Ready to implement? 🚀
