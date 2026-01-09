import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeDatabase } from '@/database/init';

export default function RootLayout() {
  useEffect(() => {
    // Initialize database on app start
    initializeDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
