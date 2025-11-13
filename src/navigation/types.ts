import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * GreenEduMap Navigation Types
 * 
 * Clean navigation structure focused on environmental monitoring,
 * education, and green actions tracking.
 */

export type RootStackParamList = {
  // ============================================================================
  // AUTH FLOW
  // ============================================================================
  Loading: undefined;
  AlertDemo: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { 
    identifier: string; 
    type: 'phone' | 'email';
    flow?: 'register' | 'login' | 'forgot';
  };
  Onboarding: undefined;
  
  // ============================================================================
  // MAIN TABS
  // ============================================================================
  MainTabs: undefined;
  
  // Tab Screens
  Map: undefined;           // Environmental map with OpenAQ, weather overlays
  Learn: undefined;         // Educational content & courses
  Actions: undefined;       // Green actions tracking
  Profile: undefined;       // User profile & impact stats
  
  // ============================================================================
  // MAP & ENVIRONMENTAL MONITORING
  // ============================================================================
  AirQualityDetail: {
    location: {
      latitude: number;
      longitude: number;
      name?: string;
    };
  };
  WeatherDetail: {
    location: {
      latitude: number;
      longitude: number;
      name?: string;
    };
  };
  LocationSearch: undefined;
  AddMonitoringLocation: undefined;
  
  // ============================================================================
  // LEARNING & EDUCATION
  // ============================================================================
  CourseDetail: {
    courseId: string;
  };
  LessonViewer: {
    courseId: string;
    lessonId: string;
  };
  Quiz: {
    quizId: string;
    courseId?: string;
  };
  QuizResult: {
    quizId: string;
    score: number;
    totalQuestions: number;
  };
  Achievements: undefined;
  Leaderboard: undefined;
  
  // ============================================================================
  // GREEN ACTIONS
  // ============================================================================
  AddGreenAction: undefined;
  ActionDetail: {
    actionId: string;
  };
  ActionHistory: undefined;
  CommunityActions: undefined;
  
  // ============================================================================
  // PROFILE & SETTINGS
  // ============================================================================
  EditProfile: undefined;
  EnvironmentalSettings: undefined;
  DataSources: undefined;
  NotificationSettings: undefined;
  Security: undefined;
  ChangePassword: undefined;
  UpdatePassword: {
    token: string;
  };
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  About: undefined;
  
  // ============================================================================
  // HISTORY & STATS
  // ============================================================================
  History: undefined;
  ImpactStats: undefined;
  MonthlyReport: {
    month: string;
    year: number;
  };
  
  // ============================================================================
  // NOTIFICATIONS & HELP
  // ============================================================================
  Notifications: undefined;
  Help: undefined;
  FAQ: undefined;
  ContactSupport: undefined;
  
  // ============================================================================
  // EKYC (Optional - for verified users)
  // ============================================================================
  EkycIntro: undefined;
  EkycIDCard: undefined;
  EkycSelfie: undefined;
  EkycInformation: undefined;
  EkycReview: undefined;
  EkycSuccess: undefined;
  
  // ============================================================================
  // VERIFICATION
  // ============================================================================
  EmailVerification: undefined;
  PhoneVerification: undefined;
};

export type StackScreen<T extends keyof RootStackParamList> = React.FC<NativeStackScreenProps<RootStackParamList, T>>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
