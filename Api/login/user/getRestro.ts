// src/api/restro.api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export async function getAllRestro() {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-all-restro`);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}
