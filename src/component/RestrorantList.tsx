// src/components/RestaurantList.js
import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
// import RestaurantCard from './RestaurantCard';
import RestaurantCard from './RestroCardComponent';
import {Restaurant} from '../types';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';

type FoodAppNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface RestaurantListProps {
  loading: boolean;
  restaurants: Restaurant[];
}

const RestaurantList = ({loading, restaurants}: RestaurantListProps) => {
  const navigation = useNavigation<FoodAppNavigationProp>();

  const navigateToFoodScreen = (
    restaurantId: number,
    restaurantName: string,
    cuisine: string,
    rating: number,
    deliveryTime: string,
    location: string,
  ) => {
    navigation.navigate('FoodItemScreen', {
      restaurantId,
      restaurantName,
      cuisine,
      rating,
      deliveryTime,
      location,
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Popular Restaurants</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6008" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : restaurants.length > 0 ? (
        restaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            {...restaurant}
            onPress={() =>
              navigateToFoodScreen(
                restaurant.id,
                restaurant.name,
                restaurant.cuisine,
                restaurant.rating,
                restaurant.deliveryTime,
                restaurant.address,
              )
            }
          />
        ))
      ) : (
        <Text style={styles.noRestaurantsText}>
          No restaurants available at the moment.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  noRestaurantsText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
});

export default RestaurantList;
