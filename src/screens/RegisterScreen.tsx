import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();

  const initialFormData = {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    re_password: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setPasswordStrength(0);
    setCurrentStep(1);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const validateStep1 = () => {
    const emailError = validateField('email', formData.email);
    const phoneError = validateField('phone', formData.phone);

    const newErrors = {
      ...(emailError ? { email: emailError } : {}),
      ...(phoneError ? { number_phone: phoneError } : {})
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const nameError = validateField('name', formData.name);
    const usernameError = validateField('username', formData.username);

    const newErrors = {
      ...(nameError ? { full_name: nameError } : {}),
      ...(usernameError ? { username: usernameError } : {}),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const passwordError = validateField('password', formData.password);
    const rePasswordError = validateField('re_password', formData.re_password);

    const newErrors = {
      ...(passwordError ? { password: passwordError } : {}),
      ...(rePasswordError ? { re_password: rePasswordError } : {})
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return false;
    }
  };

  const handleNext = () => {
    const isValid = validateForm();
    if (!isValid) return;

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    } else {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    } else {
      navigation.goBack();
    }
  };

  const handleRegister = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // Use signUp from AuthContext - API expects: username, email, password, full_name, phone
      const result = await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone: formData.phone,
      });

      if (result.success) {
        // Reset form before navigating
        resetForm();

        AlertService.success(
          'Đăng ký thành công',
          'Tài khoản của bạn đã được tạo thành công',
          [
            {
              text: 'Xác nhận',
              onPress: () => {
                // Navigate to MainTabs after successful registration
                navigation.navigate('MainTabs');
              }
            }
          ]
        );
      } else {
        // Handle errors
        if (result.errors) {
          const fieldMapping: Record<string, string> = {
            identifier: 'email',
            email: 'email',
            phone: 'number_phone',
            full_name: 'full_name',
            username: 'username',
            password: 'password',
          };

          const newErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([field, message]) => {
            const mappedField = fieldMapping[field] || field;
            newErrors[mappedField] = message as string;
          });

          setErrors(newErrors);

          // Navigate to appropriate step based on errors
          const step1Fields = ['email', 'number_phone'];
          const step2Fields = ['full_name', 'username'];
          const step3Fields = ['password', 're_password'];

          const errorFields = Object.keys(newErrors);

          if (errorFields.some(field => step1Fields.includes(field))) {
            setCurrentStep(1);
          } else if (errorFields.some(field => step2Fields.includes(field))) {
            setCurrentStep(2);
          } else if (errorFields.some(field => step3Fields.includes(field))) {
            setCurrentStep(3);
          }
        } else if (result.error) {
          AlertService.error(
            'Đăng ký thất bại',
            result.error
          );
        }
      }

    } catch (error: any) {
      console.log('Registration error:', error);
      AlertService.error(
        'Đăng ký thất bại',
        error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!value) {
          error = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email không hợp lệ';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9+().\-\s]{7,15}$/.test(value)) {
          error = 'Số điện thoại không hợp lệ';
        }
        break;

      case 'name':
        if (!value) {
          error = t('auth.nameRequired') || 'Vui lòng nhập họ tên';
        } else if (value.length < 2) {
          error = t('auth.nameMinLength') || 'Họ tên phải có ít nhất 2 ký tự';
        }
        break;

      case 'username':
        if (!value) {
          error = t('auth.usernameRequired') || 'Vui lòng nhập tên đăng nhập';
        } else if (value.length < 3) {
          error = t('auth.usernameMinLength') || 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Vui lòng nhập mật khẩu';
        } else if (value.length < 8) {
          error = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        break;

      case 're_password':
        if (!value) {
          error = 'Vui lòng xác nhận mật khẩu';
        } else if (value !== formData.password) {
          error = 'Mật khẩu không khớp';
        }
        break;
    }

    return error;
  };

  const updateFormData = (key: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    if (typeof value === 'string') {
      const error = validateField(key, value);
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1; // Minimum 8 characters (API requirement)
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return { text: 'Yếu', color: theme.colors.error };
    if (strength <= 4) return { text: 'Trung bình', color: theme.colors.warning };
    return { text: 'Mạnh', color: theme.colors.success };
  };

  const renderStep1 = () => (
    <View style={styles.form}>
      <InputCustom
        label="Email"
        placeholder="Nhập địa chỉ email"
        value={formData.email}
        onChangeText={value => updateFormData('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        required
        leftIcon="email-outline"
        containerStyle={styles.input}
      />

      <InputCustom
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        value={formData.phone}
        onChangeText={value => updateFormData('phone', value)}
        keyboardType="phone-pad"
        error={errors.number_phone}
        required
        leftIcon="phone-outline"
        containerStyle={styles.input}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.form}>
      <InputCustom
        label="Họ và tên"
        placeholder="Nhập họ và tên đầy đủ"
        value={formData.name}
        onChangeText={value => updateFormData('name', value)}
        error={errors.full_name}
        required
        leftIcon="account-outline"
        containerStyle={styles.input}
      />

      <InputCustom
        label="Tên đăng nhập"
        placeholder="Nhập tên đăng nhập"
        value={formData.username}
        onChangeText={value => updateFormData('username', value)}
        error={errors.username}
        required
        leftIcon="account-circle-outline"
        containerStyle={styles.input}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.form}>
      <InputCustom
        label="Mật khẩu"
        placeholder="Tạo mật khẩu"
        value={formData.password}
        onChangeText={(text) => {
          updateFormData('password', text);
          setPasswordStrength(calculatePasswordStrength(text));
        }}
        secureTextEntry={!showPassword}
        error={errors.password}
        required
        leftIcon="lock-outline"
        rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        containerStyle={styles.input}
      />

      {formData.password.length > 0 && (
        <View style={styles.passwordStrengthContainer}>
          <View style={styles.passwordStrengthBar}>
            <View
              style={[
                styles.passwordStrengthFill,
                {
                  width: `${(passwordStrength / 6) * 100}%`,
                  backgroundColor: getPasswordStrengthText(passwordStrength).color
                }
              ]}
            />
          </View>
          <Text style={[
            styles.passwordStrengthText,
            { color: getPasswordStrengthText(passwordStrength).color }
          ]}>
            {getPasswordStrengthText(passwordStrength).text}
          </Text>
        </View>
      )}

      <InputCustom
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        value={formData.re_password}
        onChangeText={value => updateFormData('re_password', value)}
        secureTextEntry={!showConfirmPassword}
        error={errors.re_password}
        required
        leftIcon="lock-check-outline"
        rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        containerStyle={styles.input}
      />

    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map(step => (
        <View
          key={step}
          style={[
            styles.stepDot,
            currentStep === step && styles.stepDotActive,
            currentStep > step && styles.stepDotCompleted
          ]}
        />
      ))}
    </View>
  );

  const renderForm = () => (
    <Animated.View
      style={styles.formContainer}
      entering={SlideInDown.duration(800).delay(800).springify()}
    >
      <View style={styles.formHeader}>
        <Text style={styles.formSubtitle}>
          Tham gia cùng chúng tôi để bảo vệ hành tinh
        </Text>
        {renderStepIndicator()}
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <View style={styles.buttonContainer}>
        <ButtonCustom
          title={currentStep === 1 ? 'Quay lại' : 'Trước'}
          onPress={handleBack}
          style={styles.backButton}
          variant="outline"
        />
        <ButtonCustom
          title={currentStep === totalSteps ? 'Tạo tài khoản' : 'Tiếp theo'}
          onPress={handleNext}
          style={styles.nextButton}
          icon={currentStep === totalSteps ? "account-plus" : "chevron-right"}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('Help')}
          >
            <Icon name="headset" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
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
              Chào mừng đến với GreenEduMap
            </Animated.Text>

            <Animated.Text
              style={styles.title}
              entering={FadeInDown.duration(800).delay(400).springify()}
            >
              Tạo tài khoản
            </Animated.Text>
          </Animated.View>

          {/* Form Section */}
          {renderForm()}

          {/* Footer */}
          <Animated.View
            style={styles.footerContainer}
            entering={FadeInUp.duration(600).delay(1200).springify()}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Đã có tài khoản?{' '}
                <Text style={styles.loginLinkText}>
                  Đăng nhập
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Icon name="shield-check" size={16} color={theme.colors.success} />
              <Text style={styles.securityText}>
                Dữ liệu được bảo mật và mã hóa
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={loading} message="Đang tạo tài khoản..." />
      
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
    top: Platform.OS === 'ios' ? 70 : 30,
    right: 20,
    flexDirection: 'column',
    gap: theme.spacing.md,
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
    paddingHorizontal: theme.spacing.lg,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: hp('3%'),
    paddingBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,  
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
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
    marginBottom: theme.spacing.lg,
  },

  // Step Indicator Styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stepDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: theme.colors.border,
  },
  stepDotActive: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: theme.colors.success,
  },
  stepDotCompleted: {
    backgroundColor: theme.colors.success,
  },

  // Button Container Styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    flex: 1,
    height: hp('6%'),
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
  nextButton: {
    flex: 1,
    height: hp('6%'),
    backgroundColor: theme.colors.success,
  },

  // Password Strength Styles
  passwordStrengthContainer: {
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  passwordStrengthBar: {
    height: wp('1%'),
    backgroundColor: theme.colors.border,
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.xs,
  },
  passwordStrengthText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  loginLink: {
    paddingVertical: SPACING.sm,
  },
  loginText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: FONT_SIZE.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  loginLinkText: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
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

export default RegisterScreen;