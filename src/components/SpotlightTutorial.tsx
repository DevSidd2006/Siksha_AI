import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SpotlightStep {
    title: string;
    description: string;
    targetArea?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    arrowDirection?: 'up' | 'down' | 'left' | 'right';
}

interface SpotlightTutorialProps {
    visible: boolean;
    currentStep: number;
    totalSteps: number;
    stepData: SpotlightStep;
    onNext: () => void;
    onSkip: () => void;
    onFinish: () => void;
}

export function SpotlightTutorial({
    visible,
    currentStep,
    totalSteps,
    stepData,
    onNext,
    onSkip,
    onFinish,
}: SpotlightTutorialProps) {
    const isLastStep = currentStep === totalSteps - 1;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const tooltipSlide = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            fadeAnim.setValue(0);
            tooltipSlide.setValue(30);
            pulseAnim.setValue(1);

            // Animate in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(tooltipSlide, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            // Continuous pulse for spotlight
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible, currentStep]);

    const progress = ((currentStep + 1) / totalSteps) * 100;

    // Calculate tooltip position based on target area
    const getTooltipStyle = () => {
        if (!stepData.targetArea) {
            // Center tooltip if no target
            return {
                top: SCREEN_HEIGHT / 2 - 150,
                left: 20,
                right: 20,
            };
        }

        const { x, y, width, height } = stepData.targetArea;
        const tooltipPosition = stepData.tooltipPosition || 'bottom';

        switch (tooltipPosition) {
            case 'top':
                return {
                    bottom: SCREEN_HEIGHT - y + 20,
                    left: Math.max(20, x - 100),
                    right: Math.max(20, SCREEN_WIDTH - (x + width + 100)),
                };
            case 'bottom':
                return {
                    top: y + height + 20,
                    left: Math.max(20, x - 50),
                    right: Math.max(20, SCREEN_WIDTH - (x + width + 50)),
                };
            case 'left':
                return {
                    top: y,
                    right: SCREEN_WIDTH - x + 20,
                    maxWidth: 250,
                };
            case 'right':
                return {
                    top: y,
                    left: x + width + 20,
                    maxWidth: 250,
                };
            default:
                return {
                    top: y + height + 20,
                    left: 20,
                    right: 20,
                };
        }
    };

    // Get arrow position
    const getArrowStyle = () => {
        if (!stepData.targetArea || !stepData.arrowDirection) return null;

        const { x, y, width, height } = stepData.targetArea;
        const direction = stepData.arrowDirection;

        const baseStyle = {
            position: 'absolute' as const,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid' as const,
        };

        switch (direction) {
            case 'down':
                return {
                    ...baseStyle,
                    top: y + height + 10,
                    left: x + width / 2 - 10,
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderTopWidth: 10,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: '#ffffff',
                };
            case 'up':
                return {
                    ...baseStyle,
                    bottom: SCREEN_HEIGHT - y + 10,
                    left: x + width / 2 - 10,
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderBottomWidth: 10,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: '#ffffff',
                };
            case 'right':
                return {
                    ...baseStyle,
                    top: y + height / 2 - 10,
                    left: x + width + 10,
                    borderTopWidth: 10,
                    borderBottomWidth: 10,
                    borderLeftWidth: 10,
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderLeftColor: '#ffffff',
                };
            case 'left':
                return {
                    ...baseStyle,
                    top: y + height / 2 - 10,
                    right: SCREEN_WIDTH - x + 10,
                    borderTopWidth: 10,
                    borderBottomWidth: 10,
                    borderRightWidth: 10,
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderRightColor: '#ffffff',
                };
            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onSkip}
        >
            <View style={styles.overlay}>
                {/* Dark overlay with spotlight cutout */}
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] }) }
                    ]}
                >
                    {/* Spotlight effect on target area */}
                    {stepData.targetArea && (
                        <Animated.View
                            style={[
                                styles.spotlight,
                                {
                                    top: stepData.targetArea.y - 8,
                                    left: stepData.targetArea.x - 8,
                                    width: stepData.targetArea.width + 16,
                                    height: stepData.targetArea.height + 16,
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        />
                    )}
                </Animated.View>

                {/* Arrow pointing to target */}
                {stepData.arrowDirection && getArrowStyle() && (
                    <Animated.View
                        style={[
                            getArrowStyle(),
                            { opacity: fadeAnim }
                        ]}
                    />
                )}

                {/* Tooltip */}
                <Animated.View
                    style={[
                        styles.tooltipContainer,
                        getTooltipStyle(),
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: tooltipSlide }],
                        },
                    ]}
                >
                    <View style={styles.tooltip}>
                        {/* Progress indicator */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarBackground}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${progress}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.stepCounter}>
                                {currentStep + 1}/{totalSteps}
                            </Text>
                        </View>

                        {/* Content */}
                        <Text style={styles.title}>{stepData.title}</Text>
                        <Text style={styles.description}>{stepData.description}</Text>

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={onSkip}
                                style={styles.skipButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.skipButtonText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isLastStep ? onFinish : onNext}
                                style={styles.nextButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.nextButtonText}>
                                    {isLastStep ? 'Got it! 🎉' : 'Next →'}
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
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    spotlight: {
        position: 'absolute',
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#2196F3',
        backgroundColor: 'transparent',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    tooltipContainer: {
        position: 'absolute',
        paddingHorizontal: 20,
    },
    tooltip: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    progressBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: '#E3F2FD',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 2,
    },
    stepCounter: {
        fontSize: 12,
        color: '#2196F3',
        fontWeight: '700',
        minWidth: 35,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        lineHeight: 26,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    skipButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    skipButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    nextButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    },
});
