import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import { parseCCCDQR, validateCCCDData, CCCDQRData } from '../utils/cccdQrParser';
import LoadingOverlay from './LoadingOverlay';

interface CCCDQRScannerProps {
  onScanSuccess: (data: CCCDQRData) => void;
  onClose: () => void;
  visible: boolean;
}

const { width, height } = Dimensions.get('window');

const CCCDQRScanner: React.FC<CCCDQRScannerProps> = ({ onScanSuccess, onClose, visible }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && codes[0].value && isActive && !isProcessing) {
        handleQRScan(codes[0].value);
      }
    }
  });

  const handleQRScan = useCallback(async (qrData: string) => {
    setIsProcessing(true);
    setIsActive(false);

    try {
      // Parse QR data
      const parseResult = parseCCCDQR(qrData);
      
      if (!parseResult.success) {
        Alert.alert(
          'Lỗi quét QR',
          parseResult.error || 'Không thể đọc thông tin từ mã QR CCCD',
          [
            {
              text: 'Thử lại',
              onPress: () => {
                setIsActive(true);
                setIsProcessing(false);
              }
            },
            {
              text: 'Đóng',
              onPress: onClose
            }
          ]
        );
        return;
      }

      // Validate parsed data
      const validation = validateCCCDData(parseResult.data!);
      
      if (!validation.isValid) {
        Alert.alert(
          'Thông tin không hợp lệ',
          validation.errors.join('\n'),
          [
            {
              text: 'Thử lại',
              onPress: () => {
                setIsActive(true);
                setIsProcessing(false);
              }
            },
            {
              text: 'Đóng',
              onPress: onClose
            }
          ]
        );
        return;
      }

      // Confirm with user before auto-filling
      Alert.alert(
        'Xác nhận thông tin',
        `Họ tên: ${parseResult.data!.name}\nSố CCCD: ${parseResult.data!.id}\nNgày sinh: ${parseResult.data!.dob}\n\nBạn có muốn sử dụng thông tin này để điền form đăng ký không?`,
        [
          {
            text: 'Không',
            style: 'cancel',
            onPress: () => {
              setIsActive(true);
              setIsProcessing(false);
            }
          },
          {
            text: 'Có',
            onPress: () => {
              onScanSuccess(parseResult.data!);
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Lỗi xử lý',
        'Có lỗi xảy ra khi xử lý dữ liệu QR code',
        [
          {
            text: 'Thử lại',
            onPress: () => {
              setIsActive(true);
              setIsProcessing(false);
            }
          },
          {
            text: 'Đóng',
            onPress: onClose
          }
        ]
      );
    }
  }, [onScanSuccess, onClose]);

  const handleRequestPermission = useCallback(async () => {
    try {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Quyền truy cập camera',
          'Vui lòng cấp quyền truy cập camera trong cài đặt để sử dụng tính năng quét QR CCCD.',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      Alert.alert('Lỗi', 'Không thể yêu cầu quyền truy cập camera');
    }
  }, [requestPermission, onClose]);

  const handleClose = useCallback(() => {
    setIsActive(false);
    setIsProcessing(false);
    onClose();
  }, [onClose]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {isProcessing && (
          <LoadingOverlay 
            visible={true} 
            message="Đang xử lý thông tin CCCD..." 
          />
        )}

        {hasPermission === false ? (
          <View style={styles.permissionContainer}>
            <View style={styles.permissionContent}>
              <Icon name="camera-off" size={80} color={theme.colors.textLight} />
              <Text style={styles.permissionTitle}>Cần quyền truy cập camera</Text>
              <Text style={styles.permissionText}>
                Để quét mã QR CCCD, ứng dụng cần quyền truy cập camera của bạn.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handleRequestPermission}
              >
                <Text style={styles.permissionButtonText}>Cấp quyền</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        ) : device == null ? (
          <View style={styles.permissionContainer}>
            <View style={styles.permissionContent}>
              <Icon name="camera-off" size={80} color={theme.colors.textLight} />
              <Text style={styles.permissionTitle}>Không tìm thấy camera</Text>
              <Text style={styles.permissionText}>
                Thiết bị của bạn không có camera hoặc camera không hoạt động.
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              codeScanner={codeScanner}
              enableZoomGesture
            />
            
            {/* Overlay with scanning area */}
            <View style={[StyleSheet.absoluteFill, styles.overlay]}>
              <View style={styles.unfocusedContainer} />
              <View style={styles.focusedContainer}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.focusedBox}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View style={styles.unfocusedContainer} />
              </View>
              <View style={styles.unfocusedContainer} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
                <Icon name="close" size={24} color={theme.colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Quét mã QR CCCD</Text>
              <View style={styles.headerButton} />
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionsCard}>
                <Icon name="qrcode-scan" size={24} color={theme.colors.primary} />
                <Text style={styles.instructionsTitle}>Hướng dẫn quét</Text>
                <Text style={styles.instructionsText}>
                  1. Đặt mã QR trên CCCD vào khung quét{'\n'}
                  2. Đảm bảo mã QR rõ nét và đủ ánh sáng{'\n'}
                  3. Giữ yên thiết bị để quét tự động
                </Text>
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <View style={styles.tipItem}>
                <Icon name="lightbulb-outline" size={16} color={theme.colors.warning} />
                <Text style={styles.tipText}>Đảm bảo ánh sáng đủ và mã QR không bị mờ</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  permissionButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  focusedContainer: {
    flexDirection: 'row',
    height: 250,
  },
  focusedBox: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
  },
  instructionsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadow,
  },
  instructionsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  instructionsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  tipText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: theme.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CCCDQRScanner;
