module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-classname-to-dynamic-style',
    [
      'react-native-platform-specific-extensions',
      {
        extensions: ['scss', 'css'],
      },
    ],
  ],
};
