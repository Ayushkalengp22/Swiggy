import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/auth';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      email,
      password,
      name,
      phone,
    });

    const token = response.data?.token;
    if (!token) {
      throw new Error('Token not found in response');
    }
    console.log(token);
    return token;
  } catch (error: any) {
    console.error('Register API error:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  console.log(response.data);
  return response.data.token; // assuming API returns { token: '...' }
};
