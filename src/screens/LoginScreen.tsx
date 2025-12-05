import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AlertService } from '../services/AlertService';
import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  theme,
  wp,
  hp,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  ICON_SIZE,
} from '../theme';
import { useAuth } from '../contexts/AuthContext';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import LanguageSelector from '../component/LanguageSelector';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate password (API requires minimum 8 characters)
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Call signIn from AuthContext with email and password
      const result = await signIn({
        email: email,
        password: password,
      });

      if (result.success) {
        console.log('Login successful:', result);
        // Login successful - navigate to main tabs
        navigation.navigate('MainTabs');
      } else {
        // Handle errors
        if (result.errors) {
          console.log('Login errors:', result.errors);
          setErrors(result.errors);
        } else if (result.error) {
          AlertService.error(
            'Đăng nhập thất bại',
            result.error
          );
        }
      }
    } catch (error: any) {
      console.log('Login error:', error);
      AlertService.error(
        'Đăng nhập thất bại',
        error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    AlertService.info('Sắp ra mắt', `Đăng nhập ${provider} sẽ sớm có sẵn`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Header Icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Image
              source={require('../assets/images/logo_vietnam.jpg')}
              style={styles.languageFlag}
            />
          </TouchableOpacity>
        </View>

        <LanguageSelector
          visible={showLanguageSelector}
          onClose={() => setShowLanguageSelector(false)}
          onSelect={(code: string) => {
            console.log('Selected language:', code);
          }}
          currentLanguage="vi"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View
            style={styles.headerContainer}
            entering={FadeInDown.duration(600).springify()}
          >
            <Animated.Text
              style={styles.welcomeText}
              entering={FadeInDown.duration(800).delay(200).springify()}
            >
              Chào mừng trở lại
            </Animated.Text>

            <Animated.Text
              style={styles.title}
              entering={FadeInDown.duration(800).delay(400).springify()}
            >
              GreenEduMap
            </Animated.Text>

            <Animated.Text
              style={styles.subtitle}
              entering={FadeInDown.duration(800).delay(600).springify()}
            >
              Đăng nhập để bắt đầu hành trình xanh
            </Animated.Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={styles.formContainer}
            entering={SlideInDown.duration(800).delay(800).springify()}
          >
             <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Đăng nhập</Text>
              <Text style={styles.formSubtitle}>
                Đăng nhập để báo cáo và theo dõi sự cố đô thị
              </Text>
            </View>

              <View style={styles.form}>
                <InputCustom
                  label="Email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  required
                  leftIcon="email-outline"
                  containerStyle={styles.input}
                />
              <InputCustom
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                required
                leftIcon="lock-outline"
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                containerStyle={styles.input}
              />

              {/* Remember Me & Forgot Password Row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={ICON_SIZE.md}
                    color={rememberMe ? theme.colors.success : theme.colors.textLight}
                  />
                  <Text style={styles.rememberMeText}>
                    Nhớ mật khẩu
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>

              <ButtonCustom
                title="Đăng nhập"
                onPress={handleLogin}
                style={styles.loginButton}
                icon="login"
              />

              {/* Social Login */}
              {/* <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.7}
                >
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('Facebook')}
                  activeOpacity={0.7}
                >
                  <Icon name="whatsapp" size={24} color="#4267B2" />
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={() => handleSocialLogin('Apple')}
                    activeOpacity={0.7}
                  >
                    <Icon name="apple" size={24} color="#000000" />
                  </TouchableOpacity>
                )}
              </View> */}
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={styles.footerContainer}
            entering={FadeInUp.duration(600).delay(1200).springify()}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Chưa có tài khoản?{' '}
                <Text style={styles.registerLinkText}>
                  Đăng ký ngay
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Icon name="shield-check" size={ICON_SIZE.xs} color={theme.colors.success} />
              <Text style={styles.securityText}>
                Dữ liệu được bảo mật và mã hóa
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={loading}
        message="Đang đăng nhập..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  headerIcons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp('9%') : hp('4%'),
    right: SPACING.lg,
    flexDirection: 'column',
    gap: SPACING.md,
    zIndex: 1,
  },
  headerIconButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  languageFlag: {
    width: ICON_SIZE.md,
    height: ICON_SIZE.md,
    borderRadius: ICON_SIZE.md / 2,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: hp('-6%'),
    right: wp('-12%'),
    width: wp('37.5%'),
    height: wp('37.5%'),
    borderRadius: wp('18.75%'),
    backgroundColor: theme.colors.success + '15',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: hp('-4%'),
    left: wp('-7.5%'),
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    backgroundColor: theme.colors.environmental + '15',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: hp('8%'),
    paddingBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZE.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
    marginBottom: SPACING.xs,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: FONT_SIZE['4xl'],
    color: theme.colors.success,
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: FONT_SIZE.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: FONT_SIZE.md * 1.5,
    paddingHorizontal: SPACING.lg,
  },

  // Form Styles
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: FONT_SIZE['2xl'],
    fontWeight: 'bold',
    color: theme.colors.success,
    marginBottom: SPACING.xs,
  },
  formSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },

  input: {
    marginBottom: SPACING.lg,
  },
  loginButton: {
    marginBottom: SPACING.md,
    height: hp('7%'),
  },

  // Options Row (Remember Me & Forgot Password)
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rememberMeText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
  },

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  registerLink: {
    paddingVertical: SPACING.sm,
  },
  registerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: FONT_SIZE.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  registerLinkText: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: theme.colors.success + '10',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: wp('10%'),
    borderWidth: 1,
    borderColor: theme.colors.success + '20',
  },
  securityText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    flex: 1,
  },
});

export default LoginScreen;
