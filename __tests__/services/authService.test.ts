jest.mock('../../config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      email: 'test@test.com',
      getIdToken: jest.fn(() => Promise.resolve('mock-token')),
    },
  },
}));

import { authService } from '../../services/authService';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth';

const mockUser = { uid: 'uid-123', email: 'test@test.com' };

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: Object.assign(jest.fn(() => ({})), {
    credentialFromResult: jest.fn(() => ({ accessToken: 'mock-token' })),
    credentialFromError: jest.fn(() => ({})),
  }),
  getReactNativePersistence: jest.fn(() => ({})),
  initializeAuth: jest.fn(() => ({})),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login()', () => {
    it('llama a signInWithEmailAndPassword con auth, email y password', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      const result = await authService.login('test@test.com', 'password123');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@test.com',
        'password123',
      );
      expect(result).toEqual(mockUser);
    });

    it('lanza error si las credenciales son incorrectas', async () => {
      const error = new Error('auth/wrong-password');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      await expect(authService.login('test@test.com', 'wrong')).rejects.toThrow(
        'auth/wrong-password',
      );
    });
  });

  describe('register()', () => {
    it('llama a createUserWithEmailAndPassword con auth, email y password', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      const result = await authService.register('new@test.com', 'password123');
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'new@test.com',
        'password123',
      );
      expect(result).toEqual(mockUser);
    });

    it('lanza error si el email ya existe', async () => {
      const error = new Error('auth/email-already-exists');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      await expect(
        authService.register('exists@test.com', 'password123'),
      ).rejects.toThrow('auth/email-already-exists');
    });
  });

  describe('logout()', () => {
    it('llama a signOut con auth', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);
      await authService.logout();
      expect(signOut).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('googleLogin()', () => {
    it('retorna usuario si Google login es exitoso', async () => {
      (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
      const result = await authService.googleLogin();
      expect(result).toEqual(mockUser);
    });

    it('lanza error si Google login falla', async () => {
      const error = Object.assign(new Error('auth/popup-closed'), {
        code: 'auth/popup-closed',
        customData: { email: 'test@test.com' },
      });
      (signInWithPopup as jest.Mock).mockRejectedValue(error);
      await expect(authService.googleLogin()).rejects.toThrow(
        'auth/popup-closed',
      );
    });
  });
});
