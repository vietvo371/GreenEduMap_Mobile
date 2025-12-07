module.exports = {
  dependencies: {
    // Temporarily exclude react-native-vision-camera due to compilation issues with RN 0.81.1
    'react-native-vision-camera': {
      platforms: {
        android: null,
      },
    },
  },
};
