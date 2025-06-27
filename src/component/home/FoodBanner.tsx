import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const FoodBanner: React.FC = () => (
  <TouchableOpacity style={styles.foodBanner}>
    <View style={styles.bannerContent}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>FOOD DELIVERY</Text>
        <Text style={styles.bannerSubtitle}>DELICIOUS FOOD YOU ❤️</Text>
        <Text style={styles.bannerOffer}>UP TO 60% OFF & FREE DELIVERY</Text>
      </View>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/4039/4039232.png',
        }}
        style={styles.bannerImage}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  foodBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  bannerOffer: {
    fontSize: 16,
    color: '#FF6008',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
});

export default FoodBanner;
