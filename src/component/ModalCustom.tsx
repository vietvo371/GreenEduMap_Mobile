import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Animated, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme, ICON_SIZE, MODAL_CONSTANTS, STATUS_COLORS, ANIMATION } from "../theme";

interface ModalCustomProps {
    isModalVisible: boolean;
    setIsModalVisible: (isModalVisible: boolean) => void;
    title: string;
    children: React.ReactNode;
    isAction?: boolean;
    isClose?: boolean;
    onPressAction?: () => void;
    actionText?: string;
    closeText?: string;
    type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
}

const ModalCustom = ({
    isModalVisible,
    setIsModalVisible,
    title,
    children,
    isAction = true,
    isClose = true,
    onPressAction,
    actionText = 'Xác nhận',
    closeText = 'Hủy',
    type = 'confirm'
}: ModalCustomProps) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isModalVisible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    ...ANIMATION.spring,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: ANIMATION.timing.normal,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: ANIMATION.timing.fast,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: ANIMATION.timing.fast,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isModalVisible]);

    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'check-circle', color: STATUS_COLORS.success };
            case 'error':
                return { name: 'close-circle', color: STATUS_COLORS.error };
            case 'warning':
                return { name: 'alert-circle', color: STATUS_COLORS.warning };
            case 'info':
                return { name: 'information', color: STATUS_COLORS.info };
            case 'confirm':
                return { name: 'help-circle', color: theme.colors.primary };
            default:
                return { name: 'information', color: theme.colors.primary };
        }
    };

    const iconConfig = getIconConfig();

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            statusBarTranslucent
        >
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setIsModalVisible(false)}
                />
                <Animated.View
                    style={[
                        styles.modalContent,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: `${iconConfig.color}15` }]}>
                        <Icon name={iconConfig.name} size={ICON_SIZE.xxxl} color={iconConfig.color} />
                    </View>

                    {/* Title */}
                    <Text style={styles.modalTitle}>{title}</Text>

                    {/* Content */}
                    <View style={styles.modalBody}>
                        {children}
                    </View>

                    {/* Buttons */}
                    <View style={styles.modalFooter}>
                        {isClose && (
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                style={styles.buttonClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.buttonCloseText}>{closeText}</Text>
                            </TouchableOpacity>
                        )}
                        {isAction && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (onPressAction) {
                                        onPressAction();
                                    }
                                    setIsModalVisible(false);
                                }}
                                style={[styles.buttonAction, { backgroundColor: iconConfig.color }]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.buttonActionText}>{actionText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxWidth: MODAL_CONSTANTS.maxWidth,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    iconContainer: {
        width: MODAL_CONSTANTS.iconSize,
        height: MODAL_CONSTANTS.iconSize,
        borderRadius: MODAL_CONSTANTS.iconBorderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    modalBody: {
        width: '100%',
        marginBottom: theme.spacing.lg,
    },
    modalFooter: {
        width: '100%',
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    buttonClose: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.disabled,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCloseText: {
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.md,
        fontWeight: '600',
    },
    buttonAction: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActionText: {
        color: theme.colors.white,
        fontSize: theme.typography.fontSize.md,
        fontWeight: '700',
    },
});

export default ModalCustom;
