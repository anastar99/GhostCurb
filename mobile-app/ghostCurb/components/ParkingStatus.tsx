import React, { useEffect, useState } from 'react';
import {StyleSheet, FlatList, Text, View, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebaseConfig';


export default function ParkingStatus() {
    const [status, setStatus] = useState<boolean>(false);

    useEffect(() => {
        const statusRef = ref(database, "status");
        const logRef = ref(database, "logs");

        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setStatus(data.current);
            } else {
                console.error("No status data avaialble");
            }
        });

        return () => {
            unsubscribeStatus();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Parking Spot Status</Text>
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    {status ? "Available" : "Occuppied"}
                </Text>
            </View>
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