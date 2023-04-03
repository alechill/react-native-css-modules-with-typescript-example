import React from 'react';
import {Text, View} from 'react-native';
import styles from './Responsive.css';

const ResponsiveText = () => {
  return <Text className={styles.responsiveText}>Responsive Text</Text>;
};

export const Responsive = () => {
  return (
    <View className={styles.container}>
      <ResponsiveText />
    </View>
  );
};
