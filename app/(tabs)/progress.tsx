import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  calculateStudyStats,
  formatTimeSpent,
  getMotivationalMessage,
  StudySession,
  StudentNote,
} from '@/data/studyProgress';

export default function ProgressScreen() {
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: '1',
      chapterId: 1,
      type: 'flashcard',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
    {
      id: '2',
      chapterId: 1,
      type: 'quiz',
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
      score: 85,
      totalQuestions: 6,
    },
    {
      id: '3',
      chapterId: 2,
      type: 'flashcard',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 25 * 60 * 1000),
    },
  ]);

  const [notes, setNotes] = useState<StudentNote[]>([
    {
      id: '1',
      chapterId: 1,
      title: 'States of Matter',
      content: 'Solids have fixed shape and volume. Liquids have fixed volume but no fixed shape.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ['important', 'chapter1'],
    },
  ]);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', chapterId: 1 });
  const [selectedTab, setSelectedTab] = useState<'stats' | 'notes'>('stats');

  const stats = calculateStudyStats(sessions);
  const motivationalMessage = getMotivationalMessage(stats);

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: StudentNote = {
        id: Date.now().toString(),
        chapterId: newNote.chapterId,
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };
      setNotes([...notes, note]);
      setNewNote({ title: '', content: '', chapterId: 1 });
      setShowNoteModal(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const chapterNotes = notes.filter(n => n.chapterId === 1); // Can be made dynamic

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Your Progress</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'stats' && styles.tabActive]}
          onPress={() => setSelectedTab('stats')}
        >
          <MaterialIcons name="bar-chart" size={20} color={selectedTab === 'stats' ? '#2196F3' : '#999'} />
          <Text style={[styles.tabText, selectedTab === 'stats' && styles.tabTextActive]}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'notes' && styles.tabActive]}
          onPress={() => setSelectedTab('notes')}
        >
          <MaterialIcons name="note" size={20} color={selectedTab === 'notes' ? '#2196F3' : '#999'} />
          <Text style={[styles.tabText, selectedTab === 'notes' && styles.tabTextActive]}>Notes</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'stats' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {/* Motivational Card */}
          <View style={styles.motivationalCard}>
            <Text style={styles.motivationalText}>{motivationalMessage}</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={32} color="#FF6B35" />
              <Text style={styles.statValue}>{stats.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="schedule" size={32} color="#2196F3" />
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="timer" size={32} color="#4CAF50" />
              <Text style={styles.statValue}>{formatTimeSpent(stats.totalTimeSpent)}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="school" size={32} color="#FF9800" />
              <Text style={styles.statValue}>{stats.chaptersCompleted}/3</Text>
              <Text style={styles.statLabel}>Chapters</Text>
            </View>
          </View>

          {/* Average Score */}
          {stats.averageScore > 0 && (
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>Average Quiz Score</Text>
                <Text style={styles.scoreValue}>{stats.averageScore}%</Text>
              </View>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreBarFill,
                    { width: `${stats.averageScore}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            {sessions.slice(0, 5).map((session, index) => (
              <View key={session.id} style={[styles.activityItem, index !== 0 && styles.activityItemBorder]}>
                <View style={styles.activityIcon}>
                  <MaterialIcons
                    name={session.type === 'quiz' ? 'quiz' : 'layers'}
                    size={20}
                    color={session.type === 'quiz' ? '#FF6B35' : '#2196F3'}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>
                    {session.type === 'quiz' ? 'Quiz' : 'Flashcards'} - Chapter {session.chapterId}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(session.startTime).toLocaleDateString()}
                  </Text>
                </View>
                {session.score && (
                  <View style={styles.activityScore}>
                    <Text style={styles.activityScoreText}>{session.score}%</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.notesContainer}>
          <FlatList
            data={chapterNotes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent}>{item.content}</Text>
                <Text style={styles.noteDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.notesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="note-add" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No notes yet. Create one!</Text>
              </View>
            }
          />
          <TouchableOpacity
            style={styles.addNoteButton}
            onPress={() => setShowNoteModal(true)}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addNoteButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Note Modal */}
      <Modal
        visible={showNoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TouchableOpacity onPress={handleAddNote}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Note title"
              value={newNote.title}
              onChangeText={text => setNewNote({ ...newNote, title: text })}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Write your note here..."
              value={newNote.content}
              onChangeText={text => setNewNote({ ...newNote, content: text })}
              multiline
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Chapter</Text>
            <View style={styles.chapterSelector}>
              {[1, 2, 3].map(ch => (
                <TouchableOpacity
                  key={ch}
                  style={[
                    styles.chapterOption,
                    newNote.chapterId === ch && styles.chapterOptionActive,
                  ]}
                  onPress={() => setNewNote({ ...newNote, chapterId: ch })}
                >
                  <Text
                    style={[
                      styles.chapterOptionText,
                      newNote.chapterId === ch && styles.chapterOptionTextActive,
                    ]}
                  >
                    Chapter {ch}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#2196F3',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  motivationalCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activityScore: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityScoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2196F3',
  },
  notesContainer: {
    flex: 1,
  },
  notesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  noteContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 11,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addNoteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalSaveText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  chapterSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chapterOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    alignItems: 'center',
  },
  chapterOptionActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  chapterOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  chapterOptionTextActive: {
    color: '#2196F3',
  },
});
