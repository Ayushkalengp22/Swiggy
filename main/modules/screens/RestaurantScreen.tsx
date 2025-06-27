import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
  Alert,
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

// Hooks
import {useCart} from '../../../src/hooks/useCart';

// Types
import {
  FoodItem as FoodItemType,
  CartItem,
  RestaurantInfo,
  CartData,
} from '../../../src/types/cartTypes';

// Define the type for your route parameters
type RootStackParamList = {
  FoodItemScreen: {
    restaurantId: number;
    restaurantName: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    location: string;
    restaurantImage?: string;
  };
  CartScreen: {
    cartData: CartData;
  };
};

type FoodItemScreenRouteProp = RouteProp<RootStackParamList, 'FoodItemScreen'>;

const RestaurantScreen = () => {
  const route = useRoute<FoodItemScreenRouteProp>();
  const navigation = useNavigation<any>();

  // Extract the params
  const {
    restaurantId,
    restaurantName,
    cuisine,
    rating,
    deliveryTime,
    location,
    restaurantImage,
  } = route.params;

  // Create restaurant info object
  const restaurantInfo: RestaurantInfo = {
    id: restaurantId,
    name: restaurantName,
    cuisine,
    rating,
    deliveryTime,
    location,
    image: restaurantImage,
  };

  // Initialize cart with restaurant info
  const {
    cartItems,
    totalItems,
    totalAmount,
    subtotal,
    deliveryFee,
    taxes,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getCartData,
    setRestaurant,
  } = useCart(restaurantInfo);

  // State for food items
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedFoodDesc, setSelectedFoodDesc] = useState<string | null>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // Animation for cart summary
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Set restaurant info when component mounts
  useEffect(() => {
    setRestaurant(restaurantInfo);
  }, []);

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await getFoodItems(restaurantId.toString());

        // Convert API response to FoodItemType format
        const formattedItems: FoodItemType[] = (response.data || []).map(
          (item: any) => ({
            id: item.id?.toString() || Math.random().toString(),
            name: item.name || 'Unknown Item',
            price: item.price || 0,
            image: item.image || item.imageUrl,
            description: item.description || '',
            category: item.category || '',
            isVegetarian: item.isVegetarian || false,
            quantity: 0,
          }),
        );

        setFoodItems(formattedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load menu items. Please try again.');
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [restaurantId]);

  // Animate cart summary when cart changes
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: totalItems > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [totalItems]);

  // Function to add item to cart
  const handleAddToCart = (item: FoodItemType) => {
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      isVegetarian: item.isVegetarian,
      restaurantId: restaurantId,
      restaurantName: restaurantName,
    };

    addToCart(cartItem);
  };

  // Function to remove item from cart
  const handleRemoveFromCart = (item: FoodItemType) => {
    removeFromCart(item.id);
  };

  // Handle view cart button press
  const handleViewCart = () => {
    const cartData = getCartData();
    if (cartData && cartData.items.length > 0) {
      console.log('Navigating to cart with data:', cartData);
      navigation.navigate('CartScreen', {cartData});
    } else {
      Alert.alert(
        'Empty Cart',
        'Please add some items to your cart before proceeding.',
        [{text: 'OK'}],
      );
    }
  };

  // Handle menu button press
  const handleMenuPress = () => {
    console.log('Menu button pressed');
    // Implementation for showing menu categories
  };

  const getBottomPadding = () => {
    return totalItems > 0 ? 80 : 0;
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
            item={{
              ...item,
              quantity: getItemQuantity(item.id), // Get current quantity from cart
            }}
            onIncrement={() => handleAddToCart(item)}
            onDecrement={() => handleRemoveFromCart(item)}
            onMoreDetails={() => {
              setSelectedFoodDesc(
                item.description || 'No description available.',
              );
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

      {/* Bottom Sheet for Food Description */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Item Details</Text>
          <BottomSheetScrollView>
            <Text style={styles.bottomSheetText}>
              {selectedFoodDesc || 'No description available.'}
            </Text>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
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
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  bottomSheetText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default RestaurantScreen;
