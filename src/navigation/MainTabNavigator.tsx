/**
 * GreenEduMap Main Navigation
 * 
 * Clean navigation structure with 4 main tabs:
 * - Map: Environmental monitoring
 * - Learn: Education platform
 * - Actions: Green actions tracking
 * - Profile: User settings and stats
 */

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import { RootStackParamList } from './types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

import AlertDemoScreen from '../screens/AlertDemoScreen';
// ============================================================================
// AUTH SCREENS
// ============================================================================
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

// ============================================================================
// MAIN TAB SCREENS
// ============================================================================
import MapScreen from '../screens/MapScreenMapbox'; // Using Mapbox GL
import LearnScreen from '../screens/LearnScreen';
import ActionsScreen from '../screens/ActionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ============================================================================
// OTHER SCREENS
// ============================================================================
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpScreen from '../screens/HelpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen';



const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// ============================================================================
// MAIN TABS COMPONENT
// ============================================================================
const MainTabs = () => {
  const { userRole } = useAuth();
  const { t } = useTranslation();

  const tabScreenOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textLight,
    tabBarStyle: {
      backgroundColor: theme.colors.white,
      borderTopColor: theme.colors.border,
      paddingBottom: 8,
      paddingTop: 8,
      height: 60,
      elevation: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      marginBottom: 12,
    },
    tabBarLabelStyle: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      fontWeight: '600' as any,
    },
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      {/* Map Tab - Environmental Monitoring */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker-radius" size={size} color={color} />
          ),
        }}
      />

      {/* Learn Tab - Education */}
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          ),
        }}
      />

      {/* Actions Tab - Green Actions Tracking */}
      <Tab.Screen
        name="Actions"
        component={ActionsScreen}
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, size }) => (
            <Icon name="leaf" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab - User Profile & Settings */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================================================
// MAIN NAVIGATOR
// ============================================================================
const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        animationTypeForReplace: 'push',
        presentation: 'card',
        contentStyle: {
          backgroundColor: theme.colors.white,
        },
      }}
    >
      {/* ========== INITIAL LOADING ========== */}
      <Stack.Screen name="Loading" component={LoadingScreen} />

      {/* ========== AUTH STACK ========== */}
      <Stack.Group>
        <Stack.Screen name="AlertDemo" component={AlertDemoScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      </Stack.Group>

      {/* ========== MAIN APP ========== */}
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Group>

      {/* ========== PROFILE & SETTINGS ========== */}
      <Stack.Group>
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen as any} />
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      </Stack.Group>

      {/* ========== PLACEHOLDER SCREENS (TODO: Implement) ========== */}
      {/* Map & Environmental Monitoring */}
      {/* <Stack.Screen name="AirQualityDetail" component={AirQualityDetailScreen} /> */}
      {/* <Stack.Screen name="WeatherDetail" component={WeatherDetailScreen} /> */}
      {/* <Stack.Screen name="LocationSearch" component={LocationSearchScreen} /> */}
      {/* <Stack.Screen name="AddMonitoringLocation" component={AddMonitoringLocationScreen} /> */}

      {/* Learning & Education */}
      {/* <Stack.Screen name="CourseDetail" component={CourseDetailScreen} /> */}
      {/* <Stack.Screen name="LessonViewer" component={LessonViewerScreen} /> */}
      {/* <Stack.Screen name="Quiz" component={QuizScreen} /> */}
      {/* <Stack.Screen name="QuizResult" component={QuizResultScreen} /> */}
      {/* <Stack.Screen name="Achievements" component={AchievementsScreen} /> */}
      {/* <Stack.Screen name="Leaderboard" component={LeaderboardScreen} /> */}

      {/* Green Actions */}
      {/* <Stack.Screen name="AddGreenAction" component={AddGreenActionScreen} /> */}
      {/* <Stack.Screen name="ActionDetail" component={ActionDetailScreen} /> */}
      {/* <Stack.Screen name="ActionHistory" component={ActionHistoryScreen} /> */}
      {/* <Stack.Screen name="CommunityActions" component={CommunityActionsScreen} /> */}

      {/* Settings & Data */}
      {/* <Stack.Screen name="EnvironmentalSettings" component={EnvironmentalSettingsScreen} /> */}
      {/* <Stack.Screen name="DataSources" component={DataSourcesScreen} /> */}
      {/* <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} /> */}
      {/* <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} /> */}
      {/* <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} /> */}
      {/* <Stack.Screen name="About" component={AboutScreen} /> */}

      {/* Analytics & Reports */}
      {/* <Stack.Screen name="ImpactStats" component={ImpactStatsScreen} /> */}
      {/* <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} /> */}

      {/* Help & Support */}
      {/* <Stack.Screen name="FAQ" component={FAQScreen} /> */}
      {/* <Stack.Screen name="ContactSupport" component={ContactSupportScreen} /> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
