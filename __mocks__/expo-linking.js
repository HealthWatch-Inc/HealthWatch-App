module.exports = {
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  createURL: jest.fn(() => ''),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};
