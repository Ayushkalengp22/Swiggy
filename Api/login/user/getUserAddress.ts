import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export async function getUserAddresses(userId: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-addresses`, {
      params: {userId},
    });
    console.log(JSON.stringify(response.data, null, 2), 'responceAddress');
    return response.data;
  } catch (error) {
    throw error;
  }
}
// getUserAddresses(1);
