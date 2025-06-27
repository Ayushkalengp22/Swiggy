import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.50.11:9000';

// Get authentication token
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token;
};

// Get user addresses
export async function getUserAddresses(userId: number) {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/get-addresses`, {
      params: {userId},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(JSON.stringify(response.data, null, 2), 'responseAddress');
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}

// Add new address
export async function addUserAddress(addressData: {
  userId: number;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'Home' | 'Work' | 'Other';
  latitude?: number;
  longitude?: number;
}) {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/add-address`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Address saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
}

// Update primary address
export async function updatePrimaryAddress(userId: number, addressId: number) {
  try {
    const token = await getAuthToken();
    const response = await axios.put(
      `${API_BASE_URL}/update-primary-address`,
      {
        userId,
        addressId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Primary address updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating primary address:', error);
    throw error;
  }
}
