import React, { useState } from 'react';
import { requestPhoneNumberHint } from 'expo-phone-number-hint-autofill';
import { Button, ScrollView, Text, View, Alert } from 'react-native';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestPhoneNumberHint = async () => {
    setLoading(true);
    try {
      const result = await requestPhoneNumberHint();
      if (result.success) {
        setPhoneNumber(result.phoneNumber);
        Alert.alert('Success', `Phone number retrieved: ${result.phoneNumber}`);
      } else {
        Alert.alert('Error', result.error || 'Failed to get phone number');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Phone Number Hint Example</Text>
        
        <Group name="Phone Number Hint API">
          <Text style={styles.description}>
            This module uses Google Play Services Phone Number Hint API to retrieve the user's phone number on Android.
          </Text>
          
          <Button
            title={loading ? "Loading..." : "Request Phone Number Hint"}
            onPress={handleRequestPhoneNumberHint}
            disabled={loading}
          />
          
          {phoneNumber ? (
            <Text style={styles.phoneNumber}>
              Retrieved: {phoneNumber}
            </Text>
          ) : (
            <Text style={styles.placeholder}>
              No phone number retrieved yet
            </Text>
          )}
        </Group>
      </ScrollView>
    </View>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#007AFF',
    marginTop: 15,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    fontStyle: 'italic' as const,
  },
};
