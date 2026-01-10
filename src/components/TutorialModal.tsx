import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TutorialStep {
    title: string;
    description: string;
    highlightArea?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

interface TutorialModalProps {
    visible: boolean;
    currentStep: number;
    totalSteps: number;
    stepData: TutorialStep;
    onNext: () => void;
    onSkip: () => void;
    onFinish: () => void;
}

export function TutorialModal({
    visible,
    currentStep,
    totalSteps,
    stepData,
    onNext,
    onSkip,
    onFinish,
}: TutorialModalProps) {
    const isLastStep = currentStep === totalSteps - 1;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            scaleAnim.setValue(0.9);

            // Animate in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, currentStep]);

    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onSkip}
        >
            <View style={styles.overlay}>
                {/* Darkened background with gradient effect */}
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: fadeAnim }
                    ]}
                />

                {/* Tooltip */}
                <Animated.View
                    style={[
                        styles.tooltipContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    <View style={styles.tooltip}>
                        {/* Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${progress}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.stepIndicator}>
                                {currentStep + 1} / {totalSteps}
                            </Text>
                        </View>

                        {/* Content */}
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>{stepData.title}</Text>
                            <Text style={styles.description}>{stepData.description}</Text>
                        </View>

                        {/* Dots Indicator */}
                        <View style={styles.dotsContainer}>
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === currentStep && styles.dotActive,
                                        index < currentStep && styles.dotCompleted
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={onSkip}
                                style={styles.skipButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.skipButtonText}>Skip Tour</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isLastStep ? onFinish : onNext}
                                style={styles.nextButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.nextButtonText}>
                                    {isLastStep ? '🎉 Get Started!' : 'Next →'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    tooltipContainer: {
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
    },
    tooltip: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    progressBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#E3F2FD',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 3,
    },
    stepIndicator: {
        fontSize: 12,
        color: '#2196F3',
        fontWeight: '700',
        minWidth: 40,
        textAlign: 'right',
    },
    contentContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        lineHeight: 30,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    dotActive: {
        backgroundColor: '#2196F3',
        width: 24,
    },
    dotCompleted: {
        backgroundColor: '#4CAF50',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    skipButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    skipButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    nextButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },
});
