// src/types/index.js
export type FoodItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  quantity?: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type RestaurantInfo = {
  restaurantId: number;
  restaurantName: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  location: string;
};
// src/types/index.js

// Navigation Types
export type RootStackParamList = {
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

// Component Prop Types
export interface CategoryItemProps {
  name: string;
  imageUrl: string;
}

export interface RestaurantCardProps {
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

export interface Restaurant {
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
