// src/components/RestaurantCard.js
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {RestaurantCardProps} from '../types';

const RestaurantCard = ({
  name,
  cuisine,
  rating,
  deliveryTime,
  price,
  discount,
  imageUrl,
  location,
  onPress,
}: RestaurantCardProps) => (
  <TouchableOpacity style={styles.restaurantCard} onPress={onPress}>
    <Image source={{uri: imageUrl}} style={styles.restaurantImage} />
    {discount && (
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{discount}</Text>
      </View>
    )}
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName}>{name}</Text>
      <Text style={styles.restaurantCuisine}>{cuisine}</Text>
      <Text style={styles.restaurantLocation}>{location}</Text>
      <View style={styles.restaurantMeta}>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {rating}</Text>
        </View>
        <Text style={styles.metaSeparator}>•</Text>
        <Text style={styles.deliveryTime}>{deliveryTime}</Text>
        {price && (
          <>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.price}>{price}</Text>
          </>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 0,
    backgroundColor: '#1E88E5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaSeparator: {
    marginHorizontal: 6,
    color: '#999',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 12,
    color: '#666',
  },
});

export default RestaurantCard;
