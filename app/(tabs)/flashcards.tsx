import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CLASS_9_SCIENCE, getCardsByChapter, Flashcard, Chapter } from '@/data/class9Science';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FlashcardState {
  currentCardIndex: number;
  isFlipped: boolean;
  selectedChapter: number | null;
  masteredCards: Set<string>;
  reviewCards: Set<string>;
}

export default function FlashcardsScreen() {
  const [state, setState] = useState<FlashcardState>({
    currentCardIndex: 0,
    isFlipped: false,
    selectedChapter: null,
    masteredCards: new Set(),
    reviewCards: new Set(),
  });

  const [flipAnim] = useState(new Animated.Value(0));
  const [progress, setProgress] = useState(0);

  const currentCards = state.selectedChapter
    ? getCardsByChapter(state.selectedChapter)
    : [];

  const currentCard = currentCards[state.currentCardIndex];

  useEffect(() => {
    if (currentCards.length > 0) {
      setProgress(((state.currentCardIndex + 1) / currentCards.length) * 100);
    }
  }, [state.currentCardIndex, currentCards.length]);

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: state.isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped,
    }));
  };

  const handleNext = () => {
    if (state.currentCardIndex < currentCards.length - 1) {
      setState(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        isFlipped: false,
      }));
      flipAnim.setValue(0);
    } else {
      Alert.alert('Chapter Complete!', 'You have reviewed all cards in this chapter.');
    }
  };

  const handlePrevious = () => {
    if (state.currentCardIndex > 0) {
      setState(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        isFlipped: false,
      }));
      flipAnim.setValue(0);
    }
  };

  const handleMastered = () => {
    setState(prev => {
      const newMastered = new Set(prev.masteredCards);
      newMastered.add(currentCard.id);
      return {
        ...prev,
        masteredCards: newMastered,
      };
    });
    handleNext();
  };

  const handleReview = () => {
    setState(prev => {
      const newReview = new Set(prev.reviewCards);
      newReview.add(currentCard.id);
      return {
        ...prev,
        reviewCards: newReview,
      };
    });
    handleNext();
  };

  const handleSelectChapter = (chapterId: number) => {
    setState({
      currentCardIndex: 0,
      isFlipped: false,
      selectedChapter: chapterId,
      masteredCards: new Set(),
      reviewCards: new Set(),
    });
    flipAnim.setValue(0);
  };

  const handleBackToChapters = () => {
    setState(prev => ({
      ...prev,
      selectedChapter: null,
      currentCardIndex: 0,
      isFlipped: false,
    }));
    flipAnim.setValue(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#f44336';
      default:
        return '#2196F3';
    }
  };

  if (!state.selectedChapter) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>📚 Class 9 Science</Text>
          <Text style={styles.headerSubtitle}>Interactive Flashcards</Text>
        </View>

        <FlatList
          data={CLASS_9_SCIENCE}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chapterCard}
              onPress={() => handleSelectChapter(item.id)}
            >
              <View style={styles.chapterContent}>
                <Text style={styles.chapterNumber}>Chapter {item.id}</Text>
                <Text style={styles.chapterTitle}>{item.title}</Text>
                <Text style={styles.chapterDescription}>{item.description}</Text>
                <View style={styles.cardCount}>
                  <MaterialIcons name="layers" size={16} color="#2196F3" />
                  <Text style={styles.cardCountText}>{item.cards.length} Cards</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#2196F3" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chapterList}
          scrollEnabled
        />
      </SafeAreaView>
    );
  }

  const chapter = CLASS_9_SCIENCE.find(c => c.id === state.selectedChapter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToChapters} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chapter?.title}</Text>
          <Text style={styles.headerProgress}>
            Card {state.currentCardIndex + 1} of {currentCards.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>
              {state.isFlipped ? 'ANSWER' : 'QUESTION'}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(currentCard?.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>
                {currentCard?.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              {state.isFlipped ? currentCard?.answer : currentCard?.question}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <MaterialIcons name="touch-app" size={20} color="#999" />
            <Text style={styles.tapText}>Tap to flip</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.reviewButton]}
          onPress={handleReview}
        >
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.masteredButton]}
          onPress={handleMastered}
        >
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Mastered</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, state.currentCardIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={state.currentCardIndex === 0}
        >
          <MaterialIcons name="arrow-back" size={20} color="#2196F3" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            state.currentCardIndex === currentCards.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={state.currentCardIndex === currentCards.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons name="check" size={16} color="#4CAF50" />
          <Text style={styles.statText}>Mastered: {state.masteredCards.size}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="refresh" size={16} color="#FF9800" />
          <Text style={styles.statText}>Review: {state.reviewCards.size}</Text>
        </View>
      </View>
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
    backgroundColor: '#2196F3',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
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
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  headerProgress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4CAF50',
  },
  chapterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chapterContent: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  cardCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardCountText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    minHeight: 300,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2196F3',
    letterSpacing: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 28,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  tapText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reviewButton: {
    backgroundColor: '#FF9800',
  },
  masteredButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});
