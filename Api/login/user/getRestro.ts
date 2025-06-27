// src/api/restro.api.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.50.11:9000';

export async function getAllRestro() {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-all-restro`);

    return response.data;
  } catch (error) {
    throw error;
  }
}
