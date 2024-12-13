import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Text, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function OccupancyTrendChart() {
  // Sample data, replace it with your actual data
  const data = {
    labels: ['10:00', '11:00', '12:00', '13:00', '14:00'], // Time labels
    datasets: [
      {
        data: [1, 0, 1, 0, 1], // 1 = Available, 0 = Occupied
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green for Available
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <Text>Occupancy Trend</Text>
      <LineChart
        data={data}
        width={screenWidth - 20} // Adjust width
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f8f8f8',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0, // No decimal for occupancy
          color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Line color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Axis label color
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}
