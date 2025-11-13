/**
 * HomeScreen - GreenEduMap Dashboard (Temporary)
 * 
 * This is a simple redirect screen.
 * TODO: Replace with proper dashboard or remove if using tabs directly
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { StackScreen } from '../navigation/types';

const HomeScreen: StackScreen<'Home'> = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect to main tabs
    const timer = setTimeout(() => {
      navigation.navigate('MainTabs' as never);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.text}>Loading GreenEduMap...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
});

export default HomeScreen;
