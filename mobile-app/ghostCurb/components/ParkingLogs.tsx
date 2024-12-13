import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebaseConfig';

type LogEntry = {
    id: string;
    timeStamp: string;
    status: string;
}

export default function ParkingLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);


    useEffect(() => {

        const logsRef = ref(database, "logs");
        
        const unsubscribeLogs = onValue(logsRef, (snapshot)=> {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedLogs = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...(value as Omit<LogEntry, "id">),
                }));
                setLogs(formattedLogs)
            } 
        });

        return () => {
            unsubscribeLogs();
        }
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.logsTitle}>Status Change Logs:</Text>
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <Text style={styles.logText}>
                        {item.timeStamp}: {item.status === "available" ? "Available" : "Occupied"}
                    </Text>
                    )}
                />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    statusContainer: {
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 20,
      elevation: 2, // Shadow for Android
      shadowColor: "#000", // Shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    statusText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    logsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
    },
    logText: {
      fontSize: 16,
      marginBottom: 5,
    },
  });