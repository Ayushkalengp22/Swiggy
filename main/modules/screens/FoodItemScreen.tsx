import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, RouteProp} from '@react-navigation/native';
import {getFoodItems} from '../../../Api/login/user/getFoodItem';
import {defaultSpace} from '../../../src/lib/deviceHelper';

// Define the type for your route parameters
type RootStackParamList = {
  FoodItemScreen: {
    restaurantId: number;
    restaurantName: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    location: string;
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
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  quantity?: number; // Added quantity field
};

// Define type for cart items
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const RestaurantScreen = () => {
  // Get the route object which contains the params
  const route = useRoute<FoodItemScreenRouteProp>();

  // Extract the params
  const {
    restaurantId,
    restaurantName,
    cuisine,
    rating,
    deliveryTime,
    location,
  } = route.params;
  console.log(location);
  // State for food items
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Animation for cart summary
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await getFoodItems(restaurantId.toString());
        // Initialize quantity as 0 for each item
        const itemsWithQuantity = (response.data || []).map(
          (item: FoodItem) => ({
            ...item,
            quantity: 0,
          }),
        );
        setFoodItems(itemsWithQuantity);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load menu items. Please try again.');
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [restaurantId]);

  // Update cart totals whenever cart changes
  useEffect(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    setTotalItems(items);
    setTotalAmount(amount);

    // Animate the cart summary
    Animated.timing(slideAnimation, {
      toValue: items > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [cart]);

  // Function to add item to cart
  const incrementItemQuantity = (item: FoodItem) => {
    // Update foodItems state
    const updatedFoodItems = foodItems.map(foodItem => {
      if (foodItem.id === item.id) {
        return {...foodItem, quantity: (foodItem.quantity || 0) + 1};
      }
      return foodItem;
    });
    setFoodItems(updatedFoodItems);

    // Update cart state
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id,
    );

    if (existingItemIndex !== -1) {
      // Item exists in cart, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Item doesn't exist in cart, add it
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  // Function to remove item from cart
  const decrementItemQuantity = (item: FoodItem) => {
    // Find the item in the cart
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id,
    );

    if (existingItemIndex === -1) return; // Item not in cart

    // Update foodItems state
    const updatedFoodItems = foodItems.map(foodItem => {
      if (
        foodItem.id === item.id &&
        foodItem.quantity &&
        foodItem.quantity > 0
      ) {
        return {...foodItem, quantity: foodItem.quantity - 1};
      }
      return foodItem;
    });
    setFoodItems(updatedFoodItems);

    // Update cart state
    const updatedCart = [...cart];
    if (updatedCart[existingItemIndex].quantity > 1) {
      // Reduce quantity
      updatedCart[existingItemIndex].quantity -= 1;
      setCart(updatedCart);
    } else {
      // Remove item from cart
      updatedCart.splice(existingItemIndex, 1);
      setCart(updatedCart);
    }
  };

  // Calculate bottom padding for the list to account for the cart summary when visible
  const getBottomPadding = () => {
    return totalItems > 0 ? 80 : 0; // Height of cart summary + some extra padding
  };

  // Render each food item
  const renderFoodItem = ({item}: {item: FoodItem}) => (
    <View style={styles.foodItemContainer}>
      <View style={styles.foodDetails}>
        {item.isBestseller && (
          <View style={styles.bestsellerContainer}>
            <Text style={styles.bestsellerText}>♨️ Bestseller</Text>
          </View>
        )}
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>₹{item.price}</Text>

        {item.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
            {item.reviewCount && (
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            )}
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistIcon}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsText}>More Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{uri: item.imageUrl}}
            style={styles.foodImage}
            defaultSource={require('../../../src/assets/arrow_left.png')}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}

        {/* Item quantity control */}
        {item.quantity && item.quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decrementItemQuantity(item)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => incrementItemQuantity(item)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => incrementItemQuantity(item)}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Cart summary animation style
  const cartSummaryStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Slide up from below the screen
        }),
      },
    ],
    opacity: slideAnimation,
  } as any; // Type assertion to avoid TypeScript errors

  // Separate style for positioning (using literal values)
  const cartPositionStyle = {
    position: 'absolute' as const,
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 10,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button and group order row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant card */}
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
          <Text style={styles.locationText}>Wardhaman Nagar</Text>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{rating || ''} ★</Text>
          </View>
          <Text style={styles.ratingCount}>4.2K+ ratings</Text>
        </View>
      </View>

      {/* Want to repeat section */}
      <Text style={styles.sectionTitle}>Want to repeat?</Text>

      {/* Food items list */}
      <View style={[styles.content, {paddingBottom: getBottomPadding()}]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : error && foodItems.length === 0 ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : foodItems.length === 0 ? (
          <Text style={styles.noItemsText}>No menu items available.</Text>
        ) : (
          <FlatList
            data={foodItems}
            renderItem={renderFoodItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              {paddingBottom: getBottomPadding() + 70}, // Add extra space for the menu button
            ]}
            horizontal={false}
          />
        )}
      </View>

      {/* Menu button */}
      <TouchableOpacity style={styles.floatingMenuButton}>
        <Text style={styles.floatingMenuText}>MENU</Text>
      </TouchableOpacity>

      {/* Cart summary - will appear only when cart has items */}
      {totalItems > 0 && (
        <Animated.View
          style={[styles.cartSummary, cartPositionStyle, cartSummaryStyle]}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} added
            </Text>
          </View>
          <TouchableOpacity style={styles.viewCartButton}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Text style={styles.viewCartIcon}>›</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C0B0B',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  menuButton: {
    padding: 4,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: defaultSpace,
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
  offerIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C0B0B',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
  noItemsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  foodItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodDetails: {
    flex: 1,
    paddingRight: 12,
  },
  bestsellerContainer: {
    marginBottom: 6,
  },
  bestsellerText: {
    color: '#FF6A3D',
    fontSize: 12,
    fontWeight: '600',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0B0B',
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C0B0B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  reviewCount: {
    color: '#888',
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistButton: {
    marginRight: 10,
  },
  wishlistIcon: {
    fontSize: 20,
    color: '#F08E55',
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  detailsText: {
    color: '#666',
    fontSize: 12,
  },
  imageContainer: {
    width: 120,
    alignItems: 'center',
  },
  foodImage: {
    width: 120,
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 120,
    height: 100,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 14,
  },
  // Quantity control styles
  quantityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 16,
  },
  quantityText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    minWidth: 30,
  },
  // Cart summary styles
  cartSummary: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cartInfo: {
    flex: 1,
  },
  cartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cartPromo: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  viewCartText: {
    color: '#28A745',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  viewCartIcon: {
    color: '#28A745',
    fontSize: 20,
    fontWeight: '700',
  },
  floatingMenuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1C0B0B',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it's above the cart summary
  },
  floatingMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
