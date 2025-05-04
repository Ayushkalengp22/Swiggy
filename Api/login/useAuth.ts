import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser, registerUser} from './auth'; // replace with your actual API calls

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const token = await loginUser(email, password); // your API
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        setToken(token);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    try {
      setLoading(true);
      const token = await registerUser(email, password, name, phone); // your API
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        setToken(token);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
  };

  return {
    token,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
