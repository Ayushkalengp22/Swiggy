// src/api/address.api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
export async function updatePrimaryAddress(userId: number, addressId: number) {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-primary-address`, {
      userId,
      addressId,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
