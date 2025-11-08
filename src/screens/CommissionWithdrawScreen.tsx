import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from '../hooks/useTranslation';
import { getUser } from '../utils/TokenManager';
import api from '../utils/Api';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import SelectCustom from '../component/SelectCustom';

interface BankAccount {
  id: number;
  bank: string;
  code: string;
  logo: string;
  bankId: number;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

const CommissionWithdrawScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Helper function to format VND amounts with Vietnamese separators and suffix
  const formatVndAmount = (amount: number) => {
    try {
      return `${new Intl.NumberFormat('vi-VN').format(Math.floor(amount))} đ`;
    } catch {
      // Fallback if Intl not available
      return `${Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
    }
  };
  
  const [user, setUser] = useState<any>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [availableVnd, setAvailableVnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    Alert.alert('Thành công', message);
  };

  useEffect(() => {
    loadUserData();
    loadBankAccounts();
    loadCommissionData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.log('Error loading user:', error);
    }
  };

  const loadBankAccounts = async () => {
    try {
      const response = await api.get('/client/bank/data');
      console.log('Bank accounts:', response.data.data);
      if (response.data.status) {
        const accounts: BankAccount[] = response.data.data.map((account: any) => ({
          id: account.id,
          bank: account.bank_name || `Bank ${account.id_bank}`,
          code: account.code || '',
          logo: account.logo || '',
          bankId: account.id_bank,
          accountNumber: account.bank_number,
          accountName: account.name_ekyc,
          isDefault: account.is_default === 1,
          createdAt: account.created_at || '',
        }));
        setBankAccounts(accounts);
        
        // Auto-select default account if available
        const defaultAccount = accounts.find(acc => acc.isDefault);
        if (defaultAccount) {
          setSelectedBankId(defaultAccount.id.toString());
          setSelectedBank(`${defaultAccount.bank} - ${defaultAccount.accountNumber}`);
        }
      }
    } catch (error) {
      console.log('Error loading bank accounts:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách tài khoản ngân hàng');
    }
  };

  const loadCommissionData = async () => {
    try {
      const response = await api.get('/client/commission/data');
      if (response.data.status) {
        setAvailableVnd(response.data.kha_dung || 0);
      }
    } catch (error) {
      console.log('Error loading commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedBankId) {
      newErrors.bankAccount = 'Vui lòng chọn tài khoản ngân hàng';
    }

    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Vui lòng nhập số tiền rút';
    } else {
      const amountNum = parseFloat(amount.replace(/,/g, ''));
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Số tiền phải lớn hơn 0';
      } else if (amountNum > availableVnd) {
        newErrors.amount = `Số tiền không được vượt quá ${formatVndAmount(availableVnd)}`;
      } else if (amountNum < 2000000) {
        newErrors.amount = 'Số tiền tối thiểu là 2,000,000 đ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatAmount = (text: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Split by decimal point
    const parts = numericValue.split('.');
    
    // Format the integer part with commas
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Join back with decimal point
    return parts.join('.');
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setAmount(formatted);
    
    // Clear amount error when user starts typing
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleWithdraw = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.email) {
      Alert.alert('Lỗi', 'Không tìm thấy email người dùng');
      return;
    }

    const amountNum = parseFloat(amount.replace(/,/g, ''));
    
    Alert.alert(
      'Xác nhận rút tiền',
      `Bạn có chắc chắn muốn rút ${formatVndAmount(amountNum)} từ tài khoản hoa hồng?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => submitWithdraw(amountNum),
        },
      ]
    );
  };

  const submitWithdraw = async (amountNum: number) => {
    try {
      setSubmitting(true);
      
      const payload = {
        email: user.email,
        so_tien: amountNum,
        id_detail_bank: parseInt(selectedBankId),
      };

      console.log('Withdraw payload:', payload);
      
      const response = await api.post('/client/commission/withdraw', payload);
      
      if (response.data.status) {
        Alert.alert(
          'Thành công',
          'Yêu cầu rút tiền đã được gửi thành công. Chúng tôi sẽ xử lý trong thời gian sớm nhất.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', response.data.message || 'Có lỗi xảy ra khi gửi yêu cầu rút tiền');
      }
    } catch (error: any) {
      console.log('Withdraw error:', error);
      let errorMessage = 'Có lỗi xảy ra khi gửi yêu cầu rút tiền';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const bankAccountOptions = bankAccounts.map(account => ({
    label: account.bank,
    value: account.id.toString(),
    iconUrl: account.logo,
    subtitle: `${account.accountNumber} - ${account.accountName}`,
    searchText: `${account.bank} ${account.accountNumber} ${account.accountName}`,
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rút tiền hoa hồng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Available Balance */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Icon name="wallet" size={24} color="#007AFF" />
            <Text style={styles.balanceTitle}>Số dư khả dụng</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Số dư khả dụng', formatVndAmount(availableVnd))}>
            <Text
              style={[
                styles.balanceAmount,
                availableVnd >= 100000000 ? { fontSize: wp('4.8%') } : availableVnd >= 10000000 ? { fontSize: wp('5.2%') } : null,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatVndAmount(availableVnd)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.balanceDesc}>
            Số tiền hoa hồng có thể rút ngay
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Thông tin rút tiền</Text>
          
          {/* Bank Account Selection */}
          <View style={styles.inputContainer}>
            {bankAccounts.length === 0 ? (
              <View style={styles.emptyWalletContainer}>
                <Icon name="bank-outline" size={48} color="#CCCCCC" />
                <Text style={styles.emptyWalletTitle}>Chưa có tài khoản ngân hàng</Text>
                <Text style={styles.emptyWalletDescription}>
                  Vui lòng thêm tài khoản ngân hàng để có thể rút tiền
                </Text>
                <TouchableOpacity 
                  style={styles.addWalletButton}
                  onPress={() => navigation.navigate('BankAccounts' as never)}
                >
                  <Icon name="plus" size={20} color="#FFFFFF" />
                  <Text style={styles.addWalletText}>Thêm tài khoản ngân hàng</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <SelectCustom
                  label="Tài khoản ngân hàng *"
                  value={selectedBankId}
                  onChange={(val) => {
                    setSelectedBankId(val);
                    const b = bankAccounts.find((x) => String(x.id) === val);
                    if (b) setSelectedBank(`${b.bank} - ${b.accountNumber}`);
                    if (errors.bankAccount) {
                      setErrors(prev => ({ ...prev, bankAccount: '' }));
                    }
                  }}
                  options={bankAccountOptions}
                  placeholder={selectedBank ? selectedBank : "Chọn tài khoản ngân hàng"}
                  searchable
                  searchPlaceholder="Tìm kiếm ngân hàng"
                  containerStyle={{ marginBottom: 12 }}
                  error={errors.bankAccount}
                />

                {selectedBank ? (
                  <View style={styles.walletCard}>
                    <View style={styles.walletHeader}>
                      {(() => {
                        const selectedBankAccount = bankAccounts.find(b => String(b.id) === selectedBankId);
                        return selectedBankAccount?.logo ? (
                          <View style={styles.bankLogoContainer}>
                            <Image
                              source={{ uri: selectedBankAccount.logo }}
                              style={styles.bankLogo}
                              resizeMode="contain"
                            />
                          </View>
                        ) : (
                          <Icon name="bank" size={20} color="#4A90E2" />
                        );
                      })()}
                      <Text style={styles.walletTitle}>Tài khoản nhận tiền</Text>
                    </View>
                    <View style={styles.walletAddressContainer}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.walletAddress, { fontFamily: undefined }] }>
                          {selectedBank}
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                          {bankAccounts.find(b => String(b.id) === selectedBankId)?.accountName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(selectedBank, 'Đã sao chép thông tin ngân hàng')}
                      >
                        <Icon name="content-copy" size={16} color="#4A90E2" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.walletNote}>
                      Tiền sẽ được chuyển vào tài khoản này
                    </Text>
                  </View>
                ) : null}
              </>
            )}
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <InputCustom
              label="Số tiền rút (đ) *"
              placeholder="Nhập số tiền muốn rút"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              // leftIcon="currency"
              containerStyle={styles.input}
              error={errors.amount}
            />
            <View style={styles.amountHelper}>
              <Text style={styles.amountHelperText}>
                Tối thiểu: 2.000.000đ | Tối đa: {formatVndAmount(availableVnd)}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        {amount && !isNaN(parseFloat(amount.replace(/,/g, ''))) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt giao dịch</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Số tiền rút:</Text>
              <TouchableOpacity onPress={() => Alert.alert('Số tiền rút', formatVndAmount(parseFloat(amount.replace(/,/g, ''))))}>
                <Text
                  style={[
                    styles.summaryValue,
                    parseFloat(amount.replace(/,/g, '')) >= 100000000 ? { fontSize: wp('3.2%') } : parseFloat(amount.replace(/,/g, '')) >= 10000000 ? { fontSize: wp('3.4%') } : null,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatVndAmount(parseFloat(amount.replace(/,/g, '')))}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí xử lý:</Text>
              <Text style={styles.summaryValue}>0 đ</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Tổng cộng:</Text>
              <TouchableOpacity onPress={() => Alert.alert('Tổng cộng', formatVndAmount(parseFloat(amount.replace(/,/g, ''))))}>
                <Text
                  style={[
                    styles.summaryTotalValue,
                    parseFloat(amount.replace(/,/g, '')) >= 100000000 ? { fontSize: wp('3.4%') } : parseFloat(amount.replace(/,/g, '')) >= 10000000 ? { fontSize: wp('3.6%') } : null,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatVndAmount(parseFloat(amount.replace(/,/g, '')))}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Important Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Lưu ý quan trọng</Text>
          <View style={styles.notesList}>
            <View style={styles.noteItem}>
              <Icon name="information" size={16} color="#FFA000" />
              <Text style={styles.noteText}>
                Yêu cầu rút tiền sẽ được xử lý trong vòng 24-48 giờ làm việc
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="shield-check" size={16} color="#4CAF50" />
              <Text style={styles.noteText}>
                Tiền sẽ được chuyển vào tài khoản ngân hàng đã chọn
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="alert-circle" size={16} color="#FF5722" />
              <Text style={styles.noteText}>
                Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <ButtonCustom
          title={submitting ? "Đang xử lý..." : "Rút tiền ngay"}
          onPress={handleWithdraw}
          disabled={submitting || !selectedBankId || !amount || availableVnd <= 0}
          loading={submitting}
          style={{
            ...styles.submitButton,
            opacity: submitting || !selectedBankId || !amount || availableVnd <= 0 ? 0.2 : 1
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: wp('4.6%'),
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  balanceTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111',
  },
  balanceAmount: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  balanceDesc: {
    fontSize: wp('3.2%'),
    color: '#666',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
  },
  addAccountText: {
    fontSize: wp('3.4%'),
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyWalletContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyWalletTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyWalletDescription: {
    fontSize: wp('3.2%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  addWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addWalletText: {
    color: '#FFFFFF',
    fontSize: wp('3.6%'),
    fontWeight: '600',
  },
  walletCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  bankLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  bankLogo: {
    width: 24,
    height: 24,
  },
  walletTitle: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#333',
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: wp('3.4%'),
    color: '#333',
    fontWeight: '500',
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#E3F2FD',
  },
  walletNote: {
    fontSize: wp('3%'),
    color: '#666',
    fontStyle: 'italic',
  },
  amountHelper: {
    marginTop: 8,
  },
  amountHelperText: {
    fontSize: wp('3%'),
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: wp('3.6%'),
    color: '#666',
  },
  summaryValue: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#111',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#111',
  },
  summaryTotalValue: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#007AFF',
  },
  notesCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  notesTitle: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  notesList: {
    gap: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: wp('3.4%'),
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  submitButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

export default CommissionWithdrawScreen;
