import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export const storage = {
  async setAccessToken(token) {
    try { await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token); } catch (e) {}
  },
  async getAccessToken() {
    try { return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN); } catch { return null; }
  },
  async setRefreshToken(token) {
    try { await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token); } catch (e) {}
  },
  async getRefreshToken() {
    try { return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN); } catch { return null; }
  },
  async setUserData(user) {
    try { await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)); } catch (e) {}
  },
  async getUserData() {
    try {
      const d = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  },
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (e) {}
  },
};
