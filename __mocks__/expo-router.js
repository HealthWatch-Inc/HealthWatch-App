const React = require('react');
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
};

module.exports = {
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
  useSegments: jest.fn(() => []),
  Link: ({ children, href, asChild, ...props }) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ...props, onPress: () => {} });
    }
    return React.createElement('a', { href, ...props }, children);
  },
  Redirect: ({ href }) => null,
  Stack: {
    Screen: () => null,
    Navigator: ({ children }) => children,
  },
  Tabs: {
    Screen: () => null,
    Navigator: ({ children }) => children,
  },
  router: mockRouter,
};
