import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import QRCode from './QRCode';
import Clipboard from '@react-native-clipboard/clipboard';

export interface ReferralShareBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  inviteLink: string;
  invitedCount?: number;
  onShare?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ReferralShareBottomSheet: React.FC<ReferralShareBottomSheetProps> = ({
  visible,
  onClose,
  inviteLink,
  invitedCount = 0,
  onShare,
}) => {
  const handleCopy = () => Clipboard.setString(inviteLink);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [openId, setOpenId] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      setOpenId(prev => prev + 1);
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal key={`referral-share-${openId}`} visible={modalVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.grabber} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Liên kết giới thiệu của bạn</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.qrBox}>
            <QRCode value={inviteLink} size={wp('55%')} quietZone={8} />
          </View>
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>{inviteLink}</Text>
            <TouchableOpacity style={styles.circleBtn} onPress={handleCopy}><Icon name="content-copy" size={16} color="#4A90E2" /></TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={onShare}><Icon name="share-variant" size={16} color="#4A90E2" /></TouchableOpacity>
          </View>

          {/* <View style={styles.invitedBox}>
            <Text style={styles.invitedLabel}>Bạn bè được mời</Text>
            <View style={styles.invitedPill}><Text style={styles.invitedCount}>{invitedCount}</Text></View>
          </View> */}

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  backdrop: { flex: 1 },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: SCREEN_HEIGHT * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: { paddingTop: 8, alignItems: 'center' },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E5EA', marginBottom: 8 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  title: { fontSize: wp('4%'), fontWeight: '700', color: '#000', textAlign: 'center', flex: 1 },
  closeButton: { padding: 6 },
  qrBox: { alignItems: 'center', paddingVertical: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F4F4F6', padding: 12, borderRadius: 12 },
  linkText: { flex: 1, color: '#000' },
  circleBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF2FF' },
  invitedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EDF5FF', padding: 12, borderRadius: 12, marginTop: 12 },
  invitedLabel: { color: '#333' },
  invitedPill: { minWidth: 36, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#FFF' },
  invitedCount: { color: '#000', fontWeight: '700', textAlign: 'center' },
  sheetNote: { color: '#666', marginTop: 10, textAlign: 'center', fontSize: wp('3.4%') },
});

export default ReferralShareBottomSheet;


