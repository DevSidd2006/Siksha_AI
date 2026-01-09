# 👤 Student Profile System

## Overview

The Student Profile system allows each learner to maintain a personalized profile with their learning preferences, progress statistics, and achievement badges.

## Features

### 1. **Profile Information**
- **Name**: Customizable student name
- **Grade Level**: Class 5-9 selection
- **Age**: Student age tracking
- **Avatar**: Emoji selection for profile picture
- **Bio**: Brief description or motto

### 2. **Learning Preferences**
- **Favorite Subjects**: Select multiple subjects (Math, Science, English, History, Geography, Computer Science)
- **Learning Style**: Choose preferred learning method:
  - 👀 **Visual** - Learn through images, diagrams, charts
  - 👂 **Auditory** - Learn through listening and speaking
  - 📖 **Reading** - Learn through text and written materials
  - 🤲 **Kinesthetic** - Learn through hands-on activities

### 3. **Learning Goals**
- **Weekly Goal**: Set learning time targets (in minutes)
- Tracks time spent learning
- Helps establish learning habits
- Visual progress indication

### 4. **Achievement System**
- 🏆 **Badges**: Earn badges for milestones
- Track learning streaks
- Gamification elements
- Motivation and encouragement

### 5. **Learning Statistics**
- **Total Chats**: Number of conversations completed
- **Total Time**: Hours and minutes spent learning
- **Current Streak**: Consecutive days of learning
- **Longest Streak**: Best streak achieved
- **Average Session**: Average learning session length
- **Member Since**: Account creation date

## Database Structure

```typescript
interface StudentProfile {
  id: string;                    // Unique profile ID
  name: string;                  // Student's name
  grade: string;                 // Class 5-9
  age: number;                   // Student age
  school?: string;               // School name (optional)
  email?: string;                // Email (optional)
  favoriteSubjects: string[];    // Array of selected subjects
  learningStyle: string;         // visual | auditory | reading | kinesthetic
  weeklyGoal: number;            // Minutes per week
  avatar: string;                // Emoji avatar
  joinDate: Date;                // Account creation date
  bio?: string;                  // Short biography
  badges: string[];              // Array of achievement badges
  statistics: {
    totalChatsCompleted: number;
    totalTimeSpent: number;      // in minutes
    averageSessionLength: number;
    longestStreak: number;       // in days
    currentStreak: number;       // in days
    lastActiveDate: Date;
  };
}
```

## API Reference

### Profile Management

#### `getProfile(): Promise<StudentProfile>`
Retrieves the current student profile.
```typescript
const profile = await getProfile();
```

#### `updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile>`
Updates profile information.
```typescript
await updateProfile({
  name: 'John Doe',
  age: 13
});
```

#### `resetProfile(): Promise<void>`
Resets profile to default values.
```typescript
await resetProfile();
```

#### `deleteProfile(): Promise<void>`
Deletes the profile completely (data privacy).
```typescript
await deleteProfile();
```

### Learning Preferences

#### `updateFavoriteSubjects(subjects: string[]): Promise<void>`
Updates favorite subjects.
```typescript
await updateFavoriteSubjects(['Math', 'Science', 'English']);
```

#### `updateLearningStyle(style: 'visual' | 'auditory' | 'reading' | 'kinesthetic'): Promise<void>`
Sets learning style preference.
```typescript
await updateLearningStyle('visual');
```

#### `updateWeeklyGoal(minutes: number): Promise<void>`
Sets weekly learning goal.
```typescript
await updateWeeklyGoal(300); // 5 hours
```

### Statistics

#### `updateChatStatistics(chatDurationMinutes: number): Promise<void>`
Updates stats after each chat session.
```typescript
await updateChatStatistics(15); // 15 minute session
```

#### `getProfileSummary(): Promise<ProfileSummary>`
Gets a quick summary for display.
```typescript
const summary = await getProfileSummary();
// Returns: { name, grade, avatar, chatsCompleted, totalTime, currentStreak }
```

### Achievements

#### `addBadge(badge: string): Promise<void>`
Adds a badge to the profile.
```typescript
await addBadge('🌟');
```

## UI Screens

### Profile Screen Location
- **Tab**: 5th tab in the main navigation (👤 Profile)
- **Route**: `app/(tabs)/profile.tsx`
- **Access**: Tap Profile tab from any screen

### Profile Sections

#### 1. **Profile Header**
- Large emoji avatar (customizable)
- Student name (editable)
- "Tap to edit" hint

#### 2. **Quick Statistics**
- Cards showing:
  - Number of chats completed
  - Total learning time
  - Current learning streak (with 🔥 emoji)

#### 3. **Grade Level** (Editable)
- Dropdown selection: Class 5-9
- Save/Cancel buttons in edit mode
- Displays current grade when not editing

#### 4. **Favorite Subjects** (Editable)
- Multi-select checkboxes
- Available subjects: Math, Science, English, History, Geography, Computer Science
- Shows selected subjects as blue tags
- Save/Cancel buttons

#### 5. **Learning Style** (Editable)
- 4 option buttons with emojis
- Visual, Auditory, Reading, Kinesthetic
- Highlighted when selected
- Saves on selection

#### 6. **Weekly Goal** (Editable)
- Numeric input field
- Shows goal in minutes and converted to hours
- Helps track learning consistency

#### 7. **Achievements**
- Grid display of earned badges
- Shows motivational message if no badges yet
- Expandable section for future achievements

#### 8. **Additional Information**
- Member Since date
- Age
- Longest Streak
- Average Session Length
- All in an organized info card

## Integration with Chat

### Auto-Update Statistics
After each chat session:
1. Call `updateChatStatistics(durationInMinutes)`
2. This automatically:
   - Increments chat counter
   - Adds time to total
   - Updates average session length
   - Tracks learning streaks
   - Updates last active date

### Example Implementation
```typescript
// In tutor.tsx after chat response
const sessionDuration = (endTime - startTime) / 60000; // Convert ms to minutes
await updateChatStatistics(sessionDuration);
```

### Grade-Based Responses
The profile grade is used for age-appropriate AI responses:
```typescript
// In tutor.tsx
const { grade } = await getProfile();
const response = await sendQuestion(question, grade);
```

## Customization Options

### Avatar Emojis Available
- 👨‍🎓 Default student
- 👧 Girl student
- 👦 Boy student
- 🧒 Young student
- 👨‍🔬 Science student
- 👨‍💻 Tech student
- 🎓 Graduate
- And more...

### Subject List (Customizable)
Current: Math, Science, English, History, Geography, Computer Science
Can be expanded with:
- Arts, Music, Physical Education
- Languages (Spanish, French, Hindi)
- Coding, Robotics
- And more...

### Learning Goals Examples
- **Beginner**: 150 minutes/week (20 mins/day)
- **Intermediate**: 300 minutes/week (45 mins/day)
- **Advanced**: 450 minutes/week (60 mins/day)
- **Custom**: User can set any value

## Data Persistence

All profile data is stored in **AsyncStorage** locally:
- **Key**: `@siksha_student_profile`
- **Format**: JSON with date serialization
- **Backup**: Automatic on every update
- **Privacy**: 100% local, no cloud sync (by default)

## Security & Privacy

### Data Protection
- ✅ All data stored locally on device
- ✅ No data sent to external servers
- ✅ Delete profile option available
- ✅ No tracking or analytics
- ✅ No third-party data sharing

### User Control
- Students can edit all their information
- Can reset to default values
- Can completely delete profile
- Clear chat history option in Settings

## Sample Profile Data

```json
{
  "id": "1704847590123",
  "name": "Arjun Kumar",
  "grade": "Class 7",
  "age": 13,
  "school": "Central High School",
  "email": "arjun@example.com",
  "favoriteSubjects": ["Math", "Science", "English"],
  "learningStyle": "visual",
  "weeklyGoal": 300,
  "avatar": "👨‍🎓",
  "joinDate": "2024-01-09T10:00:00Z",
  "bio": "Love learning about space and planets!",
  "badges": ["🌟", "🎯", "🔥"],
  "statistics": {
    "totalChatsCompleted": 42,
    "totalTimeSpent": 630,
    "averageSessionLength": 15,
    "longestStreak": 12,
    "currentStreak": 5,
    "lastActiveDate": "2024-01-09T14:30:00Z"
  }
}
```

## Best Practices

### For Teachers/Parents
1. Review profile regularly
2. Discuss learning goals with student
3. Check progress statistics
4. Encourage consistent streaks
5. Celebrate badge achievements

### For Students
1. Complete profile information
2. Choose accurate learning style
3. Set realistic weekly goals
4. Maintain learning streaks
5. Earn badges through consistent learning

## Future Enhancements

### Planned Features
1. Profile photo upload
2. Parent/teacher view
3. Social sharing (if multiplayer added)
4. Profile themes/customization
5. Certificate generation
6. Progress reports
7. Learning style recommendations
8. Personalized content suggestions

### Possible Integrations
- Cloud backup option
- Family account linking
- School integration
- Parent dashboard
- Report card generation
- Study recommendations based on weak areas

## Troubleshooting

### Profile Not Loading
1. Check if profile exists: `await getProfile()`
2. Check AsyncStorage: Clear app cache if corrupted
3. Reset to default: `await resetProfile()`

### Statistics Not Updating
1. Ensure `updateChatStatistics()` called after each chat
2. Check date serialization
3. Verify AsyncStorage permissions

### Edit Modal Not Closing
1. Ensure save function completes
2. Check for errors in console
3. Verify state updates properly

## File Structure

```
src/storage/
├── profileStore.ts          ← Profile management
└── chatStore.ts             ← Chat history

app/(tabs)/
├── profile.tsx              ← Profile screen
└── _layout.tsx              ← Navigation (includes profile tab)
```

## Version History

- **v1.0.0** (Current)
  - Profile creation and management
  - Learning preferences
  - Achievement badges
  - Statistics tracking
  - Editable profile sections
  - Weekly goals

---

**Status**: ✅ **Fully Implemented**

Students can now create, customize, and manage their learning profiles!
