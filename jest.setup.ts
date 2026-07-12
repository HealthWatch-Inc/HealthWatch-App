import '@testing-library/react-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'es' }]),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
  Link: ({ children }: any) => children,
  Redirect: ({ href }: any) => null,
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
  easConfig: { projectId: 'test-project-id' },
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: 'test-project-id',
        },
      },
    },
    easConfig: { projectId: 'test-project-id' },
  },
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => ({ data: 'test-token' })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  setNotificationChannelAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
  },
  AndroidImportance: {
    MAX: 5,
  },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

jest.mock('firebase/auth', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    getIdToken: jest.fn(() => Promise.resolve('mock-token')),
  };

  return {
    getAuth: jest.fn(() => ({ currentUser: mockUser })),
    initializeAuth: jest.fn(() => ({ currentUser: mockUser })),
    getReactNativePersistence: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn(() => jest.fn()),
  };
});

jest.mock('../config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
      getIdToken: jest.fn(() => Promise.resolve('mock-token')),
    },
  },
}), { virtual: true });
