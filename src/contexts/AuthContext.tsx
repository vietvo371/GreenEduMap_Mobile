import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, User, SignUpData } from '../utils/authApi';
import { EkycVerifyRequest, EkycVerifyResponse } from '../types/ekyc';

// ============================================================================
// TYPES - GreenEduMap User Roles & Data Structures
// ============================================================================

/**
 * User roles in GreenEduMap ecosystem
 * - citizen: Public users monitoring their environmental impact
 * - student: Students learning about environmental science
 * - teacher: Educators creating/managing educational content
 * - urban_manager: City planners and urban management officials
 * - researcher: Environmental researchers and scientists
 * - business: Green businesses and organizations
 * - verifier: Environmental data verifiers
 * - government: Government officials and policy makers
 */
type UserRole = 
  | 'citizen' 
  | 'student' 
  | 'teacher' 
  | 'urban_manager' 
  | 'researcher' 
  | 'business' 
  | 'verifier' 
  | 'government';

/**
 * Environmental monitoring preferences
 */
interface EnvironmentalPreferences {
  // Air Quality Monitoring
  airQualityAlerts: boolean;
  airQualityThreshold: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy';
  
  // Weather Monitoring
  weatherAlerts: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  
  // Data Sources
  enabledDataSources: {
    openAQ: boolean;      // Air quality data
    openWeather: boolean; // Weather data
    nasaPower: boolean;   // NASA POWER solar/energy data
    openStreetMap: boolean; // Map data
  };
  
  // Location Preferences
  monitoringLocations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
  }>;
  
  // Notification preferences
  notifyOnPoorAirQuality: boolean;
  notifyOnWeatherAlerts: boolean;
  notifyOnEnvironmentalNews: boolean;
}

/**
 * Green Action tracking
 */
interface GreenAction {
  id: string;
  type: 'transport' | 'energy' | 'waste' | 'water' | 'food' | 'education' | 'community';
  title: string;
  description: string;
  carbonSaved: number; // in kg CO2
  completedAt: Date;
  verificationMethod?: 'self' | 'verified' | 'ai_verified';
}

/**
 * User's environmental impact data
 */
interface EnvironmentalImpact {
  // Carbon Footprint
  totalCarbonSaved: number; // Total kg CO2 saved
  monthlyCarbon: number;
  dailyCarbon: number;
  
  // Green Actions
  completedActions: GreenAction[];
  totalActionsCount: number;
  
  // Rankings & Achievements
  communityRank: number;
  totalPoints: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: Date;
  }>;
  
  // Streaks
  currentStreak: number; // Days of consecutive green actions
  longestStreak: number;
}

/**
 * Educational progress for students
 */
interface EducationalProgress {
  // Completed courses/modules
  completedCourses: Array<{
    id: string;
    title: string;
    category: 'environmental_science' | 'climate_change' | 'renewable_energy' | 'sustainability';
    completedAt: Date;
    score: number;
  }>;
  
  // Quiz results
  quizResults: Array<{
    id: string;
    title: string;
    score: number;
    completedAt: Date;
  }>;
  
  // Learning stats
  totalLearningHours: number;
  currentLevel: number;
  experiencePoints: number;
}

/**
 * Data insights & AI recommendations
 */
interface AIInsights {
  // Personalized recommendations
  recommendedActions: Array<{
    id: string;
    title: string;
    description: string;
    potentialCarbonSavings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  
  // Environmental trends for user's location
  localTrends: {
    airQualityTrend: 'improving' | 'stable' | 'worsening';
    weatherPattern: string;
    environmentalRisk: 'low' | 'medium' | 'high';
  };
  
  // Community insights
  communityHighlights: Array<{
    message: string;
    type: 'achievement' | 'alert' | 'tip';
  }>;
}

/**
 * Main Auth Context Data
 */
interface AuthContextData {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  
  // Auth Methods
  signIn: (credentials: { identifier: string; type: string }) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  verifyEkyc: (data: EkycVerifyRequest) => Promise<EkycVerifyResponse>;
  
  // GreenEduMap Specific Features
  environmentalPreferences: EnvironmentalPreferences;
  updateEnvironmentalPreferences: (preferences: Partial<EnvironmentalPreferences>) => Promise<void>;
  
  environmentalImpact: EnvironmentalImpact | null;
  loadEnvironmentalImpact: () => Promise<void>;
  addGreenAction: (action: Omit<GreenAction, 'id' | 'completedAt'>) => Promise<void>;
  
  educationalProgress: EducationalProgress | null;
  loadEducationalProgress: () => Promise<void>;
  
  aiInsights: AIInsights | null;
  refreshAIInsights: () => Promise<void>;
  
  // User settings
  updateUserSettings: (settings: any) => Promise<void>;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_ENVIRONMENTAL_PREFERENCES: EnvironmentalPreferences = {
  airQualityAlerts: true,
  airQualityThreshold: 'moderate',
  weatherAlerts: true,
  temperatureUnit: 'celsius',
  enabledDataSources: {
    openAQ: true,
    openWeather: true,
    nasaPower: true,
    openStreetMap: true,
  },
  monitoringLocations: [],
  notifyOnPoorAirQuality: true,
  notifyOnWeatherAlerts: true,
  notifyOnEnvironmentalNews: true,
};

// ============================================================================
// CONTEXT IMPLEMENTATION
// ============================================================================

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // GreenEduMap specific state
  const [environmentalPreferences, setEnvironmentalPreferences] = useState<EnvironmentalPreferences>(
    DEFAULT_ENVIRONMENTAL_PREFERENCES
  );
  const [environmentalImpact, setEnvironmentalImpact] = useState<EnvironmentalImpact | null>(null);
  const [educationalProgress, setEducationalProgress] = useState<EducationalProgress | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await loadStoredUser();
      await loadEnvironmentalPreferences();
      await loadEnvironmentalImpact();
      await loadEducationalProgress();
      await refreshAIInsights();
    } catch (error) {
      console.log('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  const loadStoredUser = async () => {
    try {
      const storedUser = await authApi.loadStoredUser();
      setUser(storedUser);
    } catch (error) {
      console.log('Error loading stored user:', error);
    }
  };

  const signIn = async (credentials: { identifier: string; type: string }) => {
    try {
      const result = await authApi.signIn(credentials);
      setUser(result.user);
      
      // Load user's environmental data after sign in
      await Promise.all([
        loadEnvironmentalPreferences(),
        loadEnvironmentalImpact(),
        loadEducationalProgress(),
        refreshAIInsights(),
      ]);
    } catch (error: any) {
      console.log('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      await authApi.signUp(userData);
      // Initialize default preferences for new users
      await saveEnvironmentalPreferences(DEFAULT_ENVIRONMENTAL_PREFERENCES);
    } catch (error: any) {
      console.log('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      
      // Clear GreenEduMap data
      setEnvironmentalPreferences(DEFAULT_ENVIRONMENTAL_PREFERENCES);
      setEnvironmentalImpact(null);
      setEducationalProgress(null);
      setAIInsights(null);
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        '@environmental_preferences',
        '@environmental_impact',
        '@educational_progress',
        '@ai_insights',
      ]);
    } catch (error: any) {
      console.log('Sign out error:', error);
      throw error;
    }
  };

  const verifyEkyc = async (data: EkycVerifyRequest): Promise<EkycVerifyResponse> => {
    try {
      return await authApi.verifyEkyc(data);
    } catch (error: any) {
      console.log('eKYC verification error:', error);
      throw error;
    }
  };

  // ============================================================================
  // ENVIRONMENTAL PREFERENCES
  // ============================================================================

  const loadEnvironmentalPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('@environmental_preferences');
      if (stored) {
        setEnvironmentalPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading environmental preferences:', error);
    }
  };

  const saveEnvironmentalPreferences = async (prefs: EnvironmentalPreferences) => {
    try {
      await AsyncStorage.setItem('@environmental_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.log('Error saving environmental preferences:', error);
    }
  };

  const updateEnvironmentalPreferences = async (preferences: Partial<EnvironmentalPreferences>) => {
    try {
      const updated = { ...environmentalPreferences, ...preferences };
      setEnvironmentalPreferences(updated);
      await saveEnvironmentalPreferences(updated);
      
      // TODO: Sync with backend API
      // await authApi.updateEnvironmentalPreferences(updated);
    } catch (error) {
      console.log('Error updating environmental preferences:', error);
      throw error;
    }
  };

  // ============================================================================
  // ENVIRONMENTAL IMPACT TRACKING
  // ============================================================================

  const loadEnvironmentalImpact = async () => {
    try {
      const stored = await AsyncStorage.getItem('@environmental_impact');
      if (stored) {
        setEnvironmentalImpact(JSON.parse(stored));
      } else {
        // Initialize default impact data
        const defaultImpact: EnvironmentalImpact = {
          totalCarbonSaved: 0,
          monthlyCarbon: 0,
          dailyCarbon: 0,
          completedActions: [],
          totalActionsCount: 0,
          communityRank: 0,
          totalPoints: 0,
          badges: [],
          currentStreak: 0,
          longestStreak: 0,
        };
        setEnvironmentalImpact(defaultImpact);
      }
      
      // TODO: Fetch from backend
      // const impact = await authApi.getEnvironmentalImpact();
      // setEnvironmentalImpact(impact);
    } catch (error) {
      console.log('Error loading environmental impact:', error);
    }
  };

  const addGreenAction = async (action: Omit<GreenAction, 'id' | 'completedAt'>) => {
    try {
      const newAction: GreenAction = {
        ...action,
        id: Date.now().toString(),
        completedAt: new Date(),
      };
      
      const updatedImpact = {
        ...environmentalImpact!,
        completedActions: [...(environmentalImpact?.completedActions || []), newAction],
        totalActionsCount: (environmentalImpact?.totalActionsCount || 0) + 1,
        totalCarbonSaved: (environmentalImpact?.totalCarbonSaved || 0) + action.carbonSaved,
        dailyCarbon: (environmentalImpact?.dailyCarbon || 0) + action.carbonSaved,
        totalPoints: (environmentalImpact?.totalPoints || 0) + Math.floor(action.carbonSaved * 10),
      };
      
      setEnvironmentalImpact(updatedImpact);
      await AsyncStorage.setItem('@environmental_impact', JSON.stringify(updatedImpact));
      
      // TODO: Sync with backend
      // await authApi.addGreenAction(newAction);
      
      // Refresh AI insights after adding action
      await refreshAIInsights();
    } catch (error) {
      console.log('Error adding green action:', error);
      throw error;
    }
  };

  // ============================================================================
  // EDUCATIONAL PROGRESS
  // ============================================================================

  const loadEducationalProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('@educational_progress');
      if (stored) {
        setEducationalProgress(JSON.parse(stored));
      } else {
        // Initialize default progress
        const defaultProgress: EducationalProgress = {
          completedCourses: [],
          quizResults: [],
          totalLearningHours: 0,
          currentLevel: 1,
          experiencePoints: 0,
        };
        setEducationalProgress(defaultProgress);
      }
      
      // TODO: Fetch from backend
      // const progress = await authApi.getEducationalProgress();
      // setEducationalProgress(progress);
    } catch (error) {
      console.log('Error loading educational progress:', error);
    }
  };

  // ============================================================================
  // AI INSIGHTS & RECOMMENDATIONS
  // ============================================================================

  const refreshAIInsights = async () => {
    try {
      // TODO: Fetch real AI insights from backend
      // For now, generate mock insights based on user data
      const mockInsights: AIInsights = {
        recommendedActions: [
          {
            id: '1',
            title: 'Use Public Transport Today',
            description: 'Taking the bus instead of driving can save 2.3kg CO2',
            potentialCarbonSavings: 2.3,
            difficulty: 'easy',
            category: 'transport',
          },
          {
            id: '2',
            title: 'Reduce Plastic Usage',
            description: 'Bring reusable bags to the market',
            potentialCarbonSavings: 0.5,
            difficulty: 'easy',
            category: 'waste',
          },
        ],
        localTrends: {
          airQualityTrend: 'improving',
          weatherPattern: 'Sunny week ahead',
          environmentalRisk: 'low',
        },
        communityHighlights: [
          {
            message: 'Your neighborhood saved 150kg CO2 this week!',
            type: 'achievement',
          },
        ],
      };
      
      setAIInsights(mockInsights);
      await AsyncStorage.setItem('@ai_insights', JSON.stringify(mockInsights));
      
      // TODO: Real API call
      // const insights = await authApi.getAIInsights();
      // setAIInsights(insights);
    } catch (error) {
      console.log('Error refreshing AI insights:', error);
    }
  };

  // ============================================================================
  // USER SETTINGS
  // ============================================================================

  const updateUserSettings = async (settings: any) => {
    try {
      // TODO: Implement user settings update
      console.log('Updating user settings:', settings);
      // await authApi.updateUserSettings(settings);
    } catch (error) {
      console.log('Error updating user settings:', error);
      throw error;
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const userRole = user?.role ?? null;

  // ============================================================================
  // CONTEXT PROVIDER
  // ============================================================================

  return (
    <AuthContext.Provider
      value={{
        // Authentication
        isAuthenticated: !!user,
        user,
        loading,
        userRole,
        signIn,
        signUp,
        signOut,
        verifyEkyc,
        
        // GreenEduMap Features
        environmentalPreferences,
        updateEnvironmentalPreferences,
        
        environmentalImpact,
        loadEnvironmentalImpact,
        addGreenAction,
        
        educationalProgress,
        loadEducationalProgress,
        
        aiInsights,
        refreshAIInsights,
        
        updateUserSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }

  return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  UserRole,
  EnvironmentalPreferences,
  GreenAction,
  EnvironmentalImpact,
  EducationalProgress,
  AIInsights,
  AuthContextData,
};