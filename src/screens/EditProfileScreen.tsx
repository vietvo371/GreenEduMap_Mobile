import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../utils/Api';
import { useTranslation } from '../hooks/useTranslation';


interface UserProfile {
  full_name: string;
  email: string;
  number_phone: string;
  address: string;
  is_ekyc: number;
  is_active_mail: number;
  is_active_phone: number;
  is_open: number;
  is_level: number;
}

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Verification statuses
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEkycVerified, setIsEkycVerified] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/profile');
      
      if (response.data.status) {
        const profileData = response.data.data;
        setUser(profileData);
        setFullName(profileData.full_name || '');
        setEmail(profileData.email || '');
        setPhone(profileData.number_phone || '');
        setAddress(profileData.address || '');
        
        // Check verification statuses
        setIsEmailVerified(profileData.is_active_mail === 1);
        setIsPhoneVerified(profileData.is_active_phone === 1);
        setIsEkycVerified(profileData.is_ekyc === 1);
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
      Alert.alert('Error', 'Cannot load profile information');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Only validate full name if not eKYC verified
    if (!isEkycVerified) {
      if (!fullName.trim()) {
        newErrors.full_name = t('editProfile.fullNameRequired');
      } else if (fullName.trim().length < 2) {
        newErrors.full_name = t('editProfile.fullNameMinLength');
      }
    }

    if (!address.trim()) {
      newErrors.address = t('editProfile.addressRequired');
    }

    // Only validate email if not verified and has value
    if (!isEmailVerified && email.trim()) {
      if (!/\S+@\S+\.\S+/.test(email.trim())) {
        newErrors.email = t('editProfile.validEmail');
      }
    }

    // Only validate phone if not verified and has value
    if (!isPhoneVerified && phone.trim()) {
      if (!/^[0-9+().\-\s]{7,15}$/.test(phone.trim())) {
        newErrors.number_phone = t('editProfile.validPhone');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        address: address.trim(),
      };

      // Only include full name if not eKYC verified
      if (!isEkycVerified) {
        updateData.full_name = fullName.trim();
      }

      // Only include email if not verified
      if (!isEmailVerified && email.trim()) {
        updateData.email = email.trim();
      }

      // Only include phone if not verified
      if (!isPhoneVerified && phone.trim()) {
        updateData.number_phone = phone.trim();
      }

      const response = await api.post('/client/update-profile', updateData);
      
      if (response.data.status) {
        Alert.alert(t('common.success'), t('editProfile.updateSuccess'), [
          {
            text: t('common.confirm'),
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        Alert.alert(t('common.error'), response.data.message || t('editProfile.updateFailed'));
      }
    } catch (error: any) {
      console.log('Update profile error:', error);
      if (error.response?.data?.errors) {
        const newErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach(field => {
          newErrors[field] = error.response.data.errors[field][0];
        });
        setErrors(newErrors);
      } else {
        let errorMessage = t('editProfile.updateFailed');
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Alert.alert(t('common.error'), errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    switch (key) {
      case 'full_name':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'number_phone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
    }
    
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const renderInputField = (
    fieldKey: string,
    label: string,
    value: string,
    placeholder: string,
    isVerified: boolean,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <Icon name="check-circle" size={14} color="#34C759" />
            <Text style={styles.verifiedText}>{t('editProfile.verified')}</Text>
          </View>
        )}
      </View>
      
      <TextInput
        style={[
          styles.input, 
          errors[fieldKey] && styles.inputError,
          isVerified && styles.inputDisabled
        ]}
        value={value}
        onChangeText={(text) => updateFormData(fieldKey, text)}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        editable={!isVerified}
      />
      
      {errors[fieldKey] && <Text style={styles.errorText}>{errors[fieldKey]}</Text>}
      
      {isVerified && (
        <Text style={styles.disabledText}>
          {fieldKey === 'full_name' 
            ? t('editProfile.ekycVerifiedDesc')
            : t('editProfile.verifiedDesc')
          }
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>{t('editProfile.loadingInfo')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#4A90E2" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderInputField(
          'full_name',
          t('editProfile.fullName'),
          fullName,
          t('editProfile.enterFullName'),
          isEkycVerified,
          'default'
        )}

        {renderInputField(
          'email',
          t('editProfile.email'),
          email,
          t('editProfile.enterEmail'),
          isEmailVerified,
          'email-address'
        )}

        {renderInputField(
          'number_phone',
          t('editProfile.phone'),
          phone,
          t('editProfile.enterPhone'),
          isPhoneVerified,
          'phone-pad'
        )}

        {renderInputField(
          'address',
          t('editProfile.address'),
          address,
          t('editProfile.enterAddress'),
          false,
          'default'
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: wp('4%'),
    color: '#4A90E2',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: wp('3.5%'),
    color: '#000',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C75915',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verifiedText: {
    fontSize: wp('2.8%'),
    color: '#34C759',
    fontWeight: '600',
  },
  input: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    fontSize: wp('4%'),
    color: '#000',
  },
  inputDisabled: {
    backgroundColor: '#F8F8F8',
    color: '#999',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    fontSize: wp('3%'),
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },
  disabledText: {
    fontSize: wp('3%'),
    color: '#8E8E93',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#666',
    marginTop: 16,
  },
});

export default EditProfileScreen;
