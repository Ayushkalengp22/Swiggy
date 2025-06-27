import axios from 'axios';

const API_BASE_URL = 'http://192.168.50.11:9000';

export async function getFoodItems(restroId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-foodItem`, {
      params: {restroId},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
