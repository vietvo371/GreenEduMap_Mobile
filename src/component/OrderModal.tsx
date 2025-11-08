import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clipboard from '@react-native-clipboard/clipboard';
import api from '../utils/Api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  buttonText: string;
  onConfirm: (amount: string) => void;
  isLoading?: boolean;
  transactionId?: string; // Transaction ID to display after success
  orderType?: 'vip' | 'recharge'; // Type of order
  initialAmount?: string; // Initial amount from HomeScreen
  feeInfo?: { // Information to calculate fee
    usdtAmount: string;
    currentRate: number;
    phi_vip?: number;
    phi_can_bang?: number;
    activeTab: 'buy' | 'sell';
    min_phi_giao_dich?: number;
  };
}

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onClose,
  title,
  buttonText,
  onConfirm,
  isLoading = false,
  transactionId,
  orderType,
  initialAmount = '',
  feeInfo,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [openId, setOpenId] = useState<number>(0);
  
  const [currentTransactionId, setCurrentTransactionId] = useState<string>('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  // Update amount when initialAmount changes
  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

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

  // Calculate fee based on order type
  const calculateFee = () => {
    if (!feeInfo || !amount) return { usdtAmount: 0, totalVND: 0, feeVND: 0, min_phi_giao_dich: 0 };
    
    const cleanAmount = amount.replace(/,/g, '');
    let numAmount = parseFloat(cleanAmount);
    if (isNaN(numAmount) || numAmount <= 0) return { usdtAmount: 0, totalVND: 0, feeVND: 0 };

    const { currentRate, phi_vip, phi_can_bang, activeTab, min_phi_giao_dich } = feeInfo;
    
    // USDT amount (after conversion if needed)
    const usdtAmount = numAmount;
    const vndAmount = usdtAmount * currentRate;

    if (orderType === 'vip' && phi_vip !== undefined) {
      // Lệnh VIP
      let totalVND = 0;
      if (activeTab === 'buy') {
        totalVND = vndAmount * (100 + phi_vip) / 100;
        console.log('totalVND buy', totalVND);
      } else {
        totalVND = vndAmount * ((100 - phi_vip) / 100);
        console.log('totalVND sell', totalVND);
      }
      const feeVND = Math.max(Math.abs(totalVND - vndAmount), min_phi_giao_dich || 0);
      console.log('vndAmount', vndAmount);
      console.log('feeVND', feeVND);
      return { usdtAmount, totalVND, feeVND };
    } else if (orderType === 'recharge' && phi_can_bang !== undefined) {
      // Lệnh nạp
      let totalVND = 0;
      if (activeTab === 'buy') {
        totalVND = vndAmount + phi_can_bang;
      } else {
        totalVND = vndAmount - phi_can_bang;
      }
      return { usdtAmount, totalVND, feeVND: phi_can_bang };
    }

    return { usdtAmount, totalVND: 0, feeVND: 0 };
  };

  const feeData = calculateFee();

  // Format number for USDT with comma separator
  const formatAmount = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    if (!numericValue) return '';
    
    // Handle empty string
    if (numericValue === '') return '';
    
    // Allow only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // Add commas for thousands separator only if there are digits
    if (parts.length === 1) {
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (parts.length === 2) {
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    }
    
    return numericValue;
  };

  const handleAmountChange = (value: string) => {
    // Remove currency symbols and commas if user types them
    const cleanValue = value.replace(/[$,]/g, '');
    const formatted = formatAmount(cleanValue);
    setAmount(formatted);
  };

  const handleConfirm = async () => {
    if (!amount.trim()) return;
    
    setIsCreatingOrder(true);
    try {
      const cleanAmount = amount.replace(/,/g, '');
      const usdtAmount = parseFloat(cleanAmount);
      
      const payload = {
        type: feeInfo?.activeTab === 'buy' ? 2 : 1, // 1: BAN_USDT, 2: MUA_USDT
        amount_usdt: usdtAmount
      };
      
      let apiEndpoint = '';
      let orderTypeText = '';
      
      if (orderType === 'vip') {
        apiEndpoint = '/vip/action/create-giao-dich-vip';
        orderTypeText = 'lệnh VIP';
      } else if (orderType === 'recharge') {
        apiEndpoint = '/vip/action/create-giao-dich-can-bang';
        orderTypeText = 'lệnh cân bằng';
      }
      
      console.log(`${orderTypeText} payload:`, payload);
      
      const response = await api.post(apiEndpoint, payload);
      
      if (response.data && response.data.status) {
        const transactionId = response.data.data;
        console.log(`${orderTypeText} created, transactionId:`, transactionId);
        
        setCurrentTransactionId(transactionId);
        Alert.alert('Thành công', response.data.message || `Tạo ${orderTypeText} thành công!`);
        
        // Call parent callback
        // onConfirm(cleanAmount);
      } else {
        Alert.alert('Lỗi', response.data?.message || `Tạo ${orderTypeText} thất bại`);
      }
    } catch (error: any) {
      console.log('Order confirmation error:', error);
      
      let errorMessage = 'Lỗi khi tạo lệnh. Vui lòng thử lại.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleClose = () => {
    setAmount(initialAmount);
    setCurrentTransactionId('');
    onClose();
  };

  const handleCopyTransactionId = () => {
    const txId = currentTransactionId || transactionId;
    if (txId) {
      Clipboard.setString(txId);
      Alert.alert('Đã sao chép', 'Mã giao dịch đã được sao chép');
    }
  };

  if (!modalVisible) return null;

  return (
    <Modal key={`order-modal-${openId}`} visible={modalVisible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.grabber} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Fee Information Display */}
            {feeInfo && amount && (
              <View style={styles.feeInfoContainer}>
                <View style={styles.feeInfoRow}>
                  <Text style={styles.feeInfoLabel}>USDT cần {feeInfo.activeTab === 'buy' ? 'mua' : 'bán'}:</Text>
                  <Text style={styles.feeInfoValue}>
                    {feeData.usdtAmount.toFixed(0)} USDT
                  </Text>
                </View>
                <View style={styles.feeInfoRow}>
                  <Text style={styles.feeInfoLabel}>Tỷ giá:</Text>
                  <Text style={styles.feeInfoValue}>
                    {feeInfo.currentRate.toLocaleString('vi-VN')} VND/USDT
                  </Text>
                </View>
                <View style={styles.feeInfoRow}>
                  <Text style={styles.feeInfoLabel}>
                    {orderType === 'vip' ? 'Phí VIP' : 'Phí cân bằng'}:
                  </Text>
                  <Text style={styles.feeInfoValue}>
                    {parseFloat(feeData.feeVND.toFixed(0)).toLocaleString('vi-VN')} VND
                  </Text>
                </View>
                <View style={styles.feeDivider} />
                <View style={styles.feeInfoRow}>
                  <Text style={styles.feeInfoTotalLabel}>Tổng tiền:</Text>
                  <Text style={styles.feeInfoTotalValue}>
                    {parseFloat(feeData.totalVND.toFixed(0)).toLocaleString('vi-VN')} VND
                  </Text>
                </View>
              </View>
            )}

            {/* Transaction ID Display */}
            {(currentTransactionId || transactionId) && (
              <View style={styles.transactionContainer}>
                <Text style={styles.transactionLabel}>Mã UUID VIP</Text>
                <View style={styles.transactionInputContainer}>
                  <TextInput
                    style={styles.transactionInput}
                    value={currentTransactionId || transactionId}
                    editable={false}
                    selectTextOnFocus={true}
                  />
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={handleCopyTransactionId}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="content-copy" size={18} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                (!amount.trim() || isLoading || isCreatingOrder) && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirm}
              disabled={!amount.trim() || isLoading || isCreatingOrder}
            >
              <Text style={styles.confirmButtonText}>
                {isLoading || isCreatingOrder ? 'Đang xử lý...' : buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  backdrop: { 
    flex: 1 
  },
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
  header: { 
    paddingTop: 8, 
    alignItems: 'center' 
  },
  grabber: { 
    width: 40, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#E5E5EA', 
    marginBottom: 8 
  },
  titleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  title: { 
    fontSize: wp('4%'), 
    fontWeight: '700', 
    color: '#000', 
    textAlign: 'center', 
    flex: 1 
  },
  closeButton: { 
    padding: 6 
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: 12,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 50, // Space for clear button
    fontSize: wp('4.5%'),
    color: '#000',
    backgroundColor: '#F8F9FA',
    textAlign: 'center',
  },
  currencyText: {
    position: 'absolute',
    right: 16,
    fontSize: wp('4.5%'),
    color: '#666',
    fontWeight: '500',
  },
  clearButton: {
    position: 'absolute',
    right: 50,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeInfoContainer: {
    marginTop: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  feeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeInfoLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontWeight: '500',
  },
  feeInfoValue: {
    fontSize: wp('3.5%'),
    color: '#000',
    fontWeight: '600',
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
  feeInfoTotalLabel: {
    fontSize: wp('4%'),
    color: '#000',
    fontWeight: '600',
  },
  feeInfoTotalValue: {
    fontSize: wp('4%'),
    color: '#000',
    fontWeight: '700',
  },
  transactionContainer: {
    marginTop: 20,
  },
  transactionLabel: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: 8,
    fontWeight: '600',
  },
  transactionInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: wp('3.5%'),
    color: '#000',
    backgroundColor: '#F8F9FA',
    fontFamily: 'monospace',
  },
  copyButton: {
    position: 'absolute',
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    fontSize: wp('4%'),
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default OrderModal;
