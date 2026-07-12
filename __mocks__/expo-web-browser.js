module.exports = {
  openBrowserAsync: jest.fn(() => Promise.resolve()),
  openAuthSessionAsync: jest.fn(() => Promise.resolve()),
  maybeCompleteAuthSession: jest.fn(),
};
