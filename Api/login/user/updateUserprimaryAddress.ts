import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.50.11:9000';

// Get authentication token
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token;
};

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

    console.log('Primary address updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error updating primary address:',
      error.response?.data || error.message,
    );
    throw error;
  }
}
