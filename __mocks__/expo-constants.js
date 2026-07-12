module.exports = {
  expoConfig: {
    extra: { eas: { projectId: 'test-project-id' } },
  },
  easConfig: { projectId: 'test-project-id' },
  default: {
    expoConfig: {
      extra: { eas: { projectId: 'test-project-id' } },
    },
    easConfig: { projectId: 'test-project-id' },
  },
  manifest: {},
  executionEnvironment: 'storeClient',
};
