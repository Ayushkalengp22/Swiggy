// src/components/UI/LoadingIndicator.js
import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export const LoadingIndicator = ({message = 'Loading...'}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0066CC" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

// src/components/UI/ErrorDisplay.js
export const ErrorDisplay = ({message}: any) => {
  return <Text style={styles.errorText}>{message}</Text>;
};

// src/components/UI/EmptyState.js
export const EmptyState = ({message = 'No items available.'}) => {
  return <Text style={styles.emptyText}>{message}</Text>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
