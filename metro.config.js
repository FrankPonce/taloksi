const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// zustand's ESM build uses `import.meta`, which Metro's web bundle can't run.
// Preferring the `require` condition makes Metro pick the CommonJS build.
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
