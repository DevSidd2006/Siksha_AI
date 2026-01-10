import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Import data with fallback
let CLASS_9_SCIENCE_NOTES: any[] = [];
let getChapterNotes: any = () => undefined;
let getAllCategories: any = () => [];

try {
  const notesData = require('@/data/class9ScienceNotes');
  CLASS_9_SCIENCE_NOTES = notesData.CLASS_9_SCIENCE_NOTES || [];
  getChapterNotes = notesData.getChapterNotes || (() => undefined);
  getAllCategories = notesData.getAllCategories || (() => []);
} catch (error) {
  console.error('Failed to load notes data:', error);
}

interface Chapter {
  id: number;
  title: string;
}

export default function NotesScreen() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const chapters: Chapter[] = [
    { id: 1, title: 'Matter in Our Surroundings' },
    { id: 2, title: 'Is Matter Around Us Pure' },
    { id: 3, title: 'Atoms and Molecules' },
  ];

  useEffect(() => {
    if (selectedChapter) {
      const cats = getAllCategories(selectedChapter);
      setCategories(cats);
      setSelectedCategory(cats[0] || null);
    }
  }, [selectedChapter]);

  if (!selectedChapter) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>📘 Important Notes</Text>
          <Text style={styles.headerSubtitle}>Class 9 Science</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Select a Chapter</Text>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterCard}
              onPress={() => setSelectedChapter(chapter.id)}
            >
              <View style={styles.chapterCardContent}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{chapter.id}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterPoints}>
                    {CLASS_9_SCIENCE_NOTES[chapter.id - 1]?.points.length || 0} Important Points
                  </Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#FF6B35" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const chapterData = getChapterNotes(selectedChapter);

  if (!chapterData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </SafeAreaView>
    );
  }

  const filteredPoints = selectedCategory
    ? chapterData.points.filter(p => p.category === selectedCategory)
    : chapterData.points;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedChapter(null)}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chapter {selectedChapter}</Text>
          <Text style={styles.headerSubtitle}>{chapterData.chapterTitle}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Overview</Text>
          <Text style={styles.introText}>{chapterData.introduction}</Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Important Points */}
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsTitle}>
            {selectedCategory ? `${selectedCategory} (${filteredPoints.length})` : `All Points (${chapterData.points.length})`}
          </Text>

          {filteredPoints.map((point, index) => (
            <View key={point.id} style={styles.pointCard}>
              <View style={styles.pointHeader}>
                <Text style={styles.pointIcon}>{point.icon}</Text>
                <View style={styles.pointTitleContainer}>
                  <Text style={styles.pointTitle}>{point.title}</Text>
                  <Text style={styles.pointCategory}>{point.category}</Text>
                </View>
              </View>
              <Text style={styles.pointContent}>{point.content}</Text>
            </View>
          ))}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FF6B35',
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chapterCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  chapterPoints: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 20,
  },
  introCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 8,
  },
  introText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryContent: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  pointsContainer: {
    paddingHorizontal: 16,
  },
  pointsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  pointCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pointIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pointTitleContainer: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pointCategory: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  pointContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
