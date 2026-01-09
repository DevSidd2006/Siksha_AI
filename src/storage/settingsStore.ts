import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_MODE_KEY = '@siksha_offline_mode';

export async function getOfflineMode(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(OFFLINE_MODE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading offline mode:', error);
    return false;
  }
}

export async function setOfflineMode(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(OFFLINE_MODE_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving offline mode:', error);
  }
}
