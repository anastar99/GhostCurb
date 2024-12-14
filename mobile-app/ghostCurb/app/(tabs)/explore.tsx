import React, { useState, useEffect } from 'react';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { View, Text, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { ref, onValue } from 'firebase/database'; // Firebase imports
import { database } from '@/firebaseConfig';

const screenWidth = Dimensions.get('window').width;

export default function ParkingCharts() {
  const [trendChartData, setTrendChartData] = useState(null); // State for trend chart data
  const [eventChartData, setEventChartData] = useState(null); // State for event frequency chart data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchLogs = async () => {
      const logsRef = ref(database, 'logs');
      onValue(
        logsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Data for Trend Chart
            const trendLabels = [];
            const trendValues = [];

            // Data for Event Frequency Chart
            const eventCounts = new Array(24).fill({ occupied: 0, available: 0 });

            Object.entries(data).forEach(([logKey, logValue]) => {
              const { status, timeStamp } = logValue;

              // Format timestamp for trend chart
              const date = new Date(timeStamp);
              const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
              trendLabels.push(formattedTime);
              trendValues.push(status === false ? 1 : 0); // 1 = Occupied, 0 = Available

              // Count events for event chart
              const hour = date.getHours();
              eventCounts[hour] = {
                occupied: eventCounts[hour].occupied + (status === false ? 1 : 0),
                available: eventCounts[hour].available + (status === true ? 1 : 0),
              };
            });

            // Prepare Event Chart Data
            const eventLabels = [];
            const occupiedCounts = [];
            const availableCounts = [];

            eventCounts.forEach((counts, hour) => {
              eventLabels.push(`${hour}:00`);
              occupiedCounts.push(counts.occupied);
              availableCounts.push(counts.available);
            });

            // Set data for both charts
            setTrendChartData({
              labels: trendLabels,
              datasets: [
                {
                  data: trendValues,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for occupied
                  strokeWidth: 2,
                },
              ],
            });

            setEventChartData({
              labels: eventLabels,
              datasets: [
                {
                  data: occupiedCounts,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for occupied events
                },
                {
                  data: availableCounts,
                  color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for available events
                },
              ],
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching logs:', error);
          setLoading(false);
        }
      );
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Occupancy Trend Chart */}
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, color: 'white' }}>Occupancy Trend</Text> {/* Changed text color to white */}
        {trendChartData ? (
          <LineChart
            data={trendChartData}
            width={screenWidth - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f8f8f8',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        ) : (
          <Text>No Data Available</Text>
        )}
      </View>

      {/* Parking Event Frequency Chart */}
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, color: 'white' }}>Parking Event Frequency</Text> {/* Changed text color to white */}
        {eventChartData ? (
          <BarChart
            data={{
              labels: eventChartData.labels,
              datasets: [
                {
                  data: eventChartData.datasets[0].data,
                  color: eventChartData.datasets[0].color,
                },
                {
                  data: eventChartData.datasets[1].data,
                  color: eventChartData.datasets[1].color,
                },
              ],
            }}
            width={screenWidth - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" events"
            fromZero={true} // Ensure bars start from 0
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f8f8f8',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.7, // Adjust bar width
              style: { borderRadius: 16 },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        ) : (
          <Text>No Data Available</Text>
        )}
      </View>
    </ScrollView>
  );
}
