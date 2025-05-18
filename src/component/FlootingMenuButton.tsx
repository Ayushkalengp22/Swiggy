// src/components/Buttons/FloatingButton.js
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {defaultSpace} from '../lib/deviceHelper';

const FloatingButton = ({label, onPress}: any) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.floatingButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 36,
    right: 20,
    backgroundColor: '#1C0B0B',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FloatingButton;
