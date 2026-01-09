# ✅ Offline-First Implementation Checklist

## 🎯 Project: Offline-First Student App with Dashboard

### PHASE 1: MVP (Weeks 1-2)

#### Setup & Database
- [ ] Install `expo-sqlite` package
- [ ] Create database schema
  - [ ] chats table
  - [ ] messages table
  - [ ] progress table
  - [ ] achievements table
  - [ ] sync_queue table
  - [ ] settings table
  - [ ] cached_responses table
- [ ] Create database initialization function
- [ ] Test database creation on real device

#### Dashboard Screen (New)
- [ ] Create `app/(tabs)/dashboard.tsx`
- [ ] Show today's stats
  - [ ] Questions asked (count from messages)
  - [ ] Time spent (sum from progress)
  - [ ] Topics learned (distinct subjects)
- [ ] Show weekly stats
  - [ ] Total questions (weekly)
  - [ ] Total time (weekly)
  - [ ] Learning streak (consecutive days)
- [ ] Add basic chart
  - [ ] Daily questions chart
  - [ ] Weekly time chart
- [ ] Add recent chats list
  - [ ] Show last 10 chats
  - [ ] Quick access to each chat
- [ ] Style with consistent UI

#### Chat Updates
- [ ] Modify `app/(tabs)/tutor.tsx`
  - [ ] Save messages to SQLite (instead of AsyncStorage)
  - [ ] Load chat history from SQLite
  - [ ] Update progress table on each message
  - [ ] Add offline detection indicator
  - [ ] Show sync status badge
- [ ] Update API calls
  - [ ] Queue messages if offline
  - [ ] Send when online
  - [ ] Show "synced" indicator

#### Progress Tracking
- [ ] Create progress service
  - [ ] Track questions per subject
  - [ ] Track time spent
  - [ ] Calculate learning streak
  - [ ] Store all in SQLite
- [ ] Update on each chat
  - [ ] Increment question count
  - [ ] Add time spent
  - [ ] Update subject stats
  - [ ] Mark for sync

#### Achievement System
- [ ] Define achievements
  - [ ] 7-day streak
  - [ ] 25 questions milestone
  - [ ] 50 questions milestone
  - [ ] All subjects explored
  - [ ] 100+ questions
  - [ ] etc.
- [ ] Create achievement checker
  - [ ] Check on each progress update
  - [ ] Unlock achievements
  - [ ] Show notifications
  - [ ] Store in achievements table
- [ ] Display achievements
  - [ ] Show in dashboard
  - [ ] Show locked badges
  - [ ] Show unlock dates

#### Offline Detection
- [ ] Add internet connection checking
  - [ ] Use `expo-network`
  - [ ] Check on app launch
  - [ ] Listen for connection changes
  - [ ] Store connection state
- [ ] Update UI
  - [ ] Show "OFFLINE" badge
  - [ ] Show "ONLINE" badge
  - [ ] Update app header
  - [ ] Disable online-only features
- [ ] Handle offline messages
  - [ ] Show helpful offline message
  - [ ] Explain sync will happen
  - [ ] Show last sync time

#### Settings Tab Update
- [ ] Migrate to SQLite
  - [ ] Load settings from database
  - [ ] Save changes to database
- [ ] Add offline-related settings
  - [ ] Auto-sync toggle
  - [ ] Offline mode toggle
  - [ ] Cache size setting
  - [ ] Last sync time display

#### Testing
- [ ] Test on physical device (offline mode)
  - [ ] Turn off WiFi & mobile data
  - [ ] Chat works offline
  - [ ] Dashboard shows stats
  - [ ] Achievement unlocks work
- [ ] Test sync
  - [ ] Turn on internet
  - [ ] Messages sync
  - [ ] Progress syncs
  - [ ] Clear sync status
- [ ] Test edge cases
  - [ ] Long offline duration
  - [ ] Conflicting edits
  - [ ] Large chat history
  - [ ] App restart

#### Documentation
- [ ] Update README with offline features
- [ ] Document database schema
- [ ] Create sync strategy docs
- [ ] Add troubleshooting section

---

### PHASE 2: Enhanced Offline (Weeks 3-4)

#### Local Ollama Integration
- [ ] Research llama.rn options
- [ ] Setup local Ollama server
  - [ ] Install Ollama
  - [ ] Download DeepSeek-R1 1.5B
  - [ ] Test locally
  - [ ] Document setup
- [ ] Create Ollama service
  - [ ] Connect to Ollama API
  - [ ] Handle timeouts
  - [ ] Cache responses
  - [ ] Fallback to Gemini
- [ ] Integrate in chat
  - [ ] Detect if Ollama available
  - [ ] Use Ollama when available
  - [ ] Fallback to Gemini
  - [ ] Show which model used

#### Advanced Analytics
- [ ] Dashboard enhancements
  - [ ] Subject performance breakdown
  - [ ] Time distribution charts
  - [ ] Question difficulty tracking
  - [ ] Monthly statistics
  - [ ] Growth trends
- [ ] Add more achievements
  - [ ] Subject mastery (10 Q per subject)
  - [ ] Time milestones
  - [ ] Consistency rewards
  - [ ] etc.

#### Sync Queue Implementation
- [ ] Create sync manager
  - [ ] Monitor sync_queue table
  - [ ] Track pending changes
  - [ ] Retry failed syncs
  - [ ] Handle conflicts
- [ ] Add sync UI
  - [ ] Show sync progress
  - [ ] Show sync history
  - [ ] Manual sync button
  - [ ] Retry failed syncs

#### OCR Support (Optional)
- [ ] Integrate Tesseract.js
- [ ] Add image capture
  - [ ] Take homework photo
  - [ ] Extract text with OCR
  - [ ] Send for analysis
  - [ ] Cache results
- [ ] Add to chat
  - [ ] Image button in input
  - [ ] Show extracted text
  - [ ] Get AI analysis

#### Performance Optimization
- [ ] Database indexing
  - [ ] Index frequently queried columns
  - [ ] Optimize queries
  - [ ] Test query performance
- [ ] App performance
  - [ ] Lazy load dashboard
  - [ ] Cache calculations
  - [ ] Optimize renders
  - [ ] Monitor memory

#### Testing (Phase 2)
- [ ] Test Ollama integration
  - [ ] Works when Ollama online
  - [ ] Fallback when offline
  - [ ] Caches responses
- [ ] Test sync system
  - [ ] Queue tracking works
  - [ ] Retry mechanism works
  - [ ] Conflicts resolved
- [ ] Test performance
  - [ ] Large chat histories
  - [ ] Many achievements
  - [ ] Complex calculations
  - [ ] Device with low RAM

---

### PHASE 3: Production Ready (Weeks 5-6)

#### Backend Deployment
- [ ] Setup Express backend
  - [ ] User authentication
  - [ ] Data sync endpoint
  - [ ] Ollama proxy (optional)
  - [ ] Analytics endpoint
- [ ] Setup MongoDB
  - [ ] Schema for synced data
  - [ ] Indexes
  - [ ] Backup strategy
- [ ] Deploy to cloud
  - [ ] Choose platform (AWS/GCP/DigitalOcean)
  - [ ] Setup database
  - [ ] Deploy backend
  - [ ] Setup SSL/HTTPS

#### Multi-Device Sync
- [ ] User accounts
  - [ ] Login/signup
  - [ ] Device registration
  - [ ] Session management
- [ ] Cross-device sync
  - [ ] Sync data across devices
  - [ ] Handle conflicts
  - [ ] Show sync status
  - [ ] Test on multiple devices

#### Advanced Features
- [ ] Language support (NLLB-200)
  - [ ] Language selector
  - [ ] Translate input/output
  - [ ] Support 200+ languages
- [ ] Better analytics
  - [ ] Learning patterns
  - [ ] Recommendation system
  - [ ] Weekly reports
  - [ ] Email digests

#### Scale Testing
- [ ] Load testing
  - [ ] Simulate 100s of users
  - [ ] Test sync under load
  - [ ] Database performance
- [ ] Real device testing
  - [ ] iOS devices
  - [ ] Android devices
  - [ ] Different network conditions
  - [ ] Battery impact

#### Documentation & Deployment
- [ ] Complete documentation
- [ ] User guide
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] API documentation

#### Production Release
- [ ] Final QA testing
- [ ] Submit to app stores
  - [ ] TestFlight (iOS)
  - [ ] Google Play (Android)
- [ ] Marketing materials
- [ ] Beta user onboarding
- [ ] Production deployment

---

## 📦 Dependency Checklist

### Required (Phase 1)
- [ ] `expo-sqlite` - Local database
- [ ] `expo-network` - Connection detection
- [ ] `expo-speech` - Voice (already installed)
- [ ] `react-native-chart-kit` - Charts

### Optional (Phase 2)
- [ ] `node-ollama` - Ollama client (if self-hosted)
- [ ] `tesseract.js` - OCR (if image analysis)

### Optional (Phase 3)
- [ ] `mongodb` - Backend database
- [ ] `express` - Backend framework
- [ ] `jsonwebtoken` - Authentication

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- [ ] App works fully offline
- [ ] Dashboard displays correct stats
- [ ] All progress tracked locally
- [ ] Achievements unlock
- [ ] Sync queue works
- [ ] Works on 2+ real devices
- [ ] No crashes in 30-minute offline session

### Phase 2 Complete When:
- [ ] Ollama integration works
- [ ] Better AI responses offline
- [ ] Advanced analytics display
- [ ] Sync queue manages complex changes
- [ ] Performance acceptable

### Phase 3 Complete When:
- [ ] Cloud backend deployed
- [ ] Multi-device sync works
- [ ] 100+ concurrent users handled
- [ ] Data secure
- [ ] All features production-ready

---

## 🚀 Ready to Start?

### Getting Started (Right Now)

1. **Backup current code**
   ```bash
   git commit -am "Pre-SQLite backup"
   ```

2. **Install SQLite**
   ```bash
   npm install expo-sqlite expo-network react-native-chart-kit
   ```

3. **Create database setup**
   - Create `src/database/schema.ts`
   - Create `src/database/init.ts`
   - Create `src/database/service.ts`

4. **Create dashboard**
   - Create `app/(tabs)/dashboard.tsx`
   - Create dashboard components
   - Wire up to database

5. **Update chat**
   - Modify `app/(tabs)/tutor.tsx`
   - Add SQLite storage
   - Add offline detection

6. **Test thoroughly**
   - Test offline
   - Test online
   - Test sync
   - Test on real device

---

## 📞 Questions?

If you get stuck:
1. Check [OFFLINE_FIRST_DESIGN.md](./OFFLINE_FIRST_DESIGN.md) for architecture
2. Check [OFFLINE_ARCHITECTURE_SUMMARY.md](./OFFLINE_ARCHITECTURE_SUMMARY.md) for visual overview
3. Check [OFFLINE_FIRST_QUICK_START.md](./OFFLINE_FIRST_QUICK_START.md) for quick reference

---

**Status: Ready for Phase 1 Implementation ✅**

Next: Approve this checklist and start building! 🚀
