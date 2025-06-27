import {useState, useEffect} from 'react';
import {getAllRestro} from '../../Api/login/user/getRestro';

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

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestro();
        if (response?.data && Array.isArray(response.data)) {
          setRestaurants(response.data);
        } else {
          setRestaurants([]);
        }
      } catch (error: any) {
        console.error('Error fetching restaurants:', error);
        setError(error.message || 'Failed to fetch restaurants');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return {restaurants, loading, error};
};
