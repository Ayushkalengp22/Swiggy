// src/components/Restaurant/RestaurantCard.js
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface RestroCard {
  restaurantName: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  location: string;
}
const RestaurantCard = ({
  restaurantName,
  cuisine,
  rating,
  deliveryTime,
  location,
}: RestroCard) => {
  return (
    <View style={styles.restaurantCard}>
      <View style={styles.badgeRow}>
        <View style={styles.bestInBadge}>
          <Text style={styles.bestInText}>🏆 Best In {cuisine}</Text>
        </View>
        <View style={styles.swiggyBadge}>
          <Text style={styles.swiggyBadgeText}>✓ Swiggy Seal</Text>
        </View>
      </View>

      <Text style={styles.restaurantName}>{restaurantName}</Text>

      <View style={styles.restaurantInfoRow}>
        <Text style={styles.deliveryTime}>{deliveryTime || ''}</Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>{rating || ''} ★</Text>
        </View>
        <Text style={styles.ratingCount}>4.2K+ ratings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bestInBadge: {
    marginRight: 8,
  },
  bestInText: {
    color: '#7E5C00',
    fontSize: 14,
  },
  swiggyBadge: {
    marginLeft: 4,
  },
  swiggyBadgeText: {
    color: '#5459DB',
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C0B0B',
    marginBottom: 4,
  },
  restaurantInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTime: {
    color: '#666',
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    color: '#666',
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    backgroundColor: '#367E4B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  ratingCount: {
    color: '#666',
    fontSize: 14,
  },
});

export default RestaurantCard;
