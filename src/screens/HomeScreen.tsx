import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import LoadingOverlay from '../component/LoadingOverlay';
import OrderModal from '../component/OrderModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackScreen } from '../navigation/types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../utils/Api';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

const MAX_VND_AMOUNT = 999999999999; // 1 tỷ VND
const MAX_USDT_AMOUNT = 999999.99; // 1 triệu USDT

// Fallback rate nếu API fail
const FALLBACK_RATE = 26450;

const formatMoney = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';

  // Giới hạn số chữ số thập phân
  const formatted = num.toLocaleString('vi-VN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });


  return formatted;
};

const formatNumber = (num: string | number) => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0.00';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};



interface WalletData {
  id: number;
  client_id: number;
  name: string;
  address_wallet: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}

interface BankAccountData {
  id: number;
  id_bank: number;
  name_ekyc: string;
  bank_number: string;
  is_default: number;
  created_at: string;
  updated_at: string;
  bank_name?: string;
  bank_code?: string;
}

const HomeScreen: StackScreen<'Home'> = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [binanceRate, setBinanceRate] = useState(0);
  const [rateBuy, setRateBuy] = useState(0);
  const [rateSell, setRateSell] = useState(0);
  const [fee, setFee] = useState(0);
  const [balanceVnd, setBalanceVnd] = useState(0);
  const [balanceUsdt, setBalanceUsdt] = useState(0);
  const [minUsdtTransaction, setMinUsdtTransaction] = useState(0);
  const [min_phi_giao_dich, setMin_phi_giao_dich] = useState(0);
  const [phi_can_bang, setPhi_can_bang] = useState(0);
  const [phi_vip, setPhi_vip] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false); // true = nhập số muốn nhận, false = nhập số muốn đổi
  const [countdown, setCountdown] = useState(20); // Countdown 20 giây
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [is_checkfetch_rate, setIsCheckFetchRate] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderModalType, setOrderModalType] = useState<'vip' | 'recharge'>('vip');


  // Function to fetch rate from your backend API
  const fetchExchangeRate = async () => {
    setIsCheckFetchRate(true);
    try {
      const response = await api.get('/vip/action/exchange/rate');
      const data = response.data;

      console.log('Exchange rate response:', data);

      if (data.rate_buy && !isNaN(parseFloat(data.rate_buy))) {
        setRateBuy(parseFloat(data.rate_buy));
        console.log('Rate buy updated:', data.rate_buy);
      }

      if (data.rate_sell && !isNaN(parseFloat(data.rate_sell))) {
        setRateSell(parseFloat(data.rate_sell));
        console.log('Rate sell updated:', data.rate_sell);
      }

      if (data.rate && !isNaN(parseFloat(data.rate))) {
        if (!data.rate_buy && !data.rate_sell) {
          setRateBuy(parseFloat(data.rate));
          setRateSell(parseFloat(data.rate));
          console.log('Rate updated from API (legacy):', data.rate);
        }
      }

      if (data.fee && !isNaN(parseFloat(data.fee))) {
        setFee(parseFloat(data.fee));
        console.log('Fee updated:', data.fee);
      }
      if (data.balance_vnd && !isNaN(parseFloat(data.balance_vnd))) {
        setBalanceVnd(999999999999);
        console.log('Balance VND:', data.balance_vnd);
      }
      if (data.balance_usdt && !isNaN(parseFloat(data.balance_usdt))) {
        setBalanceUsdt(999999.99);
        console.log('Balance USDT:', data.balance_usdt);
      }
      if (data.min_usdt_giao_dich && !isNaN(parseFloat(data.min_usdt_giao_dich))) {
        setMinUsdtTransaction(1);
        console.log('Min USDT transaction:', data.min_usdt_giao_dich);
      }
      if (data.phi_can_bang && !isNaN(parseFloat(data.phi_can_bang))) {
        setPhi_can_bang(parseFloat(data.phi_can_bang));
        console.log('Phi can bang updated:', data.phi_can_bang);
      }
      if (data.phi_vip && !isNaN(parseFloat(data.phi_vip))) {
        setPhi_vip(parseFloat(data.phi_vip));
        console.log('Phi VIP updated:', data.phi_vip);
      }
      if (data.min_phi_giao_dich && !isNaN(parseFloat(data.min_phi_giao_dich))) {
        setMin_phi_giao_dich(parseFloat(data.min_phi_giao_dich));
        console.log('Min phi giao dich updated:', data.min_phi_giao_dich);
      }

      if (!data.rate_buy && !data.rate_sell && !data.rate) {
        throw new Error('Invalid rate format');
      }

    } catch (error) {
      console.log('API failed, using fallback rate:', error);
      Alert.alert('Error', 'Lỗi khi lấy tỷ giá');
      setRateBuy(FALLBACK_RATE);
      setRateSell(FALLBACK_RATE);
      setBinanceRate(FALLBACK_RATE);
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'buy' && rateBuy > 0) {
      setBinanceRate(rateBuy);
    } else if (activeTab === 'sell' && rateSell > 0) {
      setBinanceRate(rateSell);
    }
  }, [activeTab, rateBuy, rateSell]);

  useFocusEffect(
    React.useCallback(() => {
      setCountdown(20);
      fetchExchangeRate();

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            fetchExchangeRate();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }, [])
  );


  const formatAmountForDisplay = (amount: string) => {
    if (!amount || amount === '0') return '0';
    // Remove existing commas
    const cleanAmount = amount.replace(/,/g, '');

    const isInputtingVND = (activeTab === 'buy' && !isSwapped) || (activeTab === 'sell' && isSwapped);
    const isInputtingUSDT = (activeTab === 'sell' && !isSwapped) || (activeTab === 'buy' && isSwapped);
    if (isInputtingVND) {
      return cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (isInputtingUSDT) {
      const parts = cleanAmount.split('.');
      if (parts.length === 2) {
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
      }
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return cleanAmount;
  };

  const getAmountFontSize = (amount: string) => {
    if (!amount || amount === '0') return wp("20%");

    const cleanAmount = amount.replace(/,/g, '');
    const length = cleanAmount.length;

    // More granular font size adjustment
    if (length <= 6) return wp("20%");
    if (length <= 8) return wp("16%");
    if (length <= 10) return wp("12%");
    if (length <= 12) return wp("10%");
    if (length <= 13) return wp("10%");
    if (length <= 14) return wp("6%");
    return wp("6%");
  };

  const handleNumberPress = (num: string) => {
    if (num === '.' && amount.includes('.')) return;

    // Remove commas from current amount for processing
    const cleanAmount = amount.replace(/,/g, '');
    const newAmount = cleanAmount + num;

    // Kiểm tra định dạng số theo loại tiền tệ và chế độ swap
    let isValidFormat = false;
    const isInputtingVND = (activeTab === 'buy' && !isSwapped) || (activeTab === 'sell' && isSwapped);
    const isInputtingUSDT = (activeTab === 'sell' && !isSwapped) || (activeTab === 'buy' && isSwapped);

    if (isInputtingVND) {
      // VND: chỉ cho phép số nguyên
      isValidFormat = /^\d+$/.test(newAmount);
    } else if (isInputtingUSDT) {
      // USDT: cho phép tối đa 2 chữ số thập phân
      isValidFormat = /^\d*\.?\d{0,2}$/.test(newAmount);
    }

    if (isValidFormat) {
      const numValue = parseFloat(newAmount);
      if (!isNaN(numValue)) {
        // Check limit by input currency type (considering swap)
        const maxAmount = isInputtingVND ? MAX_VND_AMOUNT : MAX_USDT_AMOUNT;
        if (numValue > maxAmount) {
          Alert.alert(
            'Notification',
            isInputtingVND
              ? 'Maximum VND amount is 999,999,999,999'
              : 'Maximum USDT amount is 999,999.99'
          );
          return;
        }

        // Always set the amount, let formatAmountForDisplay handle the formatting
        setAmount(newAmount);
      }
    }
  };

  const handleDelete = () => {
    // Remove commas before processing
    const cleanAmount = amount.replace(/,/g, '');
    const newAmount = cleanAmount.slice(0, -1);
    setAmount(newAmount);
  };
  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    setAmount(''); // Clear amount when swapping
  };

  const handleVipOrder = () => {
    if (!amount || parseFloat(amount.replace(/,/g, '')) === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập số tiền');
      return;
    }
    setOrderModalType('vip');
    setShowOrderModal(true);
  };

  const handleRechargeOrder = () => {
    if (!amount || parseFloat(amount.replace(/,/g, '')) === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập số tiền');
      return;
    }
    setOrderModalType('recharge');
    setShowOrderModal(true);
  };

  const calculateVipFee = (): string => {
    const cleanAmount = amount.replace(/,/g, '');
    const numAmount = parseFloat(cleanAmount);
    if (isNaN(numAmount) || numAmount <= 0) return '0';

    // Lệnh VIP: USDT × tỷ giá × (100 ± phi_vip%)
    // Mua: cộng phí (100 + phi_vip), Bán: trừ phí (100 - phi_vip)
    const currentRate = activeTab === 'buy' ? rateBuy : rateSell;
    const vndAmount = numAmount * currentRate;
    
    if (activeTab === 'buy') {
      // Mua: cộng phí
      const calculatedFee = vndAmount * ((100 + phi_vip) / 100);
      return calculatedFee.toFixed(2);
    } else {
      // Bán: trừ phí
      const calculatedFee = vndAmount * ((100 - phi_vip) / 100);
      return calculatedFee.toFixed(2);
    }
  };

  const calculateRechargeFee = (): string => {
    const cleanAmount = amount.replace(/,/g, '');
    const numAmount = parseFloat(cleanAmount);
    if (isNaN(numAmount) || numAmount <= 0) return '0';

    // Lệnh nạp: USDT × tỷ giá ± phi_can_bang
    // Mua: cộng phí (+), Bán: trừ phí (-)
    const currentRate = activeTab === 'buy' ? rateBuy : rateSell;
    const vndAmount = numAmount * currentRate;
    
    if (activeTab === 'buy') {
      // Mua: cộng phí
      const calculatedFee = vndAmount + phi_can_bang;
      return calculatedFee.toFixed(2);
    } else {
      // Bán: trừ phí
      const calculatedFee = vndAmount - phi_can_bang;
      return calculatedFee.toFixed(2);
    }
  };

    const handleOrderConfirm = (inputAmount: string) => {
    console.log('Order confirmed:', inputAmount, 'orderType:', orderModalType);
    // Close modal and reset amount after successful order
    setShowOrderModal(false);
    setAmount(''); // Reset amount after successful order
  };


  // Check if user can perform transaction based on tab and requirements
  const canPerformTransaction = () => {

    // Kiểm tra số tiền trong phạm vi cho phép
    const cleanAmount = amount.replace(/,/g, '');
    const numAmount = parseFloat(cleanAmount);

    if (!cleanAmount || numAmount <= 0) return false;

    // Xác định loại tiền tệ đang nhập
    const isInputtingVND = (activeTab === 'buy' && !isSwapped) || (activeTab === 'sell' && isSwapped);
    const isInputtingUSDT = (activeTab === 'sell' && !isSwapped) || (activeTab === 'buy' && isSwapped);
    // Kiểm tra giới hạn tối thiểu
    if (minUsdtTransaction > 0) {
      if (isInputtingUSDT && numAmount < minUsdtTransaction) {
        return false;
      }
      if (isInputtingVND) {
        const currentRate = activeTab === 'buy' ? rateBuy : rateSell;
        if (currentRate > 0) {
          const minVndAmount = minUsdtTransaction * currentRate;
          if (numAmount < minVndAmount) {
            return false;
          }
        }
      }
    }
    if (activeTab === 'buy') {
      // Khi mua USDT: luôn kiểm tra balance VND
      if (balanceVnd > 0) {
        if (isInputtingVND) {
          // Nhập VND trực tiếp: kiểm tra VND balance
          if (numAmount > balanceVnd) {
            return false;
          }
        } else if (isInputtingUSDT) {
          // Swap nhập USDT: chuyển đổi USDT sang VND để kiểm tra
          const currentRate = rateBuy;
          if (currentRate > 0) {
            const vndAmount = numAmount * currentRate;
            if (vndAmount > balanceVnd) {
              return false;
            }
          }
        }
      }
    } else {
      // Khi bán USDT: luôn kiểm tra balance USDT
      if (balanceUsdt > 0) {
        if (isInputtingUSDT) {
          // Nhập USDT trực tiếp: kiểm tra USDT balance
          if (numAmount > balanceUsdt) {
            return false;
          }
        } else if (isInputtingVND) {
          // Swap nhập VND: chuyển đổi VND sang USDT để kiểm tra
          const currentRate = rateSell;
          if (currentRate > 0) {
            const usdtAmount = numAmount / currentRate;
            if (usdtAmount > balanceUsdt) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  // Get specific error message for amount validation
  const getAmountErrorMessage = () => {
    const cleanAmount = amount.replace(/,/g, '');
    const numAmount = parseFloat(cleanAmount);

    if (!cleanAmount || numAmount <= 0) return '';

    // Xác định loại tiền tệ đang nhập
    const isInputtingVND = (activeTab === 'buy' && !isSwapped) || (activeTab === 'sell' && isSwapped);
    const isInputtingUSDT = (activeTab === 'sell' && !isSwapped) || (activeTab === 'buy' && isSwapped);

    // Kiểm tra giới hạn tối thiểu
    if (minUsdtTransaction > 0) {
      if (isInputtingUSDT && numAmount < minUsdtTransaction) {
        return `${t('home.validation.amountTooLow')} (${minUsdtTransaction} USDT)`;
      }

      if (isInputtingVND) {
        const currentRate = activeTab === 'buy' ? rateBuy : rateSell;
        if (currentRate > 0) {
          const minVndAmount = minUsdtTransaction * currentRate;
          if (numAmount < minVndAmount) {
            return `${t('home.validation.amountTooLow')} (${minVndAmount.toLocaleString('vi-VN')} VND)`;
          }
        }
      }
    }
    if (is_checkfetch_rate) {
      return `Lỗi khi lấy tỷ giá`;
    }

    if (activeTab === 'buy') {
      // Khi mua USDT: luôn kiểm tra balance VND
      if (balanceVnd > 0) {
        if (isInputtingVND) {
          // Nhập VND trực tiếp: kiểm tra VND balance
          if (numAmount > balanceVnd) {
            return `${t('home.validation.amountTooHigh')} (${balanceVnd.toLocaleString('vi-VN')} VND)`;
          }
        } else if (isInputtingUSDT) {
          // Swap nhập USDT: chuyển đổi USDT sang VND để kiểm tra
          const currentRate = rateBuy;
          if (currentRate > 0) {
            const vndAmount = numAmount * currentRate;
            if (vndAmount > balanceVnd) {
              const maxUsdt = balanceVnd / currentRate;
              return `${t('home.validation.amountTooHigh')} (${maxUsdt.toFixed(2)} USDT)`;
            }
          }
        }
      }
    } else {
      if (balanceUsdt > 0) {
        if (isInputtingUSDT) {
          if (numAmount > balanceUsdt) {
            return `${t('home.validation.amountTooHigh')} (${balanceUsdt} USDT)`;
          }
        } else if (isInputtingVND) {
          const currentRate = rateSell;
          if (currentRate > 0) {
            const usdtAmount = numAmount / currentRate;
            if (usdtAmount > balanceUsdt) {
              const maxVnd = balanceUsdt * currentRate;
              return `${t('home.validation.amountTooHigh')} (${maxVnd.toLocaleString('vi-VN')} VND)`;
            }
          }
        }
      }
    }

    return '';
  };

  const getButtonText = () => {
    const amountError = getAmountErrorMessage();
    if (amountError) {
      return amountError;
    }

    return activeTab === 'buy' ? "Lệnh VIP Mua" : "Lệnh VIP Bán";
  };

  const handleAction = () => {
    const cleanAmount = amount.replace(/,/g, '');
    if (!cleanAmount || parseFloat(cleanAmount) === 0) return;

    const amountError = getAmountErrorMessage();
    if (amountError) {
      Alert.alert(t('home.validation.invalidAmount'), amountError);
      return;
    }

    let finalAmount = cleanAmount;
    let finalType = activeTab;

    if (isSwapped) {
      if (activeTab === 'buy') {
        const usdtAmount = parseFloat(cleanAmount);
        const vndAmount = (usdtAmount * binanceRate).toString();
        finalAmount = vndAmount;
        finalType = 'buy';
      } else {
        const vndAmount = parseFloat(cleanAmount);
        const usdtAmount = (vndAmount / binanceRate).toFixed(2);
        finalAmount = usdtAmount;
        finalType = 'sell';
      }
    }

    navigation.navigate('Payment', {
      paymentInfo: {
        type: finalType,
        amount: finalAmount,
        rate: binanceRate,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isLoadingRate}
        message={t('common.loading')}
      />
      {/* Buy/Sell Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.activeTab]}
          onPress={() => {
            setActiveTab('buy');
            setAmount('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.activeTabText]}>
            {t('home.vndToUsdt')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.activeTab]}
          onPress={() => {
            setActiveTab('sell');
            setAmount('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.activeTabText]}>
            {t('home.usdtToVnd')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Refresh Loading Overlay */}
        <LoadingOverlay
          visible={isRefreshing}
          message={t('common.loading')}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Amount Display */}
          <View style={styles.topSection}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountZero, { fontSize: getAmountFontSize(amount) }]}>
                {formatAmountForDisplay(amount)}
              </Text>
              <Text style={styles.amountLabel}>
                {isSwapped
                  ? (activeTab === 'buy' ? 'USDT' : 'VND')
                  : (activeTab === 'buy' ? 'VND' : 'USDT')
                }
              </Text>
            </View>

            {/* Exchange Rate */}
            <View style={styles.exchangeContainer}>
              <View style={styles.exchangeRow}>
                <Text style={styles.exchangeAmount}>
                  ≈ {amount ? (
                    isSwapped
                      ? (activeTab === 'buy'
                        ? `${(parseFloat(amount.replace(/,/g, '')) * binanceRate).toLocaleString('vi-VN')} VND`
                        : `${(parseFloat(amount.replace(/,/g, '')) / binanceRate).toFixed(2)} USDT`
                      )
                      : (activeTab === 'buy'
                        ? `${(parseFloat(amount.replace(/,/g, '')) / binanceRate).toFixed(2)} USDT`
                        : `${(parseFloat(amount.replace(/,/g, '')) * binanceRate).toLocaleString('vi-VN')} VND`
                      )
                  ) : (
                    isSwapped
                      ? (activeTab === 'buy' ? '0 VND' : '0 USDT')
                      : (activeTab === 'buy' ? '0 USDT' : '0 VND')
                  )}
                </Text>
                <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                  <Icon style={{ color: "black" }} name="swap-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.rateContainer}>
                <Text style={styles.exchangeRate}>
                  1 USDT = {binanceRate.toLocaleString('vi-VN')} VND ({countdown}s)
                </Text>
                {/* Hiển thị thông tin balance và giới hạn */}
              </View>

            </View>
          </View>

          <View style={styles.bottomSection}>
            {/* Number Pad */}
            <View style={styles.numberPad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0].map((num, index) => (
                <TouchableOpacity
                  key={`numpad-${activeTab}-${index}`}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.numberButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Icon name="backspace-outline" size={24} color="#666" />
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>

        {/* Action Buttons Container */}
        <View style={styles.actionButtonsContainer}>
          {/* Lệnh VIP Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              (!amount || parseFloat(amount.replace(/,/g, '')) === 0 || !canPerformTransaction()) && styles.actionButtonDisabled
            ]}
            onPress={handleVipOrder}
            disabled={!amount || parseFloat(amount.replace(/,/g, '')) === 0 || !canPerformTransaction()}
          >
            <Text style={styles.actionButtonText}>
              Lệnh VIP
            </Text>
          </TouchableOpacity>
          {/* Lệnh Nạp Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              (!amount || parseFloat(amount.replace(/,/g, '')) === 0 || !canPerformTransaction()) && styles.actionButtonDisabled
            ]}
            onPress={handleRechargeOrder}
            disabled={!amount || parseFloat(amount.replace(/,/g, '')) === 0 || !canPerformTransaction()}
          >
            <Text style={styles.actionButtonText}>
              Lệnh Nạp
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Modal */}
      <OrderModal
        visible={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={orderModalType === 'vip' ? 'Lệnh VIP' + (activeTab === 'buy' ? ' Mua' : ' Bán') : 'Lệnh Nạp' + (activeTab === 'buy' ? ' Mua' : ' Bán')}
        buttonText="Xác nhận"
        onConfirm={handleOrderConfirm}
        orderType={orderModalType}
        initialAmount={amount}
        feeInfo={{
          usdtAmount: amount,
          currentRate: activeTab === 'buy' ? rateBuy : rateSell,
          phi_vip: orderModalType === 'vip' ? phi_vip : undefined,
          phi_can_bang: orderModalType === 'recharge' ? phi_can_bang : undefined,
          activeTab: activeTab,
          min_phi_giao_dich: min_phi_giao_dich
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    margin: 16,
    borderRadius: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    minHeight: hp("30%"),
    marginBottom: hp("3%"),
  },
  bottomSection: {
    paddingBottom: hp("2%"),
  },
  amountContainer: {
    alignItems: 'flex-start',
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    paddingLeft: 20,
  },
  amountZero: {
    fontWeight: '300',
    color: '#000000',
    // fontSize will be set dynamically
  },
  amountLabel: {
    fontSize: wp("8%"),
    color: '#666',
    marginTop: -8,
  },
  exchangeContainer: {
    alignItems: 'flex-start',
    marginTop: hp("2%"),
    paddingLeft: 20,
  },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 20,
  },
  exchangeAmount: {
    fontSize: wp("5%"),
    color: '#666',
    marginBottom: 4,
    flex: 1,
  },
  swapButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1d37e',
    marginLeft: 10,
  },
  rateContainer: {
    flexDirection: 'column',
  },
  exchangeRate: {
    fontSize: wp("4%"),
    color: '#666',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countdownText: {
    fontSize: wp("3%"),
    color: '#999',
    marginRight: 8,
  },
  balanceInfoContainer: {
    marginTop: 8,
    // paddingHorizontal: 4,
  },
  balanceText: {
    fontSize: wp("3%"),
    color: '#666',
    marginBottom: 2,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp("2%"),
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quickAmountText: {
    fontSize: wp("3.5%"),
    color: '#000',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp("2%"),
    paddingHorizontal: 20,
  },
  numberButton: {
    width: '30%',
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  numberText: {
    fontSize: wp("6%"),
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 0,
  },
  confirmButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: wp("4%"),
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: wp("4%"),
    fontWeight: '600',
    textAlign: 'center',
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  verificationText: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: wp("3%"),
    fontWeight: '600',
  },
  statusBanner: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  warningText: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: '#FF9500',
    marginLeft: 8,
    fontWeight: '500',
  },
  warningButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  warningButtonText: {
    color: '#FFFFFF',
    fontSize: wp("3%"),
    fontWeight: '600',
  },
});

export default HomeScreen;