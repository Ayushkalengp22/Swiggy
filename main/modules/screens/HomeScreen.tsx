import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors} from '../../../src/constants/Colors';

// Components
import Header from '../../../src/component/home/Header';
import FoodBanner from '../../../src/component/home/FoodBanner';
import CategoryItem from '../../../src/component/home/CategoryItem';
import RestaurantCard from '../../../src/component/home/RestaurantCard';

// Hooks and Data
import {useUserData} from '../../../src/hooks/useUserData';
import {useRestaurants} from '../../../src/hooks/useRestaurants';
// import {foodCategories} from '../../../src/data/foodCategories';

export const foodCategories = [
  {
    id: 1,
    name: 'Burgers',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
  },
  {
    id: 2,
    name: 'Pizza',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
  },
  {
    id: 3,
    name: 'Sushi',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1700/1700525.png',
  },
  {
    id: 4,
    name: 'Desserts',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081967.png',
  },
  {
    id: 5,
    name: 'Indian',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2515/2515203.png',
  },
];
// Types
type RootStackParamList = {
  Home: undefined;
  FoodItemScreen: {
    restaurantId: number;
    restaurantName: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    location: string;
  };
  AddressScreen: undefined;
};

type FoodAppNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const SimpleFoodDeliveryApp: React.FC = () => {
  const navigation = useNavigation<FoodAppNavigationProp>();

  // Custom hooks
  const {userData, loading: userLoading} = useUserData();
  const {restaurants, loading: restaurantsLoading} = useRestaurants();
  console.log(userData, '=======');
  // Animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerVisible = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

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

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY.current + 2) {
      // Scrolling down - hide header
      Animated.timing(headerVisible, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    } else if (currentScrollY < lastScrollY.current - 2) {
      // Scrolling up - show header
      Animated.timing(headerVisible, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaTop} />
      <SafeAreaView style={styles.container}>
        <Header
          headerVisible={headerVisible}
          userData={userData}
          userLoading={userLoading}
        />

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
              listener: handleScroll,
            },
          )}
          scrollEventThrottle={16}>
          <FoodBanner />

          {/* Food Categories */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Food Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}>
              {foodCategories.map(category => (
                <CategoryItem
                  key={category.id}
                  name={category.name}
                  imageUrl={category.imageUrl}
                />
              ))}
            </ScrollView>
          </View>

          {/* Popular Restaurants */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Popular Restaurants</Text>
            {restaurantsLoading ? (
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
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: Colors.orange,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingBottom: 20,
  },
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
  categoriesContainer: {
    paddingVertical: 8,
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

export default SimpleFoodDeliveryApp;
