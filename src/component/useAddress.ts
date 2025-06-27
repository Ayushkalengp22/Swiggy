import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {
  getUserAddresses,
  addUserAddress,
} from '../../Api/login/user/getUserAddress';
import {updatePrimaryAddress} from '../../Api/login/user/updateUserprimaryAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'Home' | 'Work' | 'Other';
  latitude?: number;
  longitude?: number;
  primary?: boolean;
  userId: number;
}

interface AddAddressData {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'Home' | 'Work' | 'Other';
  latitude?: number;
  longitude?: number;
}

// Function to decode JWT token and extract user ID
const getUserIdFromToken = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(atob(payload));

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

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  // Get current user ID from token
  const getCurrentUserId = async (): Promise<number | null> => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'User session expired. Please login again.');
        return null;
      }

      const userId = getUserIdFromToken(userToken);
      if (!userId) {
        Alert.alert('Error', 'Invalid session. Please login again.');
        return null;
      }

      return userId;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Initialize and fetch addresses
  const initialize = async () => {
    const userId = await getCurrentUserId();
    if (userId) {
      setCurrentUserId(userId);
      await fetchAddresses(userId);
    } else {
      setLoading(false);
    }
  };

  // Fetch addresses from API
  const fetchAddresses = async (userId?: number) => {
    setLoading(true);
    try {
      const userIdToUse = userId || currentUserId;
      if (!userIdToUse) {
        Alert.alert('Error', 'Unable to identify user. Please login again.');
        return;
      }

      console.log('Fetching addresses for user ID:', userIdToUse);
      const response = await getUserAddresses(userIdToUse);

      if (
        response &&
        response.status === 'success' &&
        Array.isArray(response.data)
      ) {
        setAddresses(response.data);
        console.log('Addresses loaded:', response.data);
      } else {
        console.log('No addresses found or invalid response format');
        setAddresses([]);
      }
    } catch (error: any) {
      console.error('Error fetching addresses:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again to continue.');
      } else if (error.response?.status === 400) {
        Alert.alert('Error', 'Invalid request. Please try again.');
      } else {
        Alert.alert(
          'Error',
          'Failed to load addresses. Please check your connection and try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new address
  const addAddress = async (addressData: AddAddressData) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Unable to save address. Please login again.');
      return false;
    }

    // Validate required fields
    if (!addressData.street || !addressData.city || !addressData.type) {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields:\n• Street Address\n• City\n• Address Type',
      );
      return false;
    }

    setSaving(true);
    try {
      console.log('Saving address:', addressData);

      // Call API to save address
      const response = await addUserAddress({
        userId: currentUserId,
        ...addressData,
      });

      if (response && response.status === 'success') {
        // Refresh addresses from server to get the latest data
        await fetchAddresses();
        Alert.alert('Success! 🎉', 'Your address has been saved successfully.');
        return true;
      } else {
        throw new Error('Failed to save address');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again to continue.');
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.errors?.[0]?.msg || 'Invalid data provided.';
        Alert.alert('Validation Error', errorMessage);
      } else {
        Alert.alert('Error', 'Failed to save address. Please try again.');
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update primary address
  const setPrimaryAddress = async (addressId: number) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Unable to update address. Please login again.');
      return false;
    }

    try {
      console.log(
        'Setting primary address:',
        addressId,
        'for user:',
        currentUserId,
      );

      const response = await updatePrimaryAddress(currentUserId, addressId);

      if (response && response.status === 'success') {
        // Update local state - mark all as non-primary, then set the selected one as primary
        setAddresses(prev =>
          prev.map(addr => ({
            ...addr,
            primary: addr.id === addressId,
          })),
        );
        Alert.alert('Success! ⭐', 'Primary address updated successfully.');
        return true;
      } else {
        throw new Error(
          response?.message || 'Failed to update primary address',
        );
      }
    } catch (error: any) {
      console.error('Error updating primary address:', error);

      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again to continue.');
      } else if (error.response?.status === 400) {
        const errorMsg =
          error.response?.data?.errors?.[0]?.msg || 'Invalid request data.';
        Alert.alert('Error', errorMsg);
      } else {
        Alert.alert(
          'Error',
          error.message ||
            'Failed to update primary address. Please try again.',
        );
      }
      return false;
    }
  };

  // Delete address (you'll need to implement this API endpoint in your backend)
  const deleteAddress = (id: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // For now, just remove from local state
            // TODO: Implement delete API endpoint in backend
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            if (selectedAddressId === id) {
              setSelectedAddressId(null);
            }
            Alert.alert('Deleted', 'Address has been removed.');
          },
        },
      ],
    );
  };

  // Select address
  const selectAddress = (id: number) => {
    setSelectedAddressId(id);
  };

  useEffect(() => {
    initialize();
  }, []);

  return {
    addresses,
    loading,
    saving,
    currentUserId,
    selectedAddressId,
    addAddress,
    setPrimaryAddress,
    deleteAddress,
    selectAddress,
    refetch: initialize,
  };
};
