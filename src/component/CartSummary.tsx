// src/components/Cart/CartSummary.js
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';

const CartSummary = ({
  totalItems,
  totalAmount,
  slideAnimation,
  onViewCart,
}: any) => {
  // Animation style for sliding in the summary
  const animationStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Slide from bottom
        }),
      },
    ],
    opacity: slideAnimation,
  };

  return (
    <Animated.View style={[styles.container, animationStyle]}>
      <View style={styles.cartInfo}>
        <Text style={styles.cartText}>
          {totalItems} item{totalItems > 1 ? 's' : ''} | ₹{totalAmount}
        </Text>
        <TouchableOpacity onPress={onViewCart} style={styles.viewCartButton}>
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
    backgroundColor: '#1C0B0B',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  cartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewCartButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0B0B',
  },
});

export default CartSummary;
