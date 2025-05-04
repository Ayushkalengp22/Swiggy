import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../App'; // Update path as needed
import {View, Button, Text, StyleSheet} from 'react-native';

export default function HomeScreen() {
  const {logout, userToken} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome to Home!</Text>
        <Text style={styles.tokenInfo}>Your session is active</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tokenInfo: {
    marginBottom: 20,
    color: 'green',
  },
});
