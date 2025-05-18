import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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
