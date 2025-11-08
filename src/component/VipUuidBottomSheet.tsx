import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  Alert,
  Keyboard,
  AppState,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import LoadingOverlay from './LoadingOverlay';
import api from '../utils/Api';
import { useTranslation } from '../hooks/useTranslation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const UUID_LENGTH = 16;

export interface VipUuidBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onVerified: (payload: { uuid: string; response?: any }) => void;
  title?: string;
  message?: string;
}

const VipUuidBottomSheet: React.FC<VipUuidBottomSheetProps> = ({
  visible,
  onClose,
  onVerified,
  title,
  message,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [uuid, setUuid] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasVerified, setHasVerified] = useState<boolean>(false);
  const [openId, setOpenId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const openIdRef = React.useRef<number>(0);

  // Reset helpers
  const resetState = () => {
    setUuid('');
    setHasVerified(false);
    setError('');
  };

  useEffect(() => {
    if (visible) {
      setOpenId(prev => prev + 1);
      openIdRef.current = openIdRef.current + 1;
      setModalVisible(true);
      // Keep current uuid when reopening; only clear flags
      setHasVerified(false);
      setError('');
      
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();

      // Try auto-fill from clipboard on open
      setTimeout(() => {
        tryAutofillFromClipboard();
      }, 300);
    } else if (modalVisible) {
      closeModal();
    }
  }, [visible]);

  // No auto-verify on complete; user must press Verify

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      resetState();
    });
  };

  const handleClose = () => {
    if (loading) return;
    
    Keyboard.dismiss();
    closeModal();
    onClose();
  };

  const handleUuidChange = (text: string) => {
    if (loading) return;
    
    // Clear error when user starts typing
    if (error) setError('');
    if (hasVerified) setHasVerified(false);
    
    // Only allow alphanumeric characters and limit to UUID_LENGTH
    const cleanText = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleanText.length <= UUID_LENGTH) {
      setUuid(cleanText);
    }
  };

  const tryAutofillFromClipboard = async () => {
    try {
      const clip = await Clipboard.getString();
      if (!clip) return;
      const clean = clip.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (clean.length >= UUID_LENGTH) {
        const code = clean.slice(0, UUID_LENGTH);
        setUuid(code);
      } else if (clean.length > 0) {
        setUuid(clean);
      }
    } catch (_) {
      // ignore
    }
  };

  // Auto check clipboard when app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && modalVisible && !loading && !hasVerified && !error) {
        tryAutofillFromClipboard();
      }
    });
    return () => {
      // @ts-ignore
      sub?.remove?.();
    };
  }, [modalVisible, loading, hasVerified, error]);

  const handleVerify = async () => {
    if (uuid.length !== UUID_LENGTH || hasVerified || loading) return;
    
    setHasVerified(true);
    setLoading(true);
    
    try {
      const response = await api.post('/client/vip/giao-dich-vip', {
        hash_uuid: uuid,
      });
      console.log('response verify vip', response);
      if (response?.data?.status === false) {
        const errorMessage = response?.data?.message || t('vip.uuidFailed');
        setError(errorMessage);
        setHasVerified(false);
        return;
      }
      onVerified({ uuid, response: response?.data });
      handleClose();
    } catch (error: any) {
      // console.log('error verify vip', error.response);
      console.log('error?.response?.data?.errors', error?.response?.data?.errors);
      const errorMessage = error?.response?.data?.message || error?.message || t('vip.uuidFailed');
      if (error?.response?.status === 422) {
        setError(error?.response?.data?.errors?.message?.[0] || t('vip.uuidFailed'));
        setHasVerified(false);
        return;
      }
      setError(errorMessage);
      setHasVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const resetUuidInput = () => {
    setHasVerified(false);
    setUuid('');
    setError('');
  };

  const headerTitle = title || t('vip.enterUuid');
  const headerMessage = message || t('vip.uuidPlaceholder');

  const isUuidComplete = uuid.length === UUID_LENGTH;

  if (!modalVisible) return null;

  return (
    <Modal
      key={`uuid-modal-${openId}`}
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
          disabled={loading}
        />

        {/* Modal Content */}
        <Animated.View 
          style={[
            styles.modalContent, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.grabber} />
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{headerTitle}</Text>
              <TouchableOpacity 
                onPress={handleClose} 
                style={styles.closeButton}
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={24} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          {/* UUID Input Field */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <TextInput
                style={styles.uuidInput}
                value={uuid}
                onChangeText={handleUuidChange}
                placeholder={t('vip.uuidPlaceholder')}
                placeholderTextColor="#999"
                maxLength={UUID_LENGTH}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!loading}
                selectTextOnFocus={true}
                contextMenuHidden={false}
              />
              <TouchableOpacity
                onPress={tryAutofillFromClipboard}
                disabled={loading}
                style={{ paddingHorizontal: 8, paddingVertical: 6 }}
                activeOpacity={0.7}
              >
                <Icon name="content-paste" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.inputHint}>
              {uuid.length}/{UUID_LENGTH} {t('vip.uuidLength')}
            </Text>
          </View>

          {/* VIP Benefits Info */}
          {/* <View style={styles.benefitsContainer}>
            <View style={styles.benefitsHeader}>
              <Icon name="crown" size={20} color="#FFD700" />
              <Text style={styles.benefitsTitle}>{t('vip.vipBenefits')}</Text>
            </View>
            <Text style={styles.benefitsText}>{t('vip.vipBenefitsDescription')}</Text>
          </View> */}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.clearButton]} 
              onPress={resetUuidInput}
              disabled={loading || !uuid}
              activeOpacity={0.7}
            >
              <Icon name="refresh" size={20} color={theme.colors.textLight} />
              <Text style={styles.clearButtonText}>{t('verifyOtpBottomSheet.clear')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.verifyButton,
                (!isUuidComplete || loading) && styles.verifyButtonDisabled
              ]} 
              onPress={handleVerify}
              disabled={!isUuidComplete || loading}
              activeOpacity={0.7}
            >
              <Icon 
                name="check" 
                size={20} 
                color={(!isUuidComplete || loading) ? theme.colors.textLight : theme.colors.white} 
              />
              <Text style={[
                styles.verifyButtonText,
                (!isUuidComplete || loading) && styles.verifyButtonTextDisabled
              ]}>
                {loading ? t('vip.verifyingUuid') : t('vip.verifyUuid')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} message={t('vip.verifyingUuid')} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: SCREEN_HEIGHT * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: 16,
  },
  header: {
    paddingTop: theme.spacing.md,
    // paddingBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    paddingHorizontal: theme.spacing.lg,
    marginTop: 6,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    // fontSize: theme.typography.fontSize.md,
    // fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  uuidInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'monospace',
    color: theme.colors.text,
    letterSpacing: 2,
    paddingVertical: theme.spacing.sm,
  },
  inputIcon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: '#FF6B6B',
    marginTop: theme.spacing.xs,
    marginLeft: 4,
    textAlign: 'center',
  },
  inputHint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  benefitsContainer: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  benefitsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  benefitsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  clearButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  verifyButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  verifyButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontWeight: '600',
  },
  verifyButtonTextDisabled: {
    color: theme.colors.textLight,
  },
});

export default VipUuidBottomSheet;
