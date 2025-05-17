// src/screens/Restaurant/RestaurantScreen.js
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

// API
import {getFoodItems} from '../../../Api/login/user/getFoodItem';

// Components
import BackHeader from '../../../src/component/HeaderComponent';
import RestaurantCard from '../../../src/component/RestroCardComponent';
import FoodItem from '../../../src/component/FoodItemComponent';
import CartSummary from '../../../src/component/CartSummary';
import FloatingButton from '../../../src/component/FlootingMenuButton';
import {
  LoadingIndicator,
  ErrorDisplay,
  EmptyState,
} from '../../../src/component/LodingAndError';

// Types
import {FoodItem as FoodItemType, CartItem} from '../../../src/types/index';

// Define the type for your route parameters
type RootStackParamList = {
  FoodItemScreen: {
    restaurantId: number;
    restaurantName: string;
    cuisine: string;
    rating: number;
    deliveryTime: number;
    location: string;
  };
};

type FoodItemScreenRouteProp = RouteProp<RootStackParamList, 'FoodItemScreen'>;

const RestaurantScreen = () => {
  // Get the route object which contains the params
  const route = useRoute<FoodItemScreenRouteProp>();
  const navigation = useNavigation();
  // Extract the params
  const {
    restaurantId,
    restaurantName,
    cuisine,
    rating,
    deliveryTime,
    location,
  } = route.params;

  // State for food items
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  console.log(cart, 'Cart========+++++++++');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedFoodDesc, setSelectedFoodDesc] = useState<string | null>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%'], []);

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
          (item: FoodItemType) => ({
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
  const incrementItemQuantity = (item: FoodItemType) => {
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
  const decrementItemQuantity = (item: FoodItemType) => {
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

  // Handle view cart button press
  const handleViewCart = () => {
    // Navigate to cart screen or show cart modal
    console.log('View cart pressed - total amount:', totalAmount);
  };

  // Handle menu button press
  const handleMenuPress = () => {
    console.log('Menu button pressed');
    // Implementation for showing menu categories
  };

  // Calculate bottom padding for the list to account for the cart summary when visible
  const getBottomPadding = () => {
    return totalItems > 0 ? 80 : 0; // Height of cart summary + some extra padding
  };

  // Render the main content based on loading/error state
  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator message="Loading menu items..." />;
    }

    if (error && foodItems.length === 0) {
      return <ErrorDisplay message={error} />;
    }

    if (foodItems.length === 0) {
      return <EmptyState message="No menu items available." />;
    }

    return (
      <FlatList
        data={foodItems}
        renderItem={({item}) => (
          <FoodItem
            item={item}
            onIncrement={incrementItemQuantity}
            onDecrement={decrementItemQuantity}
            onMoreDetails={() => {
              setSelectedFoodDesc(item.description); // or whatever field holds the desc
              bottomSheetRef.current?.expand();
            }}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          {paddingBottom: getBottomPadding() + 70},
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BackHeader title="" />
      <RestaurantCard
        restaurantName={restaurantName}
        cuisine={cuisine}
        rating={rating}
        deliveryTime={deliveryTime}
        location={location}
      />

      {/* Recent Orders Section Title */}
      <Text style={styles.sectionTitle}>Want to repeat?</Text>

      {/* Main Content */}
      <View style={[styles.content, {paddingBottom: getBottomPadding()}]}>
        {renderContent()}
      </View>

      {/* Floating Menu Button */}
      <FloatingButton label="MENU" onPress={handleMenuPress} />

      {/* Cart Summary - will appear only when cart has items */}
      {totalItems > 0 && (
        <CartSummary
          totalItems={totalItems}
          totalAmount={totalAmount}
          slideAnimation={slideAnimation}
          onViewCart={handleViewCart}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  listContainer: {
    paddingBottom: 20,
  },
});

export default RestaurantScreen;
