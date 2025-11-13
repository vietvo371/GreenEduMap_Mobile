import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AlertService } from '../services/AlertService';
import { theme } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const AlertDemoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Custom Alert Demo</Text>
        <Text style={styles.subheader}>
          Test các loại alert mới thay thế Alert.alert mặc định
        </Text>

        {/* Success Alert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Alert</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            onPress={() => {
              AlertService.success(
                'Thành công',
                'Giao dịch đã được thực hiện thành công!'
              );
            }}
          >
            <Text style={styles.buttonText}>Hiển thị Success</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            onPress={() => {
              AlertService.success(
                'Đăng nhập thành công',
                'Chào mừng bạn quay trở lại!',
                [
                  { text: 'Xem profile', onPress: () => console.log('View profile') },
                  { text: 'Đóng', style: 'cancel' },
                ]
              );
            }}
          >
            <Text style={styles.buttonText}>Success với 2 buttons</Text>
          </TouchableOpacity>
        </View>

        {/* Error Alert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Error Alert</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={() => {
              AlertService.error(
                'Lỗi',
                'Không thể kết nối đến server. Vui lòng thử lại sau.'
              );
            }}
          >
            <Text style={styles.buttonText}>Hiển thị Error</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={() => {
              AlertService.error(
                'Phiên đăng nhập hết hạn',
                'Vui lòng đăng nhập lại để tiếp tục',
                [
                  { text: 'Đăng nhập', onPress: () => console.log('Login') },
                ]
              );
            }}
          >
            <Text style={styles.buttonText}>Error với callback</Text>
          </TouchableOpacity>
        </View>

        {/* Warning Alert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warning Alert</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.warning }]}
            onPress={() => {
              AlertService.warning(
                'Cảnh báo',
                'Số dư tài khoản của bạn đang thấp. Vui lòng nạp thêm tiền.'
              );
            }}
          >
            <Text style={styles.buttonText}>Hiển thị Warning</Text>
          </TouchableOpacity>
        </View>

        {/* Info Alert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info Alert</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.info }]}
            onPress={() => {
              AlertService.info(
                'Thông báo bảo trì',
                'Hệ thống sẽ được bảo trì vào 2h sáng ngày 15/11. Thời gian dự kiến: 2 giờ.'
              );
            }}
          >
            <Text style={styles.buttonText}>Hiển thị Info</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Alert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Confirm Dialog</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              AlertService.confirm(
                'Xác nhận xóa',
                'Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác.',
                () => {
                  // User confirmed
                  AlertService.success('Đã xóa', 'Tài khoản đã được xóa thành công');
                },
                () => {
                  // User cancelled
                  console.log('User cancelled');
                }
              );
            }}
          >
            <Text style={styles.buttonText}>Confirm Dialog</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              AlertService.confirm(
                'Xác nhận thanh toán',
                'Bạn có muốn thanh toán 1,000,000 VNĐ cho đơn hàng này?',
                () => {
                  AlertService.success('Thành công', 'Thanh toán đã được thực hiện!');
                }
              );
            }}
          >
            <Text style={styles.buttonText}>Confirm Thanh toán</Text>
          </TouchableOpacity>
        </View>

        {/* Multiple Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Buttons</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              AlertService.alert(
                'Lưu thay đổi?',
                'Bạn có muốn lưu các thay đổi trước khi thoát?',
                [
                  { text: 'Không lưu', onPress: () => console.log('Discard') },
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Lưu', onPress: () => console.log('Save') },
                ],
                'confirm'
              );
            }}
          >
            <Text style={styles.buttonText}>3 Buttons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={() => {
              AlertService.alert(
                'Xóa tài khoản',
                'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tài khoản?',
                [
                  { text: 'Hủy', style: 'cancel' },
                  { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: () => AlertService.success('Đã xóa', 'Tài khoản đã được xóa')
                  },
                ],
                'warning'
              );
            }}
          >
            <Text style={styles.buttonText}>Destructive Button</Text>
          </TouchableOpacity>
        </View>

        {/* Alert without animation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Không có Animation</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#666' }]}
            onPress={() => {
              AlertService.alert(
                'Alert đơn giản',
                'Alert này không có animation Lottie',
                [{ text: 'OK' }],
                'info'
              );
            }}
          >
            <Text style={styles.buttonText}>Alert không animation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thiết kế tối ưu cho iOS
          </Text>
          <Text style={styles.footerSubtext}>
            Thay thế Alert.alert mặc định
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subheader: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  footerSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});

export default AlertDemoScreen;

