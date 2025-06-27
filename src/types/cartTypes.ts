export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  category?: string;
  isVegetarian?: boolean;
  restaurantId?: number;
  restaurantName?: string;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  location: string;
  image?: string;
}

export interface CartData {
  items: CartItem[];
  restaurant: RestaurantInfo;
  totalItems: number;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount?: number;
}

// For existing FoodItem compatibility
export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  isVegetarian?: boolean;
  quantity?: number;
}
