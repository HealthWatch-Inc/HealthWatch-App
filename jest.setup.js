jest.mock('@react-native-async-storage/async-storage', () => {
  const mockStorage = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(mockStorage[key] ?? null)),
      setItem: jest.fn((key, value) => {
        mockStorage[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete mockStorage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
        return Promise.resolve();
      }),
    },
    getItem: jest.fn((key) => Promise.resolve(mockStorage[key] ?? null)),
    setItem: jest.fn((key, value) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
      return Promise.resolve();
    }),
  };
});

jest.mock('./config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      email: 'test@test.com',
      getIdToken: jest.fn(() => Promise.resolve('mock-token')),
    },
  },
}), { virtual: true });
