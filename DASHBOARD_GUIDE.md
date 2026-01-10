# Dashboard Navigation Guide

## 📱 Dashboard Structure

```
Dashboard Tab
├── Header
│   ├── Greeting (Good Morning, Student!)
│   └── Notification Bell
├── Search Bar
├── Quick Access (4 buttons)
│   ├── NCERT
│   ├── Syllabus
│   ├── Downloads
│   └── Tests
├── Continue Reading Section
│   └── Last read chapter card
└── Subjects Grid (6 subjects)
    ├── 🔬 Science ← CLICK HERE
    ├── 📐 Mathematics
    ├── 🌍 History
    ├── 🌐 English
    ├── 🗺️ Geography
    └── 💻 Computer
```

---

## 🔬 Science Subject Modal

When you click on the **Science** card, a modal opens showing:

```
Science - Class 9
├── Header
│   ├── Back Button
│   ├── Title: "Science - Class 9"
│   └── Close Button
├── Subject Header Card
│   ├── Emoji: 🔬
│   ├── Title: "Science"
│   ├── Subtitle: "Class 9 - NCERT"
│   └── Statistics
│       ├── 3 Chapters
│       ├── 30 Flashcards
│       └── 18 Questions
└── Chapters List
    ├── Chapter 1
    ├── Chapter 2
    └── Chapter 3
```

---

## 📚 Chapter Card Details

Each chapter card shows:

```
┌─────────────────────────────────────┐
│ [1] Matter in Our Surroundings      │
│                                     │
│ Difficulty: 2E • 2M • 2H           │
│                                     │
│ 📚 10 Flashcards  📝 6 Questions    │
│                                     │
│ [Study] [Quiz] [Progress]          │
└─────────────────────────────────────┘
```

### Chapter Information
- **Chapter Number**: Colored badge (1, 2, or 3)
- **Chapter Title**: Full chapter name
- **Difficulty**: Breakdown of Easy/Medium/Hard questions
- **Flashcards**: Count of study cards
- **Questions**: Count of quiz questions
- **Action Buttons**: Study, Quiz, Progress

---

## 🎯 Action Buttons

### Study Button
- Icon: 📚 (Layers)
- Color: Orange (#FF6B35)
- Action: Opens Flashcards tab for that chapter
- Shows: 10 flashcards to study

### Quiz Button
- Icon: 📝 (Quiz)
- Color: Green (#4CAF50)
- Action: Opens Quiz tab for that chapter
- Shows: 6 timed questions

### Progress Button
- Icon: 📈 (Trending Up)
- Color: Blue (#2196F3)
- Action: Opens Progress tab
- Shows: Statistics and notes

---

## 📊 Chapter Breakdown

### Chapter 1: Matter in Our Surroundings
```
Title: Matter in Our Surroundings
Description: Understanding states of matter, properties, and changes

Flashcards: 10
├── 1-1: Solid, Liquid, Gas states
├── 1-2: Properties of matter
├── 1-3: Phase transitions
├── 1-4: Density and diffusion
├── 1-5: Evaporation and condensation
├── 1-6: Sublimation
├── 1-7: Melting point
├── 1-8: Boiling point
├── 1-9: Particle arrangement
└── 1-10: Intermolecular forces

Quiz Questions: 6
├── Easy (2): States of matter, evaporation
├── Medium (2): Density order, diffusion
└── Hard (2): Boiling point, cooling effect
```

### Chapter 2: Is Matter Around Us Pure
```
Title: Is Matter Around Us Pure
Description: Pure substances, mixtures, and separation techniques

Flashcards: 10
├── 2-1: Pure substances
├── 2-2: Mixtures
├── 2-3: Homogeneous mixtures
├── 2-4: Heterogeneous mixtures
├── 2-5: Colloids
├── 2-6: Suspensions
├── 2-7: Tyndall effect
├── 2-8: Filtration
├── 2-9: Evaporation
└── 2-10: Chromatography

Quiz Questions: 6
├── Easy (2): Pure substances, homogeneous
├── Medium (2): Tyndall effect, separation
└── Hard (2): Solution vs suspension, chromatography
```

### Chapter 3: Atoms and Molecules
```
Title: Atoms and Molecules
Description: Atomic structure, chemical formulas, and calculations

Flashcards: 10
├── 3-1: Atomic structure
├── 3-2: Electrons and protons
├── 3-3: Atomic mass
├── 3-4: Molecules
├── 3-5: Chemical formulas
├── 3-6: Avogadro's number
├── 3-7: Molar mass
├── 3-8: Mole concept
├── 3-9: Atomic mass unit
└── 3-10: Isotopes

Quiz Questions: 6
├── Easy (2): Atoms, Avogadro's number
├── Medium (2): Molar mass, conservation of mass
└── Hard (2): Mole calculations, molecular count
```

---

## 🔄 Navigation Flow

### From Dashboard to Quiz
```
Dashboard
  ↓
Click "Science" card
  ↓
Science Modal opens
  ↓
Select Chapter
  ↓
Click "Quiz" button
  ↓
Quiz Tab opens with selected chapter
  ↓
Answer 6 questions
  ↓
View results
```

### From Dashboard to Flashcards
```
Dashboard
  ↓
Click "Science" card
  ↓
Science Modal opens
  ↓
Select Chapter
  ↓
Click "Study" button
  ↓
Flashcards Tab opens with selected chapter
  ↓
Study 10 cards
  ↓
Mark as mastered/review
```

### From Dashboard to Progress
```
Dashboard
  ↓
Click "Science" card
  ↓
Science Modal opens
  ↓
Select Chapter
  ↓
Click "Progress" button
  ↓
Progress Tab opens
  ↓
View statistics and notes
```

---

## 💡 Tips & Tricks

### Quick Access
- **Dashboard**: Overview of all subjects and chapters
- **Flashcards**: Study individual cards
- **Quiz**: Test your knowledge
- **Progress**: Track your learning

### Study Strategy
1. Start with **Flashcards** to learn concepts
2. Take **Quiz** to test understanding
3. Check **Progress** to see improvement
4. Review weak areas

### Chapter Statistics
- Each chapter has 10 flashcards
- Each chapter has 6 quiz questions
- Questions are balanced: 2 Easy, 2 Medium, 2 Hard
- Total: 30 flashcards, 18 questions

---

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Blue | #2196F3 |
| Study Button | Orange | #FF6B35 |
| Quiz Button | Green | #4CAF50 |
| Progress Button | Blue | #2196F3 |
| Chapter Number | Orange | #FF6B35 |
| Background | Light Gray | #f8f9fa |
| Cards | White | #ffffff |

---

## 📱 Responsive Design

- **Mobile**: Full width cards, stacked layout
- **Tablet**: 2-column grid for chapters
- **Desktop**: 3-column grid for chapters

---

## 🚀 Future Enhancements

1. Add more subjects (Math, History, English, etc.)
2. Add progress indicators per chapter
3. Add achievement badges
4. Add study reminders
5. Add collaborative features
6. Add offline mode

---

## ❓ FAQ

**Q: How do I access a specific chapter?**
A: Click on the Science card in the Dashboard, then select the chapter you want.

**Q: Can I study multiple chapters at once?**
A: Yes, you can switch between chapters using the action buttons.

**Q: How many questions are in each quiz?**
A: Each chapter has 6 quiz questions (2 Easy, 2 Medium, 2 Hard).

**Q: How many flashcards are there?**
A: Each chapter has 10 flashcards, total 30 for Science.

**Q: Can I track my progress?**
A: Yes, click the Progress button to see your statistics.

**Q: What if I want to study other subjects?**
A: Currently, only Science is available. More subjects coming soon!

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review the app documentation
3. Check browser console for errors
4. Verify all data is loading correctly

---

**Dashboard Guide v1.0**
**Last Updated**: January 11, 2026
