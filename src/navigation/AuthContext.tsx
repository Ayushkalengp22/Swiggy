// AuthContext.tsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser, registerUser} from '../../Api/login/auth';

// Define auth context types
type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (error) {
        console.error('Failed to load auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const token = await loginUser(email, password);
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    setLoading(true);
    try {
      const token = await registerUser(email, password, name, phone);
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{userToken, loading, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
