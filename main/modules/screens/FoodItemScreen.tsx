import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, RouteProp} from '@react-navigation/native';
import {getFoodItems} from '../../../Api/login/user/getFoodItem';

// Define the type for your route parameters
type RootStackParamList = {
  FoodItemScreen: {
    restaurantId: number;
    restaurantName: string;
  };
};

type FoodItemScreenRouteProp = RouteProp<RootStackParamList, 'FoodItemScreen'>;

// Define the type for food items
type FoodItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
};

const FoodItem = () => {
  // Get the route object which contains the params
  const route = useRoute<FoodItemScreenRouteProp>();

  // Extract the params
  const {restaurantId, restaurantName} = route.params;
  console.log(restaurantId, restaurantName);

  // State for food items
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await getFoodItems(restaurantId.toString());
        setFoodItems(response.data || []);
        setLoading(false);
        console.log(JSON.stringify(response, null, 2), '======dsasda');
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load menu items. Please try again.');
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [restaurantId]);

  // Render each food item
  const renderFoodItem = ({item}: {item: FoodItem}) => (
    <View style={styles.foodItemContainer}>
      {item.imageUrl && (
        <Image
          source={{uri: item.imageUrl}}
          style={styles.foodImage}
          defaultSource={require('../../../src/assets/arrow_left.png')} // Replace with your placeholder image
        />
      )}
      <View style={styles.foodDetails}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>{item.description}</Text>
        <Text style={styles.foodPrice}>Rs.{item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>
        <Text style={styles.restaurantId}>Restaurant ID: {restaurantId}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.menuTitle}>Menu Items</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : foodItems.length === 0 ? (
          <Text style={styles.noItemsText}>No menu items available.</Text>
        ) : (
          <FlatList
            data={foodItems}
            renderItem={renderFoodItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FoodItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantId: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  foodItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  foodDetails: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  foodDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0066CC',
  },
});
