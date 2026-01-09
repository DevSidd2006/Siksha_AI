# 🔗 Profile Integration Guide

## Overview

This guide shows how to integrate the Student Profile system with the existing Chat and Dashboard features.

## 1. Update Chat Session Tracking

### In `app/(tabs)/tutor.tsx`

Add profile statistics tracking after each chat response:

```typescript
import { updateChatStatistics } from '@/storage/profileStore';

// After receiving AI response, add this:
const sessionStartTime = Date.now();

const handleSend = async () => {
  const startTime = Date.now();
  
  try {
    // ... existing code for sending message ...
    
    const response = await sendQuestion(textToSend.trim(), studentGrade);
    
    // NEW: Track session duration
    const sessionDuration = (Date.now() - startTime) / 1000 / 60; // Convert to minutes
    await updateChatStatistics(sessionDuration);
    
  } catch (error) {
    // ... error handling ...
  }
};
```

### Full Updated Function

```typescript
const handleSend = async () => {
  const textToSend = isListening ? listeningTranscript : inputText;
  if (!textToSend.trim() || isLoading) return;

  const sessionStartTime = Date.now();

  const userMessage: Message = {
    id: Date.now().toString(),
    text: textToSend.trim(),
    isUser: true,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputText('');
  setListeningTranscript('');
  setIsListening(false);
  setIsLoading(true);

  try {
    const latestOffline = await getOfflineMode();
    setOfflineMode(latestOffline);

    const response = latestOffline
      ? await generateOfflineAnswer(textToSend.trim())
      : await sendQuestion(textToSend.trim(), studentGrade);
    
    const tutorMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.answer,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, tutorMessage];
      saveChat(updatedMessages);
      return updatedMessages;
    });

    // NEW: Update profile statistics
    const sessionDuration = (Date.now() - sessionStartTime) / 1000 / 60;
    await updateChatStatistics(Math.round(sessionDuration));

  } catch (error) {
    console.error('Error sending question:', error);
    const message = offlineMode
      ? 'Offline helper ran into a problem. Try again.'
      : 'Failed to get response from tutor. Please check your connection and try again.';
    Alert.alert('Error', message);
  } finally {
    setIsLoading(false);
  }
};
```

## 2. Display Profile in Dashboard

### In `app/(tabs)/dashboard.tsx`

Show student profile info in the dashboard header:

```typescript
import { getProfile, getProfileSummary } from '@/storage/profileStore';

// Add to component state
const [profileSummary, setProfileSummary] = useState<any>(null);

// Add to useEffect
useEffect(() => {
  loadProfileSummary();
}, []);

const loadProfileSummary = async () => {
  try {
    const summary = await getProfileSummary();
    setProfileSummary(summary);
  } catch (error) {
    console.error('Error loading profile summary:', error);
  }
};

// Add to JSX
{profileSummary && (
  <View style={styles.profileCard}>
    <Text style={styles.profileAvatar}>{profileSummary.avatar}</Text>
    <View>
      <Text style={styles.profileName}>{profileSummary.name}</Text>
      <Text style={styles.profileGrade}>{profileSummary.grade}</Text>
    </View>
    <View style={styles.streakBadge}>
      <Text style={styles.streakText}>🔥 {profileSummary.currentStreak}</Text>
    </View>
  </View>
)}
```

## 3. Add Profile Link to Settings

### In `app/(tabs)/settings.tsx`

Add navigation to profile screen:

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Add to settings sections
<View style={styles.section}>
  <Text style={styles.sectionTitle}>👤 Profile</Text>
  <View style={styles.card}>
    <TouchableOpacity 
      style={styles.settingButton}
      onPress={() => router.push('/(tabs)/profile')}
    >
      <View style={styles.settingButtonLeft}>
        <Text style={styles.settingButtonIcon}>👨‍🎓</Text>
        <View>
          <Text style={styles.label}>View/Edit Profile</Text>
          <Text style={styles.hint}>Manage your learning profile</Text>
        </View>
      </View>
      <Text style={styles.settingButtonArrow}>›</Text>
    </TouchableOpacity>
  </View>
</View>
```

## 4. Show Profile Avatar in Header

### In `app/(tabs)/tutor.tsx`

Display profile info in tutor header:

```typescript
import { getProfile } from '@/storage/profileStore';

// Add to state
const [profileAvatar, setProfileAvatar] = useState('👨‍🎓');

// Add to useEffect
useEffect(() => {
  loadProfileAvatar();
}, []);

const loadProfileAvatar = async () => {
  try {
    const profile = await getProfile();
    setProfileAvatar(profile.avatar);
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};

// In JSX header
<View style={styles.topBar}>
  <Text style={styles.avatarEmoji}>{profileAvatar}</Text>
  <Text style={styles.title}>AI Tutor</Text>
  {/* ... rest of header ... */}
</View>
```

## 5. Achievement System Integration

### Add Badge Logic

```typescript
import { addBadge, getProfile } from '@/storage/profileStore';

// Function to check and award badges
const checkAndAwardBadges = async () => {
  const profile = await getProfile();
  
  // First chat badge
  if (profile.statistics.totalChatsCompleted === 1) {
    await addBadge('🎯'); // First step
  }
  
  // 10 chats badge
  if (profile.statistics.totalChatsCompleted === 10) {
    await addBadge('⭐'); // Star performer
  }
  
  // 30 chats badge
  if (profile.statistics.totalChatsCompleted === 30) {
    await addBadge('🌟'); // Superstar
  }
  
  // 5 day streak
  if (profile.statistics.currentStreak === 5) {
    await addBadge('🔥'); // On fire
  }
  
  // 10 day streak
  if (profile.statistics.currentStreak === 10) {
    await addBadge('💪'); // Unstoppable
  }
  
  // 1 hour total
  if (profile.statistics.totalTimeSpent >= 60) {
    await addBadge('📚'); // Dedicated learner
  }
  
  // 5 hours total
  if (profile.statistics.totalTimeSpent >= 300) {
    await addBadge('🏆'); // Master learner
  }
};

// Call after updating chat statistics
await updateChatStatistics(sessionDuration);
await checkAndAwardBadges();
```

## 6. Profile-Based Content Recommendation

### Customize Responses Based on Learning Style

```typescript
import { getProfile } from '@/storage/profileStore';

const customizeResponse = async (answer: string) => {
  const profile = await getProfile();
  
  let enhancedAnswer = answer;
  
  // Enhance based on learning style
  switch (profile.learningStyle) {
    case 'visual':
      enhancedAnswer = `[With diagrams and charts]\n${answer}`;
      break;
    case 'auditory':
      enhancedAnswer = `[Read aloud]\n${answer}`;
      break;
    case 'reading':
      enhancedAnswer = answer; // Default format
      break;
    case 'kinesthetic':
      enhancedAnswer = `[Try this activity]\n${answer}`;
      break;
  }
  
  return enhancedAnswer;
};
```

## 7. Track Subject-Specific Progress

### Add Subject Tracking to Statistics

```typescript
// Extend statistics to include subject performance
interface SubjectStats {
  [subject: string]: {
    chatsCompleted: number;
    timeSpent: number;
    averageScore: number;
  };
}

// In profile update
const updateSubjectStats = async (subject: string, duration: number) => {
  const profile = await getProfile();
  
  if (!profile.statistics.subjectStats) {
    profile.statistics.subjectStats = {};
  }
  
  if (!profile.statistics.subjectStats[subject]) {
    profile.statistics.subjectStats[subject] = {
      chatsCompleted: 0,
      timeSpent: 0,
      averageScore: 0,
    };
  }
  
  profile.statistics.subjectStats[subject].chatsCompleted += 1;
  profile.statistics.subjectStats[subject].timeSpent += duration;
  
  await updateProfile(profile);
};
```

## 8. Generate Learning Report

### Create Profile Report Function

```typescript
const generateLearningReport = async () => {
  const profile = await getProfile();
  const { totalChatsCompleted, totalTimeSpent, currentStreak, longestStreak } = profile.statistics;
  
  const report = `
📊 Learning Report for ${profile.name}
═══════════════════════════════════════

📈 Statistics:
   • Total Chats: ${totalChatsCompleted}
   • Total Learning Time: ${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m
   • Current Streak: 🔥 ${currentStreak} days
   • Best Streak: 🏆 ${longestStreak} days

🎯 Goals:
   • Weekly Goal: ${profile.weeklyGoal} minutes
   • Learning Style: ${profile.learningStyle}

⭐ Subjects:
   ${profile.favoriteSubjects.join(', ')}

🏅 Badges Earned: ${profile.badges.length}
   ${profile.badges.join(' ')}

📅 Member Since: ${new Date(profile.joinDate).toLocaleDateString()}
  `;
  
  return report;
};
```

## Usage Example

### Complete Integration Example

```typescript
// After successful chat in tutor.tsx

const handleSend = async () => {
  const sessionStartTime = Date.now();
  
  // ... send message and get response ...
  
  // Track session
  const sessionDuration = (Date.now() - sessionStartTime) / 1000 / 60;
  await updateChatStatistics(Math.round(sessionDuration));
  
  // Check for badges
  const profile = await getProfile();
  if (profile.statistics.totalChatsCompleted % 10 === 0) {
    await addBadge('⭐');
    Alert.alert('🎉 Achievement Unlocked!', 'You earned a badge!');
  }
  
  // Show profile if this is first chat
  if (profile.statistics.totalChatsCompleted === 1) {
    Alert.alert(
      'Welcome, ' + profile.name + '!',
      'You can manage your learning profile anytime from the Profile tab.'
    );
  }
};
```

## Testing Checklist

- [ ] Profile loads on first app launch
- [ ] Can edit name, grade, subjects
- [ ] Statistics update after each chat
- [ ] Current streak increments daily
- [ ] Badges are awarded correctly
- [ ] Profile shows in dashboard
- [ ] Avatar displays in tutor screen
- [ ] Learning style preference loads
- [ ] Weekly goal is accessible
- [ ] Reset profile works
- [ ] All edits persist after app restart

## File Structure

```
src/storage/
├── profileStore.ts          ← Profile management (NEW)
├── chatStore.ts             ← Chat history
└── settingsStore.ts         ← Settings

app/(tabs)/
├── profile.tsx              ← Profile screen (NEW)
├── tutor.tsx                ← With statistics tracking (UPDATED)
├── dashboard.tsx            ← With profile display (UPDATED)
├── settings.tsx             ← With profile link (UPDATED)
└── _layout.tsx              ← With profile tab (UPDATED)
```

## API Calls Summary

**In Tutor Screen**:
- `updateChatStatistics(duration)` - After each chat
- `getProfile()` - For avatar on load

**In Dashboard**:
- `getProfileSummary()` - For quick stats display

**In Settings**:
- `router.push('/(tabs)/profile')` - Navigate to profile

**In Profile Screen**:
- `getProfile()` - Load all data
- `updateProfile()` - Save changes
- Various specific update functions

## Next Steps

1. ✅ Profile screen created and functional
2. 📋 Integrate statistics tracking in tutor
3. 📋 Add profile display to dashboard
4. 📋 Create badge system
5. 📋 Generate learning reports
6. 📋 Add profile analytics

---

**Status**: ✅ Profile system ready for integration
