import { StyleSheet, Image, Platform, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { database } from '@/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';


export default function ParkingStatus() {

    const [status, setStatus] = useState<boolean>(false);

    useEffect(() => {
  
      const statusRef = ref(database, "status");
  
      const unsubscribeStatus = onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setStatus(data.current);
        } else {
          console.error("No status data available");
        }
      });
  
      return () => {
        unsubscribeStatus();
      }
  
  
    }, [])
  
  
      return (
      <View style={styles.container}>
        <Text style={styles.title}>Parking Spot Status: {status ? "Available" : "Occupied"}</Text>
        <View style={styles.statusContainer}>
            {status ? (
            <FontAwesome name="car" size={150} color="black" />
            ) : (
            <MaterialCommunityIcons name="ghost" size={150} color="black" />
            )}
        </View>
      </View>
    );
  }


  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingTop: 100,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10, // Reduce margin for tighter spacing
    },
    statusContainer: {
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 10, // Reduce margin between components
      elevation: 2, // Shadow for Android
      shadowColor: "#000", // Shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
  });
  