import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Import quiz data
let CLASS_9_SCIENCE_QUIZ: any[] = [];
try {
  const quizData = require('@/data/class9ScienceQuiz');
  CLASS_9_SCIENCE_QUIZ = quizData.CLASS_9_SCIENCE_QUIZ || [];
  console.log('Quiz data loaded:', CLASS_9_SCIENCE_QUIZ.length, 'questions');
} catch (error) {
  console.error('Failed to load quiz data:', error);
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizState {
  selectedChapter: number | null;
  currentQuestionIndex: number;
  answers: QuizResult[];
  quizStarted: boolean;
  quizCompleted: boolean;
  showResults: boolean;
}

export default function QuizScreen() {
  const [state, setState] = useState<QuizState>({
    selectedChapter: null,
    currentQuestionIndex: 0,
    answers: [],
    quizStarted: false,
    quizCompleted: false,
    showResults: false,
  });

  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Helper functions
  const calculateQuizScore = (results: QuizResult[]) => {
    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    return { correct, total, percentage };
  };

  const getPerformanceLevel = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 45) return 'Below Average';
    return 'Needs Improvement';
  };

  const getQuestionsByChapter = (chapterId: number) => {
    if (!CLASS_9_SCIENCE_QUIZ || CLASS_9_SCIENCE_QUIZ.length === 0) {
      console.warn('Quiz data not available:', CLASS_9_SCIENCE_QUIZ);
      return [];
    }
    const filtered = CLASS_9_SCIENCE_QUIZ.filter(q => q.chapter === chapterId);
    console.log(`Questions for chapter ${chapterId}:`, filtered.length);
    return filtered;
  };

  const chapters = [
    { id: 1, title: 'Matter in Our Surroundings', questions: 6 },
    { id: 2, title: 'Is Matter Around Us Pure', questions: 6 },
    { id: 3, title: 'Atoms and Molecules', questions: 6 },
  ];

  const currentQuestions = state.selectedChapter
    ? getQuestionsByChapter(state.selectedChapter)
    : [];

  const currentQuestion = currentQuestions[state.currentQuestionIndex];

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleSkipQuestion();
    }
  }, [timeLeft, timerActive]);

  const handleStartQuiz = (chapterId: number) => {
    setState({
      selectedChapter: chapterId,
      currentQuestionIndex: 0,
      answers: [],
      quizStarted: true,
      quizCompleted: false,
      showResults: false,
    });
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const newAnswer: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: optionIndex,
      isCorrect,
      timeSpent: 30 - timeLeft,
    };

    setState(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));

    if (state.currentQuestionIndex < currentQuestions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setTimeLeft(30);
    } else {
      setTimerActive(false);
      setState(prev => ({
        ...prev,
        quizCompleted: true,
        showResults: true,
      }));
    }
  };

  const handleSkipQuestion = () => {
    const newAnswer: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: -1,
      isCorrect: false,
      timeSpent: 30,
    };

    setState(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));

    if (state.currentQuestionIndex < currentQuestions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setTimeLeft(30);
    } else {
      setTimerActive(false);
      setState(prev => ({
        ...prev,
        quizCompleted: true,
        showResults: true,
      }));
    }
  };

  const handleRetakeQuiz = () => {
    setState({
      selectedChapter: state.selectedChapter,
      currentQuestionIndex: 0,
      answers: [],
      quizStarted: true,
      quizCompleted: false,
      showResults: false,
    });
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleBackToChapters = () => {
    setState({
      selectedChapter: null,
      currentQuestionIndex: 0,
      answers: [],
      quizStarted: false,
      quizCompleted: false,
      showResults: false,
    });
    setTimerActive(false);
  };

  const score = calculateQuizScore(state.answers);
  const performanceLevel = getPerformanceLevel(score.percentage);

  if (!state.selectedChapter) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 Class 9 Science Quiz</Text>
          <Text style={styles.headerSubtitle}>Test Your Knowledge</Text>
        </View>

        <FlatList
          data={chapters}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chapterCard}
              onPress={() => handleStartQuiz(item.id)}
            >
              <View style={styles.chapterContent}>
                <Text style={styles.chapterNumber}>Chapter {item.id}</Text>
                <Text style={styles.chapterTitle}>{item.title}</Text>
                <View style={styles.questionCount}>
                  <MaterialIcons name="quiz" size={16} color="#FF6B35" />
                  <Text style={styles.questionCountText}>{item.questions} Questions</Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#FF6B35" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chapterList}
          scrollEnabled
        />
      </SafeAreaView>
    );
  }

  if (state.showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToChapters} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Results</Text>
        </View>

        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{score.correct}/{score.total}</Text>
            <Text style={styles.scorePercentage}>{score.percentage.toFixed(1)}%</Text>
            <View
              style={[
                styles.performanceBadge,
                {
                  backgroundColor:
                    score.percentage >= 90
                      ? '#4CAF50'
                      : score.percentage >= 75
                      ? '#FF9800'
                      : '#f44336',
                },
              ]}
            >
              <Text style={styles.performanceText}>{performanceLevel}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Performance Details</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.detailLabel}>Correct</Text>
                <Text style={styles.detailValue}>{score.correct}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="cancel" size={24} color="#f44336" />
                <Text style={styles.detailLabel}>Incorrect</Text>
                <Text style={styles.detailValue}>{score.total - score.correct}</Text>
              </View>
            </View>
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>Review Your Answers</Text>
            {state.answers.map((answer, index) => {
              const question = CLASS_9_SCIENCE_QUIZ.find(q => q.id === answer.questionId);
              return (
                <View key={index} style={styles.reviewItem}>
                  <View
                    style={[
                      styles.reviewIndicator,
                      { backgroundColor: answer.isCorrect ? '#4CAF50' : '#f44336' },
                    ]}
                  >
                    <MaterialIcons
                      name={answer.isCorrect ? 'check' : 'close'}
                      size={16}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.reviewContent}>
                    <Text style={styles.reviewQuestion}>{question?.question}</Text>
                    <Text style={styles.reviewAnswer}>
                      Your answer: {question?.options[answer.selectedAnswer] || 'Skipped'}
                    </Text>
                    {!answer.isCorrect && (
                      <Text style={styles.correctAnswer}>
                        Correct: {question?.options[question.correctAnswer]}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.retakeButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton2} onPress={handleBackToChapters}>
            <MaterialIcons name="home" size={20} color="#FF6B35" />
            <Text style={styles.backButtonText}>Back to Chapters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (state.quizStarted) {
    // If no questions loaded, show error
    if (!currentQuestion || currentQuestions.length === 0) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToChapters} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <MaterialIcons name="error-outline" size={64} color="#FF6B35" />
            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>
              Unable to load questions
            </Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' }}>
              Please try again or select a different chapter
            </Text>
            <TouchableOpacity 
              style={{ marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#FF6B35', borderRadius: 8 }}
              onPress={handleBackToChapters}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Back to Chapters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const progress = ((state.currentQuestionIndex + 1) / currentQuestions.length) * 100;
    const isAnswered = state.answers.some(a => a.questionId === currentQuestion.id);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToChapters} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Question {state.currentQuestionIndex + 1}</Text>
            <Text style={styles.headerProgress}>
              {state.currentQuestionIndex + 1} of {currentQuestions.length}
            </Text>
          </View>
          <View style={styles.timerBadge}>
            <MaterialIcons name="timer" size={16} color="#fff" />
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView style={styles.questionContainer} contentContainerStyle={styles.questionContent}>
          <View style={styles.questionCard}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{currentQuestion.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = state.answers.some(
                a => a.questionId === currentQuestion.id && a.selectedAnswer === index
              );
              const isCorrect = index === currentQuestion.correctAnswer;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && (isCorrect ? styles.optionCorrect : styles.optionIncorrect),
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  <View
                    style={[
                      styles.optionIndicator,
                      isSelected && (isCorrect ? styles.indicatorCorrect : styles.indicatorIncorrect),
                    ]}
                  >
                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                  {isSelected && isCorrect && <MaterialIcons name="check-circle" size={20} color="#4CAF50" />}
                  {isSelected && !isCorrect && <MaterialIcons name="cancel" size={20} color="#f44336" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {isAnswered && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Explanation</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </ScrollView>

        {isAnswered && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, state.currentQuestionIndex === 0 && styles.navButtonDisabled]}
              disabled={state.currentQuestionIndex === 0}
              onPress={() => {
                setState(prev => ({
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex - 1,
                }));
                setTimeLeft(30);
              }}
            >
              <MaterialIcons name="arrow-back" size={20} color="#FF6B35" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>

            {state.currentQuestionIndex < currentQuestions.length - 1 ? (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  setState(prev => ({
                    ...prev,
                    currentQuestionIndex: prev.currentQuestionIndex + 1,
                  }));
                  setTimeLeft(30);
                }}
              >
                <Text style={styles.navButtonText}>Next</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FF6B35" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.finishButton]}
                onPress={() => {
                  setTimerActive(false);
                  setState(prev => ({
                    ...prev,
                    quizCompleted: true,
                    showResults: true,
                  }));
                }}
              >
                <Text style={styles.finishButtonText}>Finish Quiz</Text>
                <MaterialIcons name="check" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {!isAnswered && (
          <View style={styles.skipContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipQuestion}>
              <Text style={styles.skipButtonText}>Skip Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return null;
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
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FF6B35',
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
    borderLeftColor: '#FF6B35',
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
    color: '#FF6B35',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  questionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questionCountText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  questionCard: {
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
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B35',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    gap: 12,
  },
  optionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  optionIncorrect: {
    borderColor: '#f44336',
    backgroundColor: '#FFEBEE',
  },
  optionIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8e8e8',
  },
  indicatorCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  indicatorIncorrect: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  explanationCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#0D47A1',
    lineHeight: 20,
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
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  skipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  scorePercentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  performanceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  performanceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  detailsCard: {
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
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  reviewCard: {
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
  reviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  reviewIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    flex: 1,
  },
  reviewQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  reviewAnswer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});
