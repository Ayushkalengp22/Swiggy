import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {CartItem} from '../../types/cartTypes';

// You'll need to create this Colors file or import from your existing one
const Colors = {
  orange: '#FF6008',
};

interface CartItemCardProps {
  item: CartItem;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[styles.container, {transform: [{scale: scaleAnim}]}]}>
      <View style={styles.card}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                item.image ||
                'https://via.placeholder.com/80x80/FF6008/FFFFFF?text=🍽️',
            }}
            style={styles.foodImage}
            resizeMode="cover"
          />
          {item.isVegetarian && (
            <View style={styles.vegIndicator}>
              <View style={styles.vegDot} />
            </View>
          )}
        </View>

        {/* Item Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(item.id)}>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.totalPrice}>
                Total: ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  handlePress();
                  onDecrement(item.id);
                }}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>

              <TouchableOpacity
                style={[styles.quantityButton, styles.incrementButton]}
                onPress={() => {
                  handlePress();
                  onIncrement(item.id);
                }}>
                <Text style={[styles.quantityButtonText, styles.incrementText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  vegIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.orange,
  },
  totalPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  incrementButton: {
    backgroundColor: Colors.orange,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  incrementText: {
    color: '#fff',
  },
  quantityDisplay: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CartItemCard;
