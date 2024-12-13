import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebaseConfig';

type LogEntry = {
  id: string;
  timeStamp: string;
  status: string;
};

export default function ParkingLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const logsRef = ref(database, 'logs');

    const unsubscribeLogs = onValue(
      logsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedLogs = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as Omit<LogEntry, 'id'>),
          }));
          setLogs(formattedLogs);
        } else {
          setLogs([]); // No logs available
        }
      },
      (error) => {
        Alert.alert('Error', 'Failed to fetch logs: ' + error.message);
      }
    );

    return () => {
      unsubscribeLogs();
    };
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logsTitle}>Status Change Logs:</Text>
      {logs.length === 0 ? (
        <Text style={styles.noLogsText}>No logs available.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logContainer}>
              <Text style={styles.logText}>{formatDate(item.timeStamp)}</Text>
              <Text style={styles.statusText}>
                {item.status === 'available' ? 'Available' : 'Occupied'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noLogsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  logContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
});
