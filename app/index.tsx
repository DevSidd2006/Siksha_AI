import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { AuthScreen } from '@/components/AuthScreen';
import { isAuthenticated } from '@/storage/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    setLoading(false);
  };

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!authenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return <Redirect href="/(tabs)/tutor" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
