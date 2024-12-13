import React, { useEffect, useState } from 'react';
import {StyleSheet, FlatList, Text, View, Alert, Image, Platform, StatusBar} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebaseConfig';
import ParkingStatus from '@/components/ParkingStatus';
import ParkingLogs from '@/components/ParkingLogs';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const [names, setNames] = useState<string[]>([]);



  useEffect(() => {
    const namesRef = ref(database, 'users');

    const unsubscribe = onValue(
      namesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const namesArray = Object.values(data).map((item: any) => item.name);
          setNames(namesArray);
        } else {
          setNames([]);
        }
      },
      (error) => {
        Alert.alert('Error', `Faied to fetch names: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, []);

  return (

    // <ThemedView
    //   style={{
    //     flex: 1,
    //     padding: 10,
    //     paddingTop: Platform.OS == "android" ? StatusBar.currentHeight: 10,
    //   }}
    // >

    //   <SafeAreaView style={{ flex:1 }}>
    //     <ThemedText type="subtitle">Your push token:</ThemedText>
    //     <ThemedText>{expoPushToken}</ThemedText>
    //     <ThemedText type="subtitle">latest Notification:</ThemedText>
    //     <ThemedText>{notification?.request.content.title}</ThemedText>
    //     <ThemedText>
    //       {JSON.stringify(notification?.request.content.data, null, 2)}
    //     </ThemedText>
    //   </SafeAreaView>

    // </ThemedView>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Names List</Text>
    //   <FlatList
    //     data={names}
    //     keyExtractor={(item, index) => index.toString()}
    //     renderItem={({ item }) => <Text style={styles.name}>{item}</Text>}
    //     ListEmptyComponent={<Text style={styles.empty}>No names available.</Text>}
    //   />
    // </View>

    <>
          <ParkingStatus />
          <ParkingLogs />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background for contrast
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    color: '#fff',
    padding: 8,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  empty: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 16,
  },
});