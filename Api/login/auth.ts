import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/auth';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    name,
    phone,
  });
  return response.data.token; // assuming API returns { token: '...' }
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data.token; // assuming API returns { token: '...' }
};
