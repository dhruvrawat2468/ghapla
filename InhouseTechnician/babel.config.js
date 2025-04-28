module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
       // Add Nativewind plugin
      "react-native-reanimated/plugin", // This MUST be the last plugin!
    ],
  };
};