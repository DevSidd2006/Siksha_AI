import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Modal,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  getProfile,
  updateProfile,
  updateFavoriteSubjects,
  updateLearningStyle,
  updateWeeklyGoal,
  StudentProfile,
} from '@/storage/profileStore';
import { logoutUser, getAuthSession } from '@/storage/authstore';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [editingGrade, setEditingGrade] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('Class 5');
  const [editingSubjects, setEditingSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [editingLearningStyle, setEditingLearningStyle] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  const grades = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'];
  const subjects = [
    'Math',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
  ];
  const learningStyles = [
    { id: 'visual', name: 'Visual', emoji: '👀' },
    { id: 'auditory', name: 'Auditory', emoji: '👂' },
    { id: 'reading', name: 'Reading', emoji: '📖' },
    { id: 'kinesthetic', name: 'Kinesthetic', emoji: '🤲' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
      loadUserEmail();
    }, [])
  );

  const loadUserEmail = async () => {
    try {
      const session = await getAuthSession();
      if (session) {
        setUserEmail(session.email);
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const loadProfile = async () => {
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);
      setTempName(userProfile.name);
      setSelectedGrade(userProfile.grade);
      setSelectedSubjects([...userProfile.favoriteSubjects]);
      setTempGoal(userProfile.weeklyGoal.toString());
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    try {
      if (profile) {
        await updateProfile({ ...profile, name: tempName });
        setProfile({ ...profile, name: tempName });
        setIsEditingName(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    }
  };

  const handleUpdateLearningStyle = async (styleId: string) => {
    try {
      if (profile) {
        await updateLearningStyle(styleId as 'visual' | 'auditory' | 'reading' | 'kinesthetic');
        setProfile({ ...profile, learningStyle: styleId as 'visual' | 'auditory' | 'reading' | 'kinesthetic' });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update learning style');
    }
  };

  const handleSaveGrade = async () => {
    try {
      if (profile) {
        await updateProfile({ ...profile, grade: selectedGrade });
        setProfile({ ...profile, grade: selectedGrade });
        setEditingGrade(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update grade');
    }
  };

  const handleToggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSaveSubjects = async () => {
    if (selectedSubjects.length === 0) {
      Alert.alert('Error', 'Please select at least one subject');
      return;
    }
    try {
      if (profile) {
        await updateFavoriteSubjects(selectedSubjects);
        await updateProfile({
          ...profile,
          favoriteSubjects: selectedSubjects,
        });
        setProfile({
          ...profile,
          favoriteSubjects: selectedSubjects,
        });
        setEditingSubjects(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update subjects');
    }
  };

  const handleSaveLearningStyle = async (
    style: 'visual' | 'auditory' | 'reading' | 'kinesthetic'
  ) => {
    try {
      if (profile) {
        await updateLearningStyle(style);
        await updateProfile({ ...profile, learningStyle: style });
        setProfile({ ...profile, learningStyle: style });
        setEditingLearningStyle(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update learning style');
    }
  };

  const handleSaveGoal = async () => {
    const minutes = parseInt(tempGoal);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('Error', 'Please enter a valid number of minutes');
      return;
    }
    try {
      if (profile) {
        await updateWeeklyGoal(minutes);
        await updateProfile({ ...profile, weeklyGoal: minutes });
        setProfile({ ...profile, weeklyGoal: minutes });
        setEditingGoal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>Let's set up your profile</Text>
          <Text style={styles.subtitle}>Help us personalize your learning experience with NCERT resources.</Text>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </View>

          {/* Full Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={tempName}
              onChangeText={setTempName}
              maxLength={30}
            />
          </View>

          {/* Class Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Which class are you in?</Text>
            <View style={styles.classGrid}>
              {grades.map((grade, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.classButton,
                    selectedGrade === grade && styles.classButtonSelected,
                  ]}
                  onPress={() => setSelectedGrade(grade)}
                >
                  <Text
                    style={[
                      styles.classButtonText,
                      selectedGrade === grade && styles.classButtonTextSelected,
                    ]}
                  >
                    {grade.split(' ')[1]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Board Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select your Board</Text>
            <View style={styles.boardContainer}>
              <TouchableOpacity style={styles.boardOption}>
                <Text style={styles.boardIcon}>📚</Text>
                <Text style={styles.boardName}>CBSE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boardOption}>
                <Text style={styles.boardIcon}>📖</Text>
                <Text style={styles.boardName}>State Board</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Favorite Subjects */}
          <View style={styles.section}>
            <Text style={styles.label}>Favorite Subjects</Text>
            <View style={styles.subjectsContainer}>
              {subjects.map((subject, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.subjectTag,
                    selectedSubjects.includes(subject) && styles.subjectTagSelected,
                  ]}
                  onPress={() => handleToggleSubject(subject)}
                >
                  <Text
                    style={[
                      styles.subjectTagText,
                      selectedSubjects.includes(subject) && styles.subjectTagTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Learning Style */}
          <View style={styles.section}>
            <Text style={styles.label}>Learning Style</Text>
            <View style={styles.learningStyleContainer}>
              {learningStyles.map((style, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.styleCard,
                    profile.learningStyle === style.id && styles.styleCardSelected,
                  ]}
                  onPress={() => handleUpdateLearningStyle(style.id)}
                >
                  <Text style={styles.styleEmoji}>{style.emoji}</Text>
                  <Text style={styles.styleName}>{style.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveName}
          >
            <Text style={styles.saveButtonText}>Continue</Text>
          </TouchableOpacity>

          {/* User Email Display */}
          {userEmail && (
            <View style={styles.userEmailSection}>
              <Text style={styles.userEmailLabel}>Logged in as</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  classButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  classButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  classButtonTextSelected: {
    color: '#2196F3',
  },
  boardContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  boardOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  boardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  boardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  subjectTagSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  subjectTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  subjectTagTextSelected: {
    color: '#2196F3',
  },
  learningStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  styleCard: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  styleCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  styleEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  styleName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmailSection: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  userEmailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  userEmail: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
