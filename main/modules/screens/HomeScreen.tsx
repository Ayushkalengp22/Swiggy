import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import {getAllRestro} from '../../../Api/login/user/getRestro';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors} from '../../../src/constants/Colors';

// Define your navigation parameter types
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

const foodCategories = [
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

interface CategoryItemProps {
  name: string;
  imageUrl: string;
}

const CategoryItem = ({name, imageUrl}: CategoryItemProps) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIconContainer}>
      <Image
        source={{uri: imageUrl}}
        style={styles.categoryIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </TouchableOpacity>
);

interface RestaurantCardProps {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  price?: string;
  discount?: string;
  imageUrl: string;
  location: string;
  isActive: boolean;
  onPress: () => void;
}

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

// Modified Header with direction-based animation
const Header = ({headerVisible}: any) => {
  const navigation = useNavigation<FoodAppNavigationProp>();

  // Calculate the animation values based on header visibility
  const addressOpacity = headerVisible;

  const addressHeight = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
    extrapolate: 'clamp',
  });

  const headerPadding = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 16],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingVertical: headerPadding,
          paddingHorizontal: 16,
        },
      ]}>
      <Animated.View
        style={[
          styles.locationContainer,
          {
            opacity: addressOpacity,
            height: addressHeight,
            overflow: 'hidden',
            marginBottom: addressHeight.interpolate({
              inputRange: [0, 40],
              outputRange: [0, 12],
              extrapolate: 'clamp',
            }),
          },
        ]}>
        <Text style={styles.locationLabel}>DELIVERY TO</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddressScreen')}
          style={styles.locationValue}>
          <Text style={styles.locationText}>Home - 221B, Baker Street</Text>
          <Text style={styles.locationArrow}>▼</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants and food"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const FoodBanner = () => (
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

interface Restaurant {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  isActive: boolean;
  price?: string;
  discount?: string;
  address: string;
}

const SimpleFoodDeliveryApp = () => {
  const navigation = useNavigation<FoodAppNavigationProp>();
  const [restros, setRestros] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Create animated values for scroll position and header visibility
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerVisible = useRef(new Animated.Value(1)).current;

  // Store the last scroll position to determine direction
  const lastScrollY = useRef(0);

  useEffect(() => {
    async function fetchRestros() {
      try {
        const response = await getAllRestro();
        if (response?.data && Array.isArray(response.data)) {
          setRestros(response.data);
        } else {
          setRestros([]);
        }
      } catch (error) {
        setRestros([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRestros();
  }, []);

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
    <>
      <SafeAreaView style={styles.safeAreaTop} />

      <SafeAreaView style={styles.container}>
        {/* Pass the headerVisible value to Header for animation */}
        <Header headerVisible={headerVisible} />

        {/* Use Animated.ScrollView instead of regular ScrollView */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
              listener: event => {
                const currentScrollY = event.nativeEvent.contentOffset.y;

                // Determine scroll direction and toggle header visibility
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

                // Update the last scroll position
                lastScrollY.current = currentScrollY;
              },
            },
          )}
          scrollEventThrottle={16}>
          <FoodBanner />

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

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Popular Restaurants</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6008" />
                <Text style={styles.loadingText}>Loading restaurants...</Text>
              </View>
            ) : restros.length > 0 ? (
              restros.map(restaurant => (
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

// Styles
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
  header: {
    backgroundColor: Colors.orange,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomEndRadius: 30,
    borderBottomLeftRadius: 30,
    zIndex: 999,
  },
  locationContainer: {
    marginBottom: 12,
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  locationValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationArrow: {
    marginLeft: 8,
    fontSize: 12,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  searchIcon: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 70,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 36,
    height: 36,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
  },
  activeNavText: {
    fontSize: 12,
    color: '#FF6008',
    fontWeight: 'bold',
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
