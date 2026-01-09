import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { deleteAllChats } from '@/storage/chatStore';
import { getOfflineMode, setOfflineMode } from '@/storage/settingsStore';
import { INDIAN_LANGUAGES } from '@/services/speechToText';
import { getProfile } from '@/storage/profileStore';

export default function SettingsScreen() {
  const [language, setLanguage] = useState('en-IN');
  const [offlineMode, setOfflineModeState] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const stored = await getOfflineMode();
      setOfflineModeState(stored);
      
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    })();
  }, []);

  const handleOfflineToggle = async (value: boolean) => {
    setOfflineModeState(value);
    await setOfflineMode(value);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all chat history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await deleteAllChats();
            Alert.alert('Success', 'Chat history cleared');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Handle sign out logic
            Alert.alert('Signed Out', 'You have been signed out');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* User Profile Card */}
        {profile && (
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>{profile.name?.charAt(0) || 'R'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name || 'Rahul Kumar'}</Text>
              <Text style={styles.profileGrade}>{profile.grade || 'Class 10'} • CBSE</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.profileIcon}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content & Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTENT & LEARNING</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Grade & Board</Text>
                <Text style={styles.settingValue}>{profile?.grade || 'Class 10'} • CBSE</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Offline Storage</Text>
                <Text style={styles.settingValue}>2.4 GB</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingLabelRow}>
                  <Text style={styles.settingIcon}>🔔</Text>
                  <Text style={styles.settingLabel}>Notifications</Text>
                </View>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={true ? '#4caf50' : '#f4f3f4'}
              />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingLabelRow}>
                  <Text style={styles.settingIcon}>🤖</Text>
                  <Text style={styles.settingLabel}>AI Assistant</Text>
                </View>
                <Text style={styles.settingHint}>Voice Mode Enabled</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingLabelRow}>
                  <Text style={styles.settingIcon}>❓</Text>
                  <Text style={styles.settingLabel}>Help & Support</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingLabelRow}>
                  <Text style={styles.settingIcon}>ℹ️</Text>
                  <Text style={styles.settingLabel}>About App</Text>
                </View>
                <Text style={styles.settingHint}>Version 2.4.0</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  profileGrade: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  profileIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    marginBottom: 8,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  settingHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    marginLeft: 32,
  },
  settingValue: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  settingArrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  bottomSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
