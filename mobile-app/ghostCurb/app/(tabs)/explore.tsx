import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import { ref, push } from 'firebase/database';
import { database } from '@/firebaseConfig'; // Adjust the path as needed
import ParkingLogs from '@/components/ParkingLogs';

export default function ExploreScreen() {
  const [name, setName] = useState('');

  const handleSaveName = () => {
    if (name.trim()) {
      // Get a reference to the 'users' path
      const namesRef = ref(database, 'users');

      // Use push() to add a new name without overwriting existing data
      push(namesRef, {
        name: name,
      })
        .then(() => {
          Alert.alert('Success', 'Name added successfully!');
          setName(''); // Clear input after saving
        })
        .catch((error) => {
          Alert.alert('Error', `Failed to add name: ${error.message}`);
        });
    } else {
      Alert.alert('Error', 'Please enter a name');
    }
  };

  return (
    // <View style={styles.container}>
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Enter your name"
    //     value={name}
    //     onChangeText={setName}
    //     placeholderTextColor="#aaa"
    //   />
    //   <Button title="Save Name" onPress={handleSaveName} />
    // </View>

    <ParkingLogs />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: '#fff',
    backgroundColor: '#333',
  },
});

