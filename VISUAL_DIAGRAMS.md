# 🎨 Offline-First App - Visual Diagrams & Flows

## Data Flow Diagram

```
┌────────────────────────────────────────────────────┐
│                  STUDENT'S PHONE                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌─ CHAT SCREEN ─────────────────────────┐        │
│  │                                        │        │
│  │  Q: "What is photosynthesis?"        │        │
│  │      ↓                                │        │
│  │  ├─ Online? → Send to Gemini         │        │
│  │  └─ Offline? → Check cache           │        │
│  │      ↓                                │        │
│  │  A: "Photosynthesis is..."           │        │
│  │      ↓                                │        │
│  │  Store in messages table             │        │
│  │  Update progress table               │        │
│  │  Check achievements                  │        │
│  │      ↓                                │        │
│  │  Display in chat                     │        │
│  │                                        │        │
│  └────────────────────────────────────────┘        │
│           ↓ (for every message)                    │
│  ┌─ PROGRESS TABLE ───────────────────────┐        │
│  │                                        │        │
│  │  questionsAsked++                    │        │
│  │  timeSpent += seconds                │        │
│  │  subject = "science"                 │        │
│  │  lastAccessed = now()                │        │
│  │                                        │        │
│  └────────────────────────────────────────┘        │
│           ↓ (triggered by progress)                │
│  ┌─ DASHBOARD ────────────────────────────┐        │
│  │                                        │        │
│  │  Total: COUNT(messages)              │        │
│  │  Time: SUM(progress.timeSpent)       │        │
│  │  Streak: GET(current_streak)         │        │
│  │  Subjects: GROUP BY subject          │        │
│  │  ↓ RECALCULATE & DISPLAY             │        │
│  │  Shows instantly (no server!)        │        │
│  │                                        │        │
│  └────────────────────────────────────────┘        │
│           ↓ (every message triggers)               │
│  ┌─ ACHIEVEMENTS ─────────────────────────┐        │
│  │                                        │        │
│  │  Check conditions:                   │        │
│  │  ├─ count >= 25? → Unlock!           │        │
│  │  ├─ streak >= 7? → Unlock!           │        │
│  │  └─ subjects >= 3? → Unlock!         │        │
│  │  ↓ INSERT into achievements          │        │
│  │  QUEUE for sync                      │        │
│  │  Display badge                       │        │
│  │                                        │        │
│  └────────────────────────────────────────┘        │
│           ↓ (if online later)                      │
│  ┌─ SYNC QUEUE ───────────────────────────┐        │
│  │                                        │        │
│  │  When internet detected:              │        │
│  │  1. Upload all pending messages       │        │
│  │  2. Upload all progress updates       │        │
│  │  3. Upload achievements               │        │
│  │  4. Mark as synced (synced=1)         │        │
│  │  5. Download any new data             │        │
│  │  6. Show notification                 │        │
│  │                                        │        │
│  └────────────────────────────────────────┘        │
│           ↓ (sends to server)                      │
└────────────────────────────────────────────────────┘
             ↕ (via API)
     ┌──────────────────┐
     │  Backend Server  │
     │  (MongoDB)       │
     │                  │
     │  Stores backup   │
     │  Multi-device    │
     │  Analytics       │
     └──────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────┐
│  React Context/State (In Memory)            │
├─────────────────────────────────────────────┤
│                                             │
│  currentChat: Chat (current conversation)  │
│  allChats: Chat[] (all chats)              │
│  messages: Message[] (current chat msgs)   │
│  isOnline: boolean (connection state)      │
│  dashboardStats: Stats (calculated)        │
│  achievements: Achievement[] (unlocked)    │
│                                             │
└──────────────┬────────────────────────────┘
               ↓ (save on change)
┌──────────────────────────────────────────────┐
│  Expo SQLite (Persistent Storage)            │
├──────────────────────────────────────────────┤
│                                              │
│  TABLE: chats                               │
│  ├─ id, title, subject, createdAt          │
│  ├─ updatedAt, messageCount, synced        │
│  └─ Indexed by: id, userId, createdAt      │
│                                              │
│  TABLE: messages                            │
│  ├─ id, chatId, role, content              │
│  ├─ timestamp, modelUsed, tokens, synced   │
│  └─ Indexed by: chatId, timestamp          │
│                                              │
│  TABLE: progress                            │
│  ├─ userId, subject, questionsAsked        │
│  ├─ timeSpent, difficulty, synced          │
│  └─ Indexed by: userId, subject            │
│                                              │
│  TABLE: achievements                        │
│  ├─ id, userId, achievementType, synced    │
│  └─ Indexed by: userId, achievementType    │
│                                              │
│  TABLE: sync_queue                          │
│  ├─ id, table, operation, recordId         │
│  ├─ payload, createdAt, synced             │
│  └─ Indexed by: synced, createdAt          │
│                                              │
└────────────────────────────────────────────┘
```

---

## Offline-Online Sync Flow

```
┌────────────────────────────────────────────────────┐
│              Internet Connection Events            │
├────────────────────────────────────────────────────┤
│                                                    │
│  Event: App Launched                             │
│  ↓                                                 │
│  Check connection status                          │
│  ├─ Online → Load from server                    │
│  └─ Offline → Load from SQLite                   │
│  ↓                                                 │
│  Set isOnline state                              │
│  ↓                                                 │
│  Show connection badge                           │
│                                                    │
│  ────────────────────────────────────────────    │
│                                                    │
│  Event: Connection Lost                           │
│  ↓                                                 │
│  Set isOnline = false                            │
│  ↓                                                 │
│  Start queuing messages (sync_queue table)       │
│  ↓                                                 │
│  Show "OFFLINE" badge                            │
│  ↓                                                 │
│  User can still chat (uses cache)                │
│                                                    │
│  ────────────────────────────────────────────    │
│                                                    │
│  Event: Connection Restored                       │
│  ↓                                                 │
│  Set isOnline = true                             │
│  ↓                                                 │
│  BEGIN SYNC:                                      │
│  ├─ Read all unsynced records:                   │
│  │  SELECT * FROM sync_queue WHERE synced=0    │
│  │                                               │
│  ├─ For each pending change:                     │
│  │  POST /api/sync { table, operation, data }   │
│  │                                               │
│  ├─ Server response:                             │
│  │  ├─ Success → UPDATE sync_queue SET synced=1 │
│  │  └─ Conflict → Ask user which version        │
│  │                                               │
│  ├─ Download server updates:                     │
│  │  GET /api/latest { since: lastSyncTime }    │
│  │                                               │
│  ├─ Merge into local DB:                         │
│  │  UPDATE messages, progress, achievements     │
│  │                                               │
│  └─ Clean up sync_queue                          │
│     DELETE FROM sync_queue WHERE synced=1       │
│                                                    │
│  ↓                                                 │
│  Show "ONLINE" badge                             │
│  ↓                                                 │
│  Show notification "All synced!"                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Layout
│   ├── TabNavigator
│   │   ├── ChatTab
│   │   │   ├── ChatScreen (tutor.tsx)
│   │   │   │   ├── Header (with offline badge)
│   │   │   │   ├── MessageList
│   │   │   │   │   └── ChatBubble[] (with voice)
│   │   │   │   ├── InputArea
│   │   │   │   │   ├── TextInput
│   │   │   │   │   ├── VoiceButton
│   │   │   │   │   └── SendButton
│   │   │   │   └─── OfflineBanner (if offline)
│   │   │   │
│   │   │   └── Services
│   │   │       ├── ChatService (SQLite)
│   │   │       ├── SyncService (queue)
│   │   │       └── OfflineService (cache)
│   │   │
│   │   ├── DashboardTab
│   │   │   ├── DashboardScreen (NEW)
│   │   │   │   ├── StatsCard[] (Today, Week)
│   │   │   │   ├── ChartsSection (Charts.js)
│   │   │   │   ├── SubjectsBreakdown
│   │   │   │   ├── RecentChatsList
│   │   │   │   └── AchievementsList
│   │   │   │
│   │   │   └── Services
│   │   │       ├── DashboardService (calculate)
│   │   │       ├── ProgressService (track)
│   │   │       └── AchievementService (unlock)
│   │   │
│   │   └── SettingsTab
│   │       ├── SettingsScreen
│   │       │   ├── VoiceSettings
│   │       │   ├── OfflineSettings
│   │       │   ├── SyncSettings
│   │       │   └── GeneralSettings
│   │       │
│   │       └── Services
│   │           └── SettingsService (SQLite)
│   │
│   └── Services
│       ├── DatabaseService
│       │   └── SQLiteManager
│       ├── ConnectionService
│       │   └── InternetDetector
│       ├── SyncService
│       │   └── QueueManager
│       └── CacheService
│           └── ResponseCache
│
└── Config
    ├── Database Schema
    ├── Constants
    └── Types
```

---

## Database Query Flow

```
┌──────────────────────────────────────┐
│         User Asks Question           │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  INSERT INTO messages (...)          │
│  VALUES (chatId, "user", content)    │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  UPDATE progress SET                 │
│  questionsAsked = questionsAsked+1   │
│  WHERE userId = ? AND subject = ?    │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  INSERT INTO sync_queue (...)        │
│  Mark message as pending sync        │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│   SELECT COUNT(*) FROM messages      │ → Questions count
│   SELECT SUM(timeSpent) FROM progress│ → Time spent
│   SELECT * FROM achievements         │ → Badges
│   SELECT * FROM progress ...         │ → Stats
│   GROUP BY subject                   │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  React re-renders:                   │
│  ├─ Chat with new message            │
│  ├─ Dashboard with updated stats     │
│  └─ Achievements if unlocked         │
└──────────────────────────────────────┘
```

---

## Achievement Unlock Flow

```
Question Sent
    ↓
Update progress table
    ↓
┌─────────────────────────────────────────────┐
│  checkAchievements(userId)                  │
├─────────────────────────────────────────────┤
│                                             │
│  achievementRules = [                       │
│    {                                        │
│      id: "first_25",                       │
│      name: "Question Master",              │
│      condition: COUNT(messages) >= 25,     │
│      threshold: 25                         │
│    },                                       │
│    {                                        │
│      id: "seven_day",                      │
│      name: "Week Warrior",                 │
│      condition: streakDays >= 7,           │
│      threshold: 7                          │
│    },                                       │
│    ...                                     │
│  ]                                          │
│                                             │
│  for (rule in achievementRules) {          │
│    if (rule.condition) {                   │
│      SELECT * FROM achievements            │
│      WHERE userId=? AND id=?               │
│                                             │
│      if (NOT EXISTS) {                     │
│        INSERT INTO achievements {          │
│          userId, achievementType: rule.id, │
│          unlockedAt: now(),                │
│          synced: 0                         │
│        }                                    │
│                                             │
│        INSERT INTO sync_queue {            │
│          table: "achievements",            │
│          operation: "insert",              │
│          recordId: newAchId,               │
│          synced: 0                         │
│        }                                    │
│                                             │
│        showNotification("Unlocked!")       │
│      }                                      │
│    }                                        │
│  }                                          │
│                                             │
└─────────────────────────────────────────────┘
    ↓
Badge displayed in Dashboard
```

---

## Sync Conflict Resolution

```
┌────────────────────────────────────────┐
│    Sync Conflict Detected              │
│                                        │
│  Local: message = "Good morning"       │
│  Server: message = "Hello there"       │
│  Same ID, different content!           │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Compare timestamps:                   │
│  Local: 2026-01-09 10:30:00           │
│  Server: 2026-01-09 10:35:00 (newer)  │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Server version is newer:              │
│  ├─ Keep server version                │
│  ├─ Update local SQLite                │
│  ├─ Log conflict                       │
│  └─ Show notification                  │
└────────────────────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  UPDATE messages SET                   │
│  content = "Hello there"               │
│  WHERE id = "msg_123"                  │
└────────────────────────────────────────┘
```

---

## Performance Optimization

```
Optimization Strategy:

1. Database Indexing
   ├─ Index: messages.chatId
   ├─ Index: progress.userId
   ├─ Index: sync_queue.synced
   └─ Index: achievements.userId

2. Query Optimization
   ├─ Use LIMIT for lists
   ├─ Use WHERE for filtering
   ├─ Lazy load chat history
   └─ Batch updates

3. Memory Management
   ├─ Cache only recent 100 messages
   ├─ Lazy load dashboard charts
   ├─ Release old cache data
   └─ Monitor RAM usage

4. Battery Optimization
   ├─ Batch sync operations
   ├─ Avoid frequent queries
   ├─ Use background sync sparingly
   └─ Efficient database operations

5. Storage Optimization
   ├─ Compress old chats
   ├─ Archive old achievements
   ├─ Limit cached responses (1000)
   └─ Clean old sync_queue monthly
```

---

These diagrams show the complete data flow, state management, and system architecture for the offline-first app!
