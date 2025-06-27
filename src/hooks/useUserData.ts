import {useState, useEffect} from 'react';
import {getUser} from '../../Api/login/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  primaryAddress?: string;
  address?: string;
}

// Function to decode JWT token and extract user ID
const getUserIdFromToken = (token: string): number | null => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;

    // Decode base64 payload
    const decodedPayload = JSON.parse(atob(payload));

    // Common JWT payload fields for user ID: id, userId, user_id, sub
    return (
      decodedPayload.id ||
      decodedPayload.userId ||
      decodedPayload.user_id ||
      decodedPayload.sub ||
      null
    );
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user token from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        setError('No user token found');
        return;
      }

      // Extract user ID from token
      const userId = getUserIdFromToken(userToken);
      if (!userId) {
        setError('Invalid token - could not extract user ID');
        return;
      }

      console.log('Fetching data for user ID:', userId);

      // Call API with the actual user ID
      const response = await getUser(userId);

      if (response && response.data) {
        setUserData(response.data);
        console.log('User data loaded successfully:', response.data);
      } else if (response) {
        setUserData(response);
        console.log('User data loaded successfully:', response);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Alternative method: If your token doesn't contain user ID,
  // you can create a separate function to get current user info
  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        setError('No user token found');
        return;
      }

      // If your backend has an endpoint like /api/me or /api/current-user
      // that returns current user info based on the token
      // You can call that instead:

      // const response = await getCurrentUser(); // This would be a new API function
      // For now, we'll try to decode the token

      const userId = getUserIdFromToken(userToken);
      if (!userId) {
        setError('Invalid token - could not extract user ID');
        return;
      }

      const response = await getUser(userId);

      if (response && response.data) {
        setUserData(response.data);
      } else if (response) {
        setUserData(response);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    userData,
    loading,
    error,
    refetchUserData: fetchUserData,
  };
};
