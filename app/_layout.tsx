import React, { useState, createContext } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet, useColorScheme } from 'react-native';

import { AuthProvider, useAuth } from '@/context/AuthContext';

// ボイスインプットの状態を管理するためのコンテキスト
export const AppContext = createContext<{
  voiceInputVisible: boolean;
  setVoiceInputVisible: (visible: boolean) => void;
  voiceText: string;
  setVoiceText: (text: string) => void;
  voiceTags: string[];
  setVoiceTags: (tags: string[]) => void;
  voiceTagDescriptions: Record<string, string>;
  setVoiceTagDescriptions: (descriptions: Record<string, string>) => void;
  restaurantSearchVisible: boolean;
  setRestaurantSearchVisible: (visible: boolean) => void;
  modeSelectorVisible: boolean;
  setModeSelectorVisible: (visible: boolean) => void;
  activeGroupId: string | null;
  setActiveGroupId: (groupId: string | null) => void;
  activeGroupInfo: { name: string; members: number; color: string; image: string } | null;
  setActiveGroupInfo: (info: { name: string; members: number; color: string; image: string } | null) => void;
  appMode: string;
  setAppMode: (mode: string) => void;
}>({
  voiceInputVisible: false,
  setVoiceInputVisible: () => {},
  voiceText: '',
  setVoiceText: () => {},
  voiceTags: [],
  setVoiceTags: () => {},
  voiceTagDescriptions: {},
  setVoiceTagDescriptions: () => {},
  restaurantSearchVisible: false,
  setRestaurantSearchVisible: () => {},
  modeSelectorVisible: false,
  setModeSelectorVisible: () => {},
  activeGroupId: null,
  setActiveGroupId: () => {},
  activeGroupInfo: null,
  setActiveGroupInfo: () => {},
  appMode: 'normal',
  setAppMode: () => {},
});

// フォントの読み込みが終わるまでSplashScreenを表示
SplashScreen.preventAutoHideAsync();

// 認証状態に基づいてナビゲーションを制御するコンポーネント
function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    
    if (!user && !inAuthGroup) {
      // 未認証ユーザーを認証画面にリダイレクト
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // 認証済みユーザーをメイン画面にリダイレクト
      router.replace('/');
    }
  }, [user, segments, loading]);

  return <Slot />;
}

// 実際のレイアウトコンポーネント
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // アプリ全体で共有する状態
  const [voiceInputVisible, setVoiceInputVisible] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceTags, setVoiceTags] = useState<string[]>([]);
  const [voiceTagDescriptions, setVoiceTagDescriptions] = useState<Record<string, string>>({});
  const [restaurantSearchVisible, setRestaurantSearchVisible] = useState(false);
  const [modeSelectorVisible, setModeSelectorVisible] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeGroupInfo, setActiveGroupInfo] = useState<{ name: string; members: number; color: string; image: string } | null>(null);
  const [appMode, setAppMode] = useState<string>('normal');

  useEffect(() => {
    if (error) console.warn(error);
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={{ 
      voiceInputVisible, 
      setVoiceInputVisible, 
      voiceText, 
      setVoiceText, 
      voiceTags, 
      setVoiceTags,
      voiceTagDescriptions,
      setVoiceTagDescriptions,
      restaurantSearchVisible,
      setRestaurantSearchVisible,
      modeSelectorVisible,
      setModeSelectorVisible,
      activeGroupId,
      setActiveGroupId,
      activeGroupInfo,
      setActiveGroupInfo,
      appMode,
      setAppMode
    }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          <AuthenticatedLayout />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

// ルート要素としてAuthProviderを使用
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
