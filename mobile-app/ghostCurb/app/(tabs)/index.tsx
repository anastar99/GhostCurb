import { StyleSheet, View } from 'react-native';
import React from 'react';
import ParkingStatus from '@/components/ParkingStatus';
import ParkingLogs from '@/components/ParkingLogs';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ParkingStatus />
      <ParkingLogs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Match the background color
    padding: 0, // Remove extra padding
  },
});

