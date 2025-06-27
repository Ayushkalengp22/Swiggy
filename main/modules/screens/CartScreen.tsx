import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import CartItemCard from '../../../src/component/cart/CartItemCard';
import {CartData} from '../../../src/types/cartTypes';

// Colors - replace with your actual colors file
const Colors = {
  orange: '#FF6008',
};

type CartScreenRouteProp = RouteProp<
  {
    CartScreen: {
      cartData?: CartData;
    };
  },
  'CartScreen'
>;

const CartScreen: React.FC = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation();

  // Safely get cartData with error handling
  const cartData = route.params?.cartData;

  // If no cart data, show error screen
  if (!cartData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart Error</Text>
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Cart Data Missing</Text>
          <Text style={styles.errorSubtitle}>
            Unable to load cart information. Please try adding items again.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.continueButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const [items, setItems] = React.useState(cartData.items || []);
  const [subtotal, setSubtotal] = React.useState(cartData.subtotal || 0);
  const [totalAmount, setTotalAmount] = React.useState(
    cartData.totalAmount || 0,
  );

  // Recalculate totals when items change
  React.useEffect(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = newSubtotal > 500 ? 0 : 40;
    const taxes = newSubtotal * 0.05;
    const newTotal = newSubtotal + deliveryFee + taxes;

    setSubtotal(newSubtotal);
    setTotalAmount(newTotal);
  }, [items]);

  const handleIncrement = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? {...item, quantity: item.quantity + 1} : item,
      ),
    );
  };

  const handleDecrement = (itemId: string) => {
    setItems(prev =>
      prev
        .map(item =>
          item.id === itemId && item.quantity > 1
            ? {...item, quantity: item.quantity - 1}
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const handleRemove = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ],
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Order Placed! 🎉',
      `Your order from ${
        cartData.restaurant.name
      } has been placed successfully.\n\nTotal: ₹${totalAmount.toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const deliveryFee = subtotal > 500 ? 0 : 40;
  const taxes = subtotal * 0.05;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious items to get started
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart ({totalItems})</Text>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantCard}>
        <Image
          source={{
            uri:
              cartData.restaurant.image ||
              'https://via.placeholder.com/60x60/FF6008/FFFFFF?text=🍽️',
          }}
          style={styles.restaurantImage}
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{cartData.restaurant.name}</Text>
          <Text style={styles.restaurantDetails}>
            {cartData.restaurant.cuisine} • ⭐ {cartData.restaurant.rating} •{' '}
            {cartData.restaurant.deliveryTime}
          </Text>
          <Text style={styles.restaurantLocation}>
            📍 {cartData.restaurant.location}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {items.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))}
        </View>

        {/* Bill Details */}
        <View style={styles.billContainer}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <View style={styles.deliveryFeeContainer}>
                {deliveryFee === 0 && (
                  <Text style={styles.freeDelivery}>FREE</Text>
                )}
                <Text
                  style={[
                    styles.billValue,
                    deliveryFee === 0 && styles.strikethrough,
                  ]}>
                  ₹{deliveryFee.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Fees</Text>
              <Text style={styles.billValue}>₹{taxes.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>

            {subtotal < 500 && (
              <View style={styles.savingTip}>
                <Text style={styles.savingText}>
                  💡 Add ₹{(500 - subtotal).toFixed(2)} more to get FREE
                  delivery!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}>
          <View style={styles.checkoutContent}>
            <View>
              <Text style={styles.checkoutText}>Place Order</Text>
              <Text style={styles.checkoutSubtext}>{totalItems} items</Text>
            </View>
            <Text style={styles.checkoutAmount}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 16,
    color: Colors.orange,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    flex: 1,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  restaurantLocation: {
    fontSize: 12,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  billContainer: {
    padding: 20,
    paddingTop: 0,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 16,
    color: '#666',
  },
  billValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  deliveryFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeDelivery: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 8,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.orange,
  },
  savingTip: {
    backgroundColor: '#FFF8E7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  savingText: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
  },
  checkoutContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: Colors.orange,
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkoutSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  checkoutAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
});

export default CartScreen;
