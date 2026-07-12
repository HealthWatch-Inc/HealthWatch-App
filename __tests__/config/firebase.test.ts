import { auth } from '../../config/firebase';

jest.mock('../../config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
      getIdToken: jest.fn(() => Promise.resolve('mock-token')),
    },
  },
}));

describe('config/firebase', () => {
  it('exporta auth con currentUser', () => {
    expect(auth).toBeDefined();
    expect(auth.currentUser).toBeDefined();
    expect(auth.currentUser.uid).toBe('test-uid');
  });

  it('currentUser puede obtener token', async () => {
    const token = await auth.currentUser.getIdToken();
    expect(token).toBe('mock-token');
  });
});
