import {useState, useEffect} from 'react';
import {CartItem, RestaurantInfo, CartData} from '../types/cartTypes';

export const useCart = (restaurant?: RestaurantInfo) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    restaurant || null,
  );

  // Cart calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery above ₹500
  const taxes = subtotal * 0.05; // 5% tax
  const totalAmount = subtotal + deliveryFee + taxes;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id,
    );

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // New item, add to cart
      setCartItems(prev => [...prev, {...item, quantity: 1}]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      if (updatedCart[existingItemIndex].quantity > 1) {
        // Decrease quantity
        updatedCart[existingItemIndex].quantity -= 1;
      } else {
        // Remove item completely
        updatedCart.splice(existingItemIndex, 1);
      }
      setCartItems(updatedCart);
    }
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? {...item, quantity} : item)),
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart data
  const getCartData = (): CartData | null => {
    if (!restaurantInfo) return null;

    return {
      items: cartItems,
      restaurant: restaurantInfo,
      totalItems,
      totalAmount,
      subtotal,
      deliveryFee,
      taxes,
    };
  };

  // Get item quantity
  const getItemQuantity = (itemId: string): number => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Set restaurant info
  const setRestaurant = (restaurant: RestaurantInfo) => {
    setRestaurantInfo(restaurant);
  };

  return {
    cartItems,
    totalItems,
    totalAmount,
    subtotal,
    deliveryFee,
    taxes,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartData,
    getItemQuantity,
    setRestaurant,
    restaurantInfo,
  };
};
